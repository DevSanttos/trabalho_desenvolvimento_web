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

    // Versão do nome amigável para URL (ex: "casa-design"). Usado na vitrine pública.
    @Column(nullable = false, unique = true)
    private String slug;

    // Campos preenchidos na página "Minha loja". Nullable.
    private String categoria;
    private String cidade;
    private String endereco;
    private String whatsapp;
    private String logoUrl;

    // Horário de funcionamento (texto simples, ex: "09:00").
    private String horaSemanaAbertura;
    private String horaSemanaFechamento;
    private String horaSabadoAbertura;
    private String horaSabadoFechamento;
}
