package com.poup.poup_api;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LancamentoRepository extends JpaRepository<Lancamento, Long> {
    // Busca quem tem esse texto na descrição (ignorando maiúsculas/minúsculas)
    List<Lancamento> findByDescricaoContainingIgnoreCase(String texto);
}