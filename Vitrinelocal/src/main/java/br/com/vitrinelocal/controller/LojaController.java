package br.com.vitrinelocal.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.vitrinelocal.DTO.AtualizarLojaDTO;
import br.com.vitrinelocal.DTO.LojaDetalheDTO;
import br.com.vitrinelocal.DTO.ProdutoResponseDTO;
import br.com.vitrinelocal.service.LojaService;
import br.com.vitrinelocal.service.ProdutoService;
import jakarta.validation.Valid;

// Endpoints da loja: leitura pública pelo slug; edição pelo id (painel).
@RestController
@RequestMapping("/api/lojas")
public class LojaController {

    private final LojaService lojaService;
    private final ProdutoService produtoService;

    public LojaController(LojaService lojaService, ProdutoService produtoService) {
        this.lojaService = lojaService;
        this.produtoService = produtoService;
    }

    // Dados completos da loja (cabeçalho público e carregamento do formulário "Minha loja").
    @GetMapping("/{slug}")
    public ResponseEntity<LojaDetalheDTO> buscarPorSlug(@PathVariable String slug) {
        return ResponseEntity.ok(lojaService.buscarPorSlug(slug));
    }

    // Produtos ativos da vitrine pública.
    @GetMapping("/{slug}/produtos")
    public ResponseEntity<List<ProdutoResponseDTO>> listarProdutos(@PathVariable String slug) {
        return ResponseEntity.ok(produtoService.listarPublicosPorSlug(slug));
    }

    // Atualização dos dados da loja (página "Minha loja").
    @PutMapping("/{id}")
    public ResponseEntity<LojaDetalheDTO> atualizar(@PathVariable UUID id,
                                                    @Valid @RequestBody AtualizarLojaDTO dto) {
        return ResponseEntity.ok(lojaService.atualizar(id, dto));
    }
}
