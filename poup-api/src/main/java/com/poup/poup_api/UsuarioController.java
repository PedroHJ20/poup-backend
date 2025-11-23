package com.poup.poup_api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {
    @Autowired private UsuarioRepository repository;

    @GetMapping
    public List<Usuario> listar() { return repository.findAll(); }

    @PostMapping
    public Usuario criar(@RequestBody Usuario usuario) { return repository.save(usuario); }
}