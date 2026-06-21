package br.com.vitrinelocal.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.vitrinelocal.model.Lojista;

@Repository
public interface LojistaRepository extends JpaRepository<Lojista, Long> {

    Optional<Lojista> findByEmail(String email);

    boolean existsByEmail(String email);
}
