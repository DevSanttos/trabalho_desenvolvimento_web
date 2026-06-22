package br.com.vitrinelocal.DTO;

// Card de loja na página da cidade.
public record LojaResumoDTO(
        String nome,
        String slug,
        String categoria,
        String endereco,
        String cidade,
        String logoUrl,
        long totalProdutos
) {
}
