package br.com.vitrinelocal.DTO;

import java.util.UUID;

import br.com.vitrinelocal.model.Loja;

public record LojaResponseDTO(
        UUID id,
        String nome,
        String slug
) {
    public static LojaResponseDTO fromEntity(Loja loja) {
        return new LojaResponseDTO(loja.getId(), loja.getNome(), loja.getSlug());
    }
}
