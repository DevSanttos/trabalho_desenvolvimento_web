package br.com.vitrinelocal.DTO;

import java.math.BigDecimal;
import java.util.List;
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
        List<String> imagens,
        String imagemUrl,   // a primeira imagem (usada nos cards e listas)
        boolean ativo,
        int visualizacoes,
        String lojaSlug,
        String lojaNome
) {
    public static ProdutoResponseDTO fromEntity(Produto p) {
        List<String> imagens = p.getImagens();
        // A "imagem principal" é a primeira da lista (ou nada, se não houver fotos).
        String principal = (imagens == null || imagens.isEmpty()) ? null : imagens.get(0);
        return new ProdutoResponseDTO(
                p.getId(),
                p.getNome(),
                p.getPreco(),
                p.getDescricaoCurta(),
                p.getDescricaoCompleta(),
                p.getMarca(),
                p.getCategoria(),
                imagens,
                principal,
                p.isAtivo(),
                p.getVisualizacoes(),
                p.getLoja().getSlug(),
                p.getLoja().getNome()
        );
    }
}
