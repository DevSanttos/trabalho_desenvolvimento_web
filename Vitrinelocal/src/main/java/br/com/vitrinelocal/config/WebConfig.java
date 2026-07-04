package br.com.vitrinelocal.config;

import br.com.vitrinelocal.controller.UploadController;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// Faz o Spring servir os arquivos salvos na pasta de uploads (fora do projeto) pela URL /uploads/**.
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Usa a mesma pasta onde o UploadController salva os arquivos.
        String local = UploadController.PASTA.toUri().toString();
        if (!local.endsWith("/")) {
            local += "/";
        }
        registry.addResourceHandler("/uploads/**").addResourceLocations(local);
    }
}
