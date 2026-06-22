package br.com.vitrinelocal.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.vitrinelocal.DTO.CidadeResumoDTO;
import br.com.vitrinelocal.DTO.LojaResumoDTO;
import br.com.vitrinelocal.service.CidadeService;

// Endpoints públicos de cidades (home e página da cidade).
@RestController
@RequestMapping("/api/cidades")
public class CidadeController {

    private final CidadeService cidadeService;

    public CidadeController(CidadeService cidadeService) {
        this.cidadeService = cidadeService;
    }

    @GetMapping
    public ResponseEntity<List<CidadeResumoDTO>> listar() {
        return ResponseEntity.ok(cidadeService.listarCidades());
    }

    @GetMapping("/{slug}/lojas")
    public ResponseEntity<List<LojaResumoDTO>> listarLojas(@PathVariable String slug) {
        return ResponseEntity.ok(cidadeService.listarLojasPorCidade(slug));
    }
}
