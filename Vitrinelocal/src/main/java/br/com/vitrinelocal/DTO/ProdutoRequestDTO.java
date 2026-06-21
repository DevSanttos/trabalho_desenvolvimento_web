package br.com.vitrinelocal.DTO;

import java.math.BigDecimal;
import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record ProdutoRequestDTO(

        // Obrigatório na criação (POST); ignorado na edição (PUT).
        UUID lojaId,

        @NotBlank(message = "O nome do produto é obrigatório")
        String nome,

        @NotNull(message = "O preço é obrigatório")
        @Positive(message = "O preço deve ser maior que zero")
        BigDecimal preco,

        @NotBlank(message = "A descrição curta é obrigatória")
        String descricaoCurta,

        String descricaoCompleta,

        String marca,

        @NotBlank(message = "A categoria é obrigatória")
        String categoria,

        String imagemUrl,

        boolean ativo
) {
}
