package br.com.vitrinelocal.service;

import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.vitrinelocal.DTO.AlterarSenhaDTO;
import br.com.vitrinelocal.DTO.AtualizarContaDTO;
import br.com.vitrinelocal.DTO.CadastroLojistaDTO;
import br.com.vitrinelocal.DTO.LoginDTO;
import br.com.vitrinelocal.DTO.LojistaResponseDTO;
import br.com.vitrinelocal.exception.CredenciaisInvalidasException;
import br.com.vitrinelocal.exception.EmailJaCadastradoException;
import br.com.vitrinelocal.exception.RecursoNaoEncontradoException;
import br.com.vitrinelocal.model.Loja;
import br.com.vitrinelocal.model.Lojista;
import br.com.vitrinelocal.repository.LojaRepository;
import br.com.vitrinelocal.repository.LojistaRepository;
import br.com.vitrinelocal.util.SlugUtil;

@Service
public class LojistaService {

    private final LojistaRepository lojistaRepository;
    private final LojaRepository lojaRepository;
    private final PasswordEncoder passwordEncoder;

    public LojistaService(LojistaRepository lojistaRepository, LojaRepository lojaRepository, PasswordEncoder passwordEncoder) {
        this.lojistaRepository = lojistaRepository;
        this.lojaRepository = lojaRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public LojistaResponseDTO cadastrar(CadastroLojistaDTO dto) {
        if (lojistaRepository.existsByEmail(dto.email())) {
            throw new EmailJaCadastradoException("Já existe um lojista cadastrado com este email");
        }

        Loja loja = new Loja();
        loja.setNome(dto.nomeLoja());
        loja.setSlug(gerarSlugUnico(dto.nomeLoja()));

        Lojista lojista = new Lojista();
        lojista.setEmail(dto.email());
        lojista.setSenha(passwordEncoder.encode(dto.senha()));
        lojista.setLoja(loja);

        Lojista salvo = lojistaRepository.save(lojista);
        return LojistaResponseDTO.fromEntity(salvo);
    }

    @Transactional(readOnly = true)
    public LojistaResponseDTO login(LoginDTO dto) {
        Lojista lojista = lojistaRepository.findByEmail(dto.email()).orElseThrow(() -> new CredenciaisInvalidasException("Email ou senha inválidos"));

        if (!passwordEncoder.matches(dto.senha(), lojista.getSenha())) {
            throw new CredenciaisInvalidasException("Email ou senha inválidos");
        }

        return LojistaResponseDTO.fromEntity(lojista);
    }


    @Transactional
    public LojistaResponseDTO atualizarConta(UUID lojistaId, AtualizarContaDTO dto) {
        Lojista lojista = buscarLojista(lojistaId);

        if (!lojista.getEmail().equalsIgnoreCase(dto.email()) && lojistaRepository.existsByEmail(dto.email())) {
            throw new EmailJaCadastradoException("Já existe um lojista com este email");
        }

        lojista.setEmail(dto.email());
        lojista.getLoja().setNome(dto.nomeLoja());
        lojista.getLoja().setWhatsapp(dto.telefone());

        return LojistaResponseDTO.fromEntity(lojistaRepository.save(lojista));
    }

    @Transactional
    public void alterarSenha(UUID lojistaId, AlterarSenhaDTO dto) {
        Lojista lojista = buscarLojista(lojistaId);
        if (!passwordEncoder.matches(dto.senhaAtual(), lojista.getSenha())) {
            throw new CredenciaisInvalidasException("A senha atual está incorreta");
        }
        lojista.setSenha(passwordEncoder.encode(dto.novaSenha()));
        lojistaRepository.save(lojista);
    }

    private Lojista buscarLojista(UUID id) {
        return lojistaRepository.findById(id).orElseThrow(() -> new RecursoNaoEncontradoException("Lojista não encontrado"));
    }

    private String gerarSlugUnico(String nome) {
        String base = SlugUtil.gerar(nome);
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
}
