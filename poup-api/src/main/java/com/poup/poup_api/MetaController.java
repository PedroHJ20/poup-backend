package com.poup.poup_api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/metas")
@CrossOrigin(origins = "*")
public class MetaController {
    @Autowired private MetaRepository repository;

    @GetMapping
    public List<Meta> listar() { return repository.findAll(); }

    @PostMapping
    public Meta criar(@RequestBody Meta meta) { return repository.save(meta); }
}