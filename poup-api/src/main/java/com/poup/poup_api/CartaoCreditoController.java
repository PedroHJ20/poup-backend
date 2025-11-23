package com.poup.poup_api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/cartoes")
@CrossOrigin(origins = "*")
public class CartaoCreditoController {

    @Autowired
    private CartaoCreditoRepository repository;

    @GetMapping
    public List<CartaoCredito> listar() {
        return repository.findAll();
    }

    @PostMapping
    public CartaoCredito criar(@RequestBody CartaoCredito cartao) {
        return repository.save(cartao);
    }

    // --- NOVOS MÉTODOS ---

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        repository.deleteById(id);
    }

    @PutMapping("/{id}")
    public CartaoCredito atualizar(@PathVariable Long id, @RequestBody CartaoCredito dadosAtualizados) {
        return repository.findById(id).map(cartao -> {
            cartao.setNome(dadosAtualizados.getNome());
            cartao.setLimite(dadosAtualizados.getLimite());
            cartao.setDiaFechamento(dadosAtualizados.getDiaFechamento());
            cartao.setDiaVencimento(dadosAtualizados.getDiaVencimento());
            return repository.save(cartao);
        }).orElse(null);
    }
}