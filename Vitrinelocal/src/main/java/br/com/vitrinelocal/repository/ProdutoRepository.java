package br.com.vitrinelocal.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.vitrinelocal.model.Produto;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, UUID> {

    List<Produto> findByLojaId(UUID lojaId);

    List<Produto> findByLojaSlugAndAtivoTrue(String slug);

    long countByLojaId(UUID lojaId);
}
