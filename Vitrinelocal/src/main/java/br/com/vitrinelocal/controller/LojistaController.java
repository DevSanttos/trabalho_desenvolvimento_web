package br.com.vitrinelocal.controller;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.vitrinelocal.DTO.AlterarSenhaDTO;
import br.com.vitrinelocal.DTO.AtualizarContaDTO;
import br.com.vitrinelocal.DTO.CadastroLojistaDTO;
import br.com.vitrinelocal.DTO.LoginDTO;
import br.com.vitrinelocal.DTO.LojistaResponseDTO;
import br.com.vitrinelocal.service.LojistaService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/lojistas")
public class LojistaController {

    private final LojistaService lojistaService;

    public LojistaController(LojistaService lojistaService) {
        this.lojistaService = lojistaService;
    }

    @PostMapping("/cadastro")
    public ResponseEntity<LojistaResponseDTO> cadastrar(@Valid @RequestBody CadastroLojistaDTO dto) {
        LojistaResponseDTO response = lojistaService.cadastrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LojistaResponseDTO> login(@Valid @RequestBody LoginDTO dto) {
        LojistaResponseDTO response = lojistaService.login(dto);
        return ResponseEntity.ok(response);
    }

    // Configurações: atualizar nome da loja, email e telefone.
    @PutMapping("/{id}/conta")
    public ResponseEntity<LojistaResponseDTO> atualizarConta(@PathVariable UUID id,
                                                             @Valid @RequestBody AtualizarContaDTO dto) {
        return ResponseEntity.ok(lojistaService.atualizarConta(id, dto));
    }

    // Configurações: trocar a senha.
    @PutMapping("/{id}/senha")
    public ResponseEntity<Void> alterarSenha(@PathVariable UUID id,
                                             @Valid @RequestBody AlterarSenhaDTO dto) {
        lojistaService.alterarSenha(id, dto);
        return ResponseEntity.noContent().build();
    }
}
