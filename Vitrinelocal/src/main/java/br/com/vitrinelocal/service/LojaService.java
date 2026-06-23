package br.com.vitrinelocal.service;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.vitrinelocal.DTO.AtualizarLojaDTO;
import br.com.vitrinelocal.DTO.LojaDetalheDTO;
import br.com.vitrinelocal.exception.RecursoNaoEncontradoException;
import br.com.vitrinelocal.model.Loja;
import br.com.vitrinelocal.repository.LojaRepository;

@Service
public class LojaService {

    private final LojaRepository lojaRepository;

    public LojaService(LojaRepository lojaRepository) {
        this.lojaRepository = lojaRepository;
    }

    @Transactional(readOnly = true)
    public LojaDetalheDTO buscarPorSlug(String slug) {
        return lojaRepository.findBySlug(slug)
                .map(LojaDetalheDTO::fromEntity)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Loja não encontrada"));
    }

    @Transactional
    public LojaDetalheDTO atualizar(UUID id, AtualizarLojaDTO dto) {
        Loja loja = lojaRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Loja não encontrada"));

        // O slug permanece o mesmo, mesmo que o nome mude (não quebra links públicos).
        loja.setNome(dto.nome());
        loja.setCategoria(dto.categoria());
        loja.setCidade(dto.cidade());
        loja.setEndereco(dto.endereco());
        loja.setWhatsapp(dto.whatsapp());
        loja.setLogoUrl(dto.logoUrl());
        loja.setHoraSemanaAbertura(dto.horaSemanaAbertura());
        loja.setHoraSemanaFechamento(dto.horaSemanaFechamento());
        loja.setHoraSabadoAbertura(dto.horaSabadoAbertura());
        loja.setHoraSabadoFechamento(dto.horaSabadoFechamento());

        return LojaDetalheDTO.fromEntity(lojaRepository.save(loja));
    }
}
