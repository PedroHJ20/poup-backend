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

    // ... métodos antigos ...

    @PutMapping("/{id}")
    public Orcamento atualizar(@PathVariable Long id, @RequestBody Orcamento orcamentoNovo) {
        return repository.findById(id).map(orcamento -> {
            orcamento.setValorLimite(orcamentoNovo.getValorLimite());
            orcamento.setMes(orcamentoNovo.getMes());
            orcamento.setAno(orcamentoNovo.getAno());
            // Se quiser permitir trocar a categoria do orçamento:
            orcamento.setCategoria(orcamentoNovo.getCategoria());
            return repository.save(orcamento);
        }).orElse(null);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        repository.deleteById(id);
    }
}