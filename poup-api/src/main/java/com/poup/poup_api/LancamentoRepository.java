package com.poup.poup_api;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LancamentoRepository extends JpaRepository<Lancamento, Long> {
    // Só isso! O Spring Data cria todos os métodos de banco pra gente automaticamente.
}