package br.com.vitrinelocal.util;

import java.text.Normalizer;
import java.util.Locale;

public final class SlugUtil {

    private SlugUtil() {
    }

    // Transforma "Casa & Design" em "casa-design".
    public static String gerar(String texto) {
        if (texto == null) {
            return "";
        }
        // 1) separa as letras dos acentos e 2) remove tudo que não é ASCII (os acentos).
        String semAcento = Normalizer.normalize(texto, Normalizer.Form.NFD)
                .replaceAll("[^\\p{ASCII}]", "");
        // 3) tudo minúsculo.
        String minusculo = semAcento.toLowerCase(Locale.ROOT);
        // 4) troca espaços e símbolos por hífen.
        String comHifens = minusculo.replaceAll("[^a-z0-9]+", "-");
        // 5) remove hífen sobrando no começo ou no fim.
        return comHifens.replaceAll("^-+", "").replaceAll("-+$", "");
    }
}
