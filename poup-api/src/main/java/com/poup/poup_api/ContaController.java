package com.poup.poup_api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/contas")
@CrossOrigin(origins = "*")
public class ContaController {
    @Autowired private ContaRepository repository;

    @GetMapping
    public List<Conta> listar() { return repository.findAll(); }

    @PostMapping
    public Conta criar(@RequestBody Conta conta) { return repository.save(conta); }
}