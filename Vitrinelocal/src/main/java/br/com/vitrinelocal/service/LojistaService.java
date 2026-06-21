package br.com.vitrinelocal.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.vitrinelocal.DTO.CadastroLojistaDTO;
import br.com.vitrinelocal.DTO.LoginDTO;
import br.com.vitrinelocal.DTO.LojistaResponseDTO;
import br.com.vitrinelocal.exception.CredenciaisInvalidasException;
import br.com.vitrinelocal.exception.EmailJaCadastradoException;
import br.com.vitrinelocal.model.Lojista;
import br.com.vitrinelocal.repository.LojistaRepository;

@Service
public class LojistaService {

    private final LojistaRepository lojistaRepository;
    private final PasswordEncoder passwordEncoder;

    public LojistaService(LojistaRepository lojistaRepository, PasswordEncoder passwordEncoder) {
        this.lojistaRepository = lojistaRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public LojistaResponseDTO cadastrar(CadastroLojistaDTO dto) {
        if (lojistaRepository.existsByEmail(dto.email())) {
            throw new EmailJaCadastradoException("Já existe um lojista cadastrado com este email");
        }

        Lojista lojista = new Lojista();
        lojista.setNomeLoja(dto.nomeLoja());
        lojista.setEmail(dto.email());
        // Gera o hash BCrypt — a senha em texto puro nunca é persistida.
        lojista.setSenha(passwordEncoder.encode(dto.senha()));

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
}
