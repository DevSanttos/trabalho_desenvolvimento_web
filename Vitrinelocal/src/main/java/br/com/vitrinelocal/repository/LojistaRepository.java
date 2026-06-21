package br.com.vitrinelocal.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.vitrinelocal.model.Lojista;

@Repository
public interface LojistaRepository extends JpaRepository<Lojista, UUID> {

    Optional<Lojista> findByEmail(String email);

    boolean existsByEmail(String email);
}
