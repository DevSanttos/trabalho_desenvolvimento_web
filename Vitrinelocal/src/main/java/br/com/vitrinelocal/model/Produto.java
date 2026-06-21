package br.com.vitrinelocal.model;

import java.math.BigDecimal;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "produto")
@Getter
@Setter
@NoArgsConstructor
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private BigDecimal preco;

    @Column(nullable = false)
    private String descricaoCurta;

    @Column(columnDefinition = "TEXT")
    private String descricaoCompleta;

    private String marca;

    @Column(nullable = false)
    private String categoria;

    private String imagemUrl;

    // Visível na vitrine pública quando true.
    @Column(nullable = false)
    private boolean ativo = true;

    @Column(nullable = false)
    private int visualizacoes = 0;

    // Muitos produtos pertencem a uma loja.
    @ManyToOne(optional = false)
    @JoinColumn(name = "loja_id")
    private Loja loja;
}
