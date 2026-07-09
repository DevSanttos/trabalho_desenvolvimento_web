package br.com.vitrinelocal.DTO;

// Resumo de uma cidade na home: nome, slug e quantas lojas tem.
public record CidadeResumoDTO(
        String nome,
        String slug,
        long totalLojas
) {
}
