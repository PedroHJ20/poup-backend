package com.poup.poup_api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioRepository repository;

    @GetMapping
    public List<Usuario> listar() {
        return repository.findAll();
    }

    // NOVO: Buscar um usuário específico (para preencher a tela de config)
    @GetMapping("/{id}")
    public Usuario buscarPorId(@PathVariable Long id) {
        return repository.findById(id).orElse(null);
    }

    @PostMapping
    public Usuario criar(@RequestBody Usuario usuario) {
        return repository.save(usuario);
    }

    // NOVO: Atualizar dados do usuário
    @PutMapping("/{id}")
    public Usuario atualizar(@PathVariable Long id, @RequestBody Usuario novosDados) {
        return repository.findById(id).map(usuario -> {
            usuario.setNome(novosDados.getNome());
            usuario.setEmail(novosDados.getEmail());
            // Não vamos atualizar a senha por aqui por segurança simples
            return repository.save(usuario);
        }).orElse(null);
    }
}