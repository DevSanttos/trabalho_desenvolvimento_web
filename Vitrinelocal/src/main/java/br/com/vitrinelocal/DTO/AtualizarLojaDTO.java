package br.com.vitrinelocal.DTO;

import jakarta.validation.constraints.NotBlank;

// Campos editáveis da loja (o slug NÃO muda, para não quebrar os links públicos).
public record AtualizarLojaDTO(

        @NotBlank(message = "O nome da loja é obrigatório")
        String nome,

        String descricao,
        String categoria,
        String cidade,
        String endereco,
        String cep,
        String whatsapp,
        String emailContato,
        String instagram,
        String logoUrl,
        String horaSemanaAbertura,
        String horaSemanaFechamento,
        String horaSabadoAbertura,
        String horaSabadoFechamento
) {
}
