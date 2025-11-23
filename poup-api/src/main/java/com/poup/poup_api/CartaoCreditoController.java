package com.poup.poup_api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/cartoes")
@CrossOrigin(origins = "*")
public class CartaoCreditoController {
    @Autowired private CartaoCreditoRepository repository;

    @GetMapping
    public List<CartaoCredito> listar() { return repository.findAll(); }

    @PostMapping
    public CartaoCredito criar(@RequestBody CartaoCredito cartao) { return repository.save(cartao); }
}