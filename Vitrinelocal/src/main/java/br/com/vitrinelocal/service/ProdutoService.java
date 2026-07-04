package br.com.vitrinelocal.service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.vitrinelocal.DTO.ProdutoRequestDTO;
import br.com.vitrinelocal.DTO.ProdutoResponseDTO;
import br.com.vitrinelocal.exception.RecursoNaoEncontradoException;
import br.com.vitrinelocal.model.Loja;
import br.com.vitrinelocal.model.Produto;
import br.com.vitrinelocal.repository.LojaRepository;
import br.com.vitrinelocal.repository.ProdutoRepository;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;
    private final LojaRepository lojaRepository;

    public ProdutoService(ProdutoRepository produtoRepository, LojaRepository lojaRepository) {
        this.produtoRepository = produtoRepository;
        this.lojaRepository = lojaRepository;
    }

    @Transactional
    public ProdutoResponseDTO criar(ProdutoRequestDTO dto) {
        Loja loja = lojaRepository.findById(dto.lojaId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Loja não encontrada"));

        Produto produto = new Produto();
        produto.setLoja(loja);
        aplicarDados(produto, dto);

        return ProdutoResponseDTO.fromEntity(produtoRepository.save(produto));
    }

    @Transactional(readOnly = true)
    public ProdutoResponseDTO buscarPorId(UUID id) {
        return ProdutoResponseDTO.fromEntity(buscarEntidade(id));
    }

    @Transactional(readOnly = true)
    public List<ProdutoResponseDTO> listarPorLoja(UUID lojaId) {
        // Converte cada produto da loja em um DTO de resposta.
        List<ProdutoResponseDTO> resultado = new ArrayList<>();
        for (Produto produto : produtoRepository.findByLojaId(lojaId)) {
            resultado.add(ProdutoResponseDTO.fromEntity(produto));
        }
        return resultado;
    }

    @Transactional(readOnly = true)
    public List<ProdutoResponseDTO> listarPublicosPorSlug(String slug) {
        // Apenas os produtos ativos da loja (vitrine pública).
        List<ProdutoResponseDTO> resultado = new ArrayList<>();
        for (Produto produto : produtoRepository.findByLojaSlugAndAtivoTrue(slug)) {
            resultado.add(ProdutoResponseDTO.fromEntity(produto));
        }
        return resultado;
    }

    @Transactional
    public ProdutoResponseDTO atualizar(UUID id, ProdutoRequestDTO dto) {
        Produto produto = buscarEntidade(id);
        aplicarDados(produto, dto);
        return ProdutoResponseDTO.fromEntity(produtoRepository.save(produto));
    }

    @Transactional
    public void excluir(UUID id) {
        if (!produtoRepository.existsById(id)) {
            throw new RecursoNaoEncontradoException("Produto não encontrado");
        }
        produtoRepository.deleteById(id);
    }

    private Produto buscarEntidade(UUID id) {
        return produtoRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Produto não encontrado"));
    }

    // Copia os campos do DTO para a entidade (a loja não muda na edição).
    private void aplicarDados(Produto produto, ProdutoRequestDTO dto) {
        produto.setNome(dto.nome());
        produto.setPreco(dto.preco());
        produto.setDescricaoCurta(dto.descricaoCurta());
        produto.setDescricaoCompleta(dto.descricaoCompleta());
        produto.setMarca(dto.marca());
        produto.setCategoria(dto.categoria());
        produto.setImagens(dto.imagens() != null ? dto.imagens() : new ArrayList<>());
        produto.setAtivo(dto.ativo());
    }
}
