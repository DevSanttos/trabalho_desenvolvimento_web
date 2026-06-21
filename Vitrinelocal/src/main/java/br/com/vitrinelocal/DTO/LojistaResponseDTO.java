package br.com.vitrinelocal.DTO;

import br.com.vitrinelocal.model.Lojista;

// Resposta sem o campo senha — nunca devolve o hash ao cliente.
public record LojistaResponseDTO(
        Long id,
        String nomeLoja,
        String email
) {
    public static LojistaResponseDTO fromEntity(Lojista lojista) {
        return new LojistaResponseDTO(lojista.getId(), lojista.getNomeLoja(), lojista.getEmail());
    }
}
