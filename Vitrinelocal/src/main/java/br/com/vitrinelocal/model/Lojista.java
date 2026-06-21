package br.com.vitrinelocal.model;

import java.util.UUID;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "lojista")
@Getter
@Setter
@NoArgsConstructor
public class Lojista {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String email;

    // Armazena o hash BCrypt da senha, nunca o texto puro.
    @Column(nullable = false)
    private String senha;

    // Cada lojista é dono de uma loja. O cascade persiste a loja junto com o lojista.
    @OneToOne(cascade = CascadeType.ALL, optional = false)
    @JoinColumn(name = "loja_id", unique = true)
    private Loja loja;
}
