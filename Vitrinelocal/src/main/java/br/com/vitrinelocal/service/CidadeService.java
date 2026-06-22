package br.com.vitrinelocal.service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.vitrinelocal.DTO.CidadeResumoDTO;
import br.com.vitrinelocal.DTO.LojaResumoDTO;
import br.com.vitrinelocal.model.Loja;
import br.com.vitrinelocal.repository.LojaRepository;
import br.com.vitrinelocal.repository.ProdutoRepository;
import br.com.vitrinelocal.util.SlugUtil;

// Cidades são derivadas do campo "cidade" das lojas (não há entidade Cidade).
@Service
public class CidadeService {

    private final LojaRepository lojaRepository;
    private final ProdutoRepository produtoRepository;

    public CidadeService(LojaRepository lojaRepository, ProdutoRepository produtoRepository) {
        this.lojaRepository = lojaRepository;
        this.produtoRepository = produtoRepository;
    }

    @Transactional(readOnly = true)
    public List<CidadeResumoDTO> listarCidades() {
        // Agrupa as lojas pelo slug da cidade, preservando o nome original e contando.
        Map<String, CidadeAgrupada> mapa = new LinkedHashMap<>();
        for (Loja loja : lojaRepository.findAll()) {
            if (loja.getCidade() == null || loja.getCidade().isBlank()) {
                continue;
            }
            String slug = SlugUtil.gerar(loja.getCidade());
            CidadeAgrupada c = mapa.computeIfAbsent(slug, s -> new CidadeAgrupada(loja.getCidade().trim()));
            c.total++;
        }
        List<CidadeResumoDTO> resultado = new ArrayList<>();
        mapa.forEach((slug, c) -> resultado.add(new CidadeResumoDTO(c.nome, slug, c.total)));
        return resultado;
    }

    @Transactional(readOnly = true)
    public List<LojaResumoDTO> listarLojasPorCidade(String cidadeSlug) {
        List<LojaResumoDTO> resultado = new ArrayList<>();
        for (Loja loja : lojaRepository.findAll()) {
            if (loja.getCidade() == null || loja.getCidade().isBlank()) {
                continue;
            }
            if (!SlugUtil.gerar(loja.getCidade()).equals(cidadeSlug)) {
                continue;
            }
            resultado.add(new LojaResumoDTO(
                    loja.getNome(),
                    loja.getSlug(),
                    loja.getCategoria(),
                    loja.getEndereco(),
                    loja.getCidade(),
                    produtoRepository.countByLojaId(loja.getId())
            ));
        }
        return resultado;
    }

    // Auxiliar para acumular nome + contagem por cidade.
    private static class CidadeAgrupada {
        final String nome;
        long total = 0;

        CidadeAgrupada(String nome) {
            this.nome = nome;
        }
    }
}
