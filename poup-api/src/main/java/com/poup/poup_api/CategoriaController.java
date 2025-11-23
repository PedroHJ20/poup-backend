package com.poup.poup_api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/categorias")
@CrossOrigin(origins = "*") // Permite que o Front-end acesse essa lista
public class CategoriaController {

    @Autowired
    private CategoriaRepository repository;

    // GET /categorias -> Retorna a lista de opções (Alimentação, Lazer, etc)
    @GetMapping
    public List<Categoria> listarTodas() {
        return repository.findAll();
    }
}