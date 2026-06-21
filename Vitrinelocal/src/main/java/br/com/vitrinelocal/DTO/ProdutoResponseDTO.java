package br.com.vitrinelocal.DTO;

import java.math.BigDecimal;
import java.util.UUID;

import br.com.vitrinelocal.model.Produto;

public record ProdutoResponseDTO(
        UUID id,
        String nome,
        BigDecimal preco,
        String descricaoCurta,
        String descricaoCompleta,
        String marca,
        String categoria,
        String imagemUrl,
        boolean ativo,
        int visualizacoes
) {
    public static ProdutoResponseDTO fromEntity(Produto p) {
        return new ProdutoResponseDTO(
                p.getId(),
                p.getNome(),
                p.getPreco(),
                p.getDescricaoCurta(),
                p.getDescricaoCompleta(),
                p.getMarca(),
                p.getCategoria(),
                p.getImagemUrl(),
                p.isAtivo(),
                p.getVisualizacoes()
        );
    }
}
