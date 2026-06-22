package br.com.vitrinelocal.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

// Edição de "Informações da loja" em Configurações.
public record AtualizarContaDTO(

        @NotBlank(message = "O nome da loja é obrigatório")
        String nomeLoja,

        @NotBlank(message = "O email é obrigatório")
        @Email(message = "Email inválido")
        String email,

        String telefone
) {
}
