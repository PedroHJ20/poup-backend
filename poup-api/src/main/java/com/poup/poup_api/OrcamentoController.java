package com.poup.poup_api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/orcamentos")
@CrossOrigin(origins = "*")
public class OrcamentoController {
    @Autowired private OrcamentoRepository repository;

    @GetMapping
    public List<Orcamento> listar() { return repository.findAll(); }

    @PostMapping
    public Orcamento criar(@RequestBody Orcamento orcamento) { return repository.save(orcamento); }
}