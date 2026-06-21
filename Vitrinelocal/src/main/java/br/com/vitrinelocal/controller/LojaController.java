package br.com.vitrinelocal.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.vitrinelocal.DTO.LojaResponseDTO;
import br.com.vitrinelocal.DTO.ProdutoResponseDTO;
import br.com.vitrinelocal.service.LojaService;
import br.com.vitrinelocal.service.ProdutoService;

// Endpoints públicos da vitrine: a loja é identificada pelo slug (nome na URL).
@RestController
@RequestMapping("/api/lojas")
public class LojaController {

    private final LojaService lojaService;
    private final ProdutoService produtoService;

    public LojaController(LojaService lojaService, ProdutoService produtoService) {
        this.lojaService = lojaService;
        this.produtoService = produtoService;
    }

    // Dados do cabeçalho da loja (nome, etc.).
    @GetMapping("/{slug}")
    public ResponseEntity<LojaResponseDTO> buscarPorSlug(@PathVariable String slug) {
        return ResponseEntity.ok(lojaService.buscarPorSlug(slug));
    }

    // Produtos ativos da vitrine pública.
    @GetMapping("/{slug}/produtos")
    public ResponseEntity<List<ProdutoResponseDTO>> listarProdutos(@PathVariable String slug) {
        return ResponseEntity.ok(produtoService.listarPublicosPorSlug(slug));
    }
}
