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


    // ... métodos antigos ...

    @PutMapping("/{id}")
    public Meta atualizar(@PathVariable Long id, @RequestBody Meta metaAtualizada) {
        return repository.findById(id).map(meta -> {
            meta.setTitulo(metaAtualizada.getTitulo());
            meta.setValorAlvo(metaAtualizada.getValorAlvo());
            meta.setValorAtual(metaAtualizada.getValorAtual());
            meta.setDataLimite(metaAtualizada.getDataLimite());
            meta.setIcone(metaAtualizada.getIcone());
            return repository.save(meta);
        }).orElse(null);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
