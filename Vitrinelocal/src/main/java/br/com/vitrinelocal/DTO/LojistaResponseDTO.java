package br.com.vitrinelocal.DTO;

import java.util.UUID;

import br.com.vitrinelocal.model.Lojista;

// Resposta sem o campo senha.
public record LojistaResponseDTO(
        UUID id,
        String email,
        LojaResponseDTO loja
) {
    public static LojistaResponseDTO fromEntity(Lojista lojista) {
        return new LojistaResponseDTO(
                lojista.getId(),
                lojista.getEmail(),
                LojaResponseDTO.fromEntity(lojista.getLoja())
        );
    }
}
