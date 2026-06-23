package br.com.vitrinelocal.DTO;

import java.util.UUID;

import br.com.vitrinelocal.model.Loja;

// Dados completos da loja — usados no cabeçalho público e no formulário "Minha loja".
public record LojaDetalheDTO(
        UUID id,
        String nome,
        String slug,
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
    public static LojaDetalheDTO fromEntity(Loja l) {
        return new LojaDetalheDTO(
                l.getId(),
                l.getNome(),
                l.getSlug(),
                l.getCategoria(),
                l.getCidade(),
                l.getEndereco(),
                l.getWhatsapp(),
                l.getLogoUrl(),
                l.getHoraSemanaAbertura(),
                l.getHoraSemanaFechamento(),
                l.getHoraSabadoAbertura(),
                l.getHoraSabadoFechamento()
        );
    }
}
