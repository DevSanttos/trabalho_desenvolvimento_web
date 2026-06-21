package br.com.vitrinelocal.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.vitrinelocal.model.Loja;

@Repository
public interface LojaRepository extends JpaRepository<Loja, UUID> {

    Optional<Loja> findBySlug(String slug);

    boolean existsBySlug(String slug);
}
