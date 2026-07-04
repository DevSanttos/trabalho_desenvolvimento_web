package br.com.vitrinelocal.controller;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

// Recebe o upload de uma imagem, salva numa pasta FORA do projeto e devolve o caminho público.
// (Salvar fora do projeto evita que o Live Server recarregue a página ao subir uma foto.)
@RestController
@RequestMapping("/api/upload")
public class UploadController {

    // Pasta na "home" do usuário, ex: C:\Users\onata\vitrinelocal-uploads
    public static final Path PASTA = Paths.get(System.getProperty("user.home"), "vitrinelocal-uploads");

    @PostMapping
    public ResponseEntity<Map<String, String>> upload(@RequestParam("arquivo") MultipartFile arquivo) throws IOException {
        if (arquivo.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Nenhum arquivo enviado"));
        }

        // Cria a pasta se ela ainda não existir.
        Files.createDirectories(PASTA);

        // Monta um nome único mantendo a extensão do arquivo original (ex: .jpg).
        String nomeOriginal = arquivo.getOriginalFilename();
        String extensao = "";
        if (nomeOriginal != null && nomeOriginal.contains(".")) {
            extensao = nomeOriginal.substring(nomeOriginal.lastIndexOf("."));
        }
        String nomeArquivo = UUID.randomUUID() + extensao;

        // Salva o arquivo dentro da pasta.
        Path destino = PASTA.resolve(nomeArquivo);
        try (InputStream entrada = arquivo.getInputStream()) {
            Files.copy(entrada, destino, StandardCopyOption.REPLACE_EXISTING);
        }

        // Devolve o caminho público (o frontend monta a URL completa com esse caminho).
        return ResponseEntity.ok(Map.of("url", "/uploads/" + nomeArquivo));
    }
}
