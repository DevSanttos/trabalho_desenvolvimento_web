package br.com.vitrinelocal.service;

import java.text.Normalizer;
import java.util.Locale;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.vitrinelocal.DTO.CadastroLojistaDTO;
import br.com.vitrinelocal.DTO.LoginDTO;
import br.com.vitrinelocal.DTO.LojistaResponseDTO;
import br.com.vitrinelocal.exception.CredenciaisInvalidasException;
import br.com.vitrinelocal.exception.EmailJaCadastradoException;
import br.com.vitrinelocal.model.Loja;
import br.com.vitrinelocal.model.Lojista;
import br.com.vitrinelocal.repository.LojaRepository;
import br.com.vitrinelocal.repository.LojistaRepository;

@Service
public class LojistaService {

    private final LojistaRepository lojistaRepository;
    private final LojaRepository lojaRepository;
    private final PasswordEncoder passwordEncoder;

    public LojistaService(LojistaRepository lojistaRepository, LojaRepository lojaRepository,
                          PasswordEncoder passwordEncoder) {
        this.lojistaRepository = lojistaRepository;
        this.lojaRepository = lojaRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public LojistaResponseDTO cadastrar(CadastroLojistaDTO dto) {
        if (lojistaRepository.existsByEmail(dto.email())) {
            throw new EmailJaCadastradoException("Já existe um lojista cadastrado com este email");
        }

        // A loja é criada junto com o lojista (cascade) e fica vinculada a ele.
        Loja loja = new Loja();
        loja.setNome(dto.nomeLoja());
        loja.setSlug(gerarSlugUnico(dto.nomeLoja()));

        Lojista lojista = new Lojista();
        lojista.setEmail(dto.email());
        // Gera o hash BCrypt — a senha em texto puro nunca é persistida.
        lojista.setSenha(passwordEncoder.encode(dto.senha()));
        lojista.setLoja(loja);

        Lojista salvo = lojistaRepository.save(lojista);
        return LojistaResponseDTO.fromEntity(salvo);
    }

    @Transactional(readOnly = true)
    public LojistaResponseDTO login(LoginDTO dto) {
        Lojista lojista = lojistaRepository.findByEmail(dto.email())
                .orElseThrow(() -> new CredenciaisInvalidasException("Email ou senha inválidos"));

        // Compara a senha informada com o hash armazenado.
        if (!passwordEncoder.matches(dto.senha(), lojista.getSenha())) {
            throw new CredenciaisInvalidasException("Email ou senha inválidos");
        }

        return LojistaResponseDTO.fromEntity(lojista);
    }

    // Gera um slug a partir do nome e garante que seja único (anexa -2, -3, ... se preciso).
    private String gerarSlugUnico(String nome) {
        String base = gerarSlug(nome);
        if (base.isEmpty()) {
            base = "loja";
        }
        String slug = base;
        int sufixo = 2;
        while (lojaRepository.existsBySlug(slug)) {
            slug = base + "-" + sufixo;
            sufixo++;
        }
        return slug;
    }

    // Transforma "Casa & Design" em "casa-design": minúsculas, sem acentos, símbolos viram hífen.
    private String gerarSlug(String texto) {
        String semAcento = Normalizer.normalize(texto, Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
        return semAcento.toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-+)|(-+$)", "");
    }
}
