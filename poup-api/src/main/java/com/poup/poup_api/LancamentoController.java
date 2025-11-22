package com.poup.poup_api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/lancamentos") // O endereço base será /lancamentos
@CrossOrigin(origins = "*") // LIBERA O ACESSO (Corrige o erro do Swagger e Front-end)
public class LancamentoController {

    @Autowired // Injeta o repositório aqui dentro automaticamente
    private LancamentoRepository repository;

    // GET /lancamentos -> Traz todos os lançamentos do banco
    @GetMapping
    public List<Lancamento> listarTodos() {
        return repository.findAll();
    }

    // POST /lancamentos -> Salva um novo lançamento que vier no corpo da requisição (JSON)
    @PostMapping
    public Lancamento criar(@RequestBody Lancamento lancamento) {
        return repository.save(lancamento);
    }

    // DELETE /lancamentos/{id} -> Apaga um lançamento pelo número do ID
    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        repository.deleteById(id);
    }
}