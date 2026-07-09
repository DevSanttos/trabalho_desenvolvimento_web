package br.com.vitrinelocal.DTO;

import jakarta.validation.constraints.NotBlank;

// Campos editáveis da loja.
public record AtualizarLojaDTO(

        @NotBlank(message = "O nome da loja é obrigatório")
        String nome,

        String categoria,
        String cidade,
        String endereco,
        String whatsapp,
        String logoUrl,
        String horaSemanaAbertura,
        String horaSemanaFechamento,
        String horaSabadoAbertura,
        String horaSabadoFechamento
) {
}
