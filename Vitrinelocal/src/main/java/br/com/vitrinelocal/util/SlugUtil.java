package br.com.vitrinelocal.util;

import java.text.Normalizer;
import java.util.Locale;

public final class SlugUtil {

    private SlugUtil() {
    }


    public static String gerar(String texto) {
        if (texto == null) {
            return "";
        }

        String semAcento = Normalizer.normalize(texto, Normalizer.Form.NFD).replaceAll("[^\\p{ASCII}]", "");
        String minusculo = semAcento.toLowerCase(Locale.ROOT);
        String comHifens = minusculo.replaceAll("[^a-z0-9]+", "-");
        return comHifens.replaceAll("^-+", "").replaceAll("-+$", "");
    }
}
