package br.com.vitrinelocal.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "lojista")
@Getter
@Setter
@NoArgsConstructor
public class Lojista {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String nomeLoja;

    @Column(nullable = false, unique = true)
    private String email;

    // Armazena o hash BCrypt da senha, nunca o texto puro.
    @Column(nullable = false)
    private String senha;
}
