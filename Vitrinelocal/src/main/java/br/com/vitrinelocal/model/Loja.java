package br.com.vitrinelocal.model;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "loja")
@Getter
@Setter
@NoArgsConstructor
public class Loja {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String nome;

    // Campos preenchidos depois (página "Minha loja"). Nullable por enquanto.
    private String descricao;
    private String categoria;
    private String cidade;
    private String endereco;
    private String cep;
    private String whatsapp;
    private String emailContato;
    private String instagram;
}
