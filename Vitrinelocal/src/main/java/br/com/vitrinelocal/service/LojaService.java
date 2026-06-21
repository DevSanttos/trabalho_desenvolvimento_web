package br.com.vitrinelocal.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.vitrinelocal.DTO.LojaResponseDTO;
import br.com.vitrinelocal.exception.RecursoNaoEncontradoException;
import br.com.vitrinelocal.repository.LojaRepository;

@Service
public class LojaService {

    private final LojaRepository lojaRepository;

    public LojaService(LojaRepository lojaRepository) {
        this.lojaRepository = lojaRepository;
    }

    @Transactional(readOnly = true)
    public LojaResponseDTO buscarPorSlug(String slug) {
        return lojaRepository.findBySlug(slug)
                .map(LojaResponseDTO::fromEntity)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Loja não encontrada"));
    }
}
