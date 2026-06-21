package br.com.vitrinelocal.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CadastroLojistaDTO(

        @NotBlank(message = "O nome da loja é obrigatório")
        String nomeLoja,

        @NotBlank(message = "O email é obrigatório")
        @Email(message = "Email inválido")
        String email,

        @NotBlank(message = "A senha é obrigatória")
        @Size(min = 6, message = "A senha deve ter ao menos 6 caracteres")
        String senha
) {
}
