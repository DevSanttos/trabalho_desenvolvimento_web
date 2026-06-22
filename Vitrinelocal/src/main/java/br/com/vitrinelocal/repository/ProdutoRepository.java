package br.com.vitrinelocal.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.vitrinelocal.model.Produto;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, UUID> {

    // Todos os produtos de uma loja (usado no painel do lojista).
    List<Produto> findByLojaId(UUID lojaId);

    // Apenas os produtos ativos de uma loja, buscados pelo slug (vitrine pública).
    List<Produto> findByLojaSlugAndAtivoTrue(String slug);

    // Quantidade de produtos de uma loja (para o card da loja na cidade).
    long countByLojaId(UUID lojaId);
}
