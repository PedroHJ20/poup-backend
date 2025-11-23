package com.poup.poup_api;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    // Exemplo de método útil para login futuro:
    Usuario findByEmail(String email);
}