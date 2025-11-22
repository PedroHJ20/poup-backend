package com.poup.poup_api;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.util.Arrays;

@Component // Diz ao Spring: "Gerencie essa classe pra mim"
public class DataLoader implements CommandLineRunner {

    private final LancamentoRepository repository;

    // Injeção de dependência via construtor
    public DataLoader(LancamentoRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Criando uma Receita (Salário)
        Lancamento l1 = new Lancamento();
        l1.setDescricao("Salário Mensal");
        l1.setValor(5000.00);
        l1.setTipo("RECEITA");
        l1.setData(LocalDate.now());

        // Criando uma Despesa (Aluguel)
        Lancamento l2 = new Lancamento();
        l2.setDescricao("Aluguel");
        l2.setValor(-1200.00);
        l2.setTipo("DESPESA");
        l2.setData(LocalDate.now());
        
        // Criando uma Despesa (Supermercado)
        Lancamento l3 = new Lancamento();
        l3.setDescricao("Supermercado Semanal");
        l3.setValor(-450.50);
        l3.setTipo("DESPESA");
        l3.setData(LocalDate.now().minusDays(2)); // 2 dias atrás

        // Salvando tudo no banco
        repository.saveAll(Arrays.asList(l1, l2, l3));
        
        System.out.println("--- DADOS DE TESTE INSERIDOS NO BANCO ---");
    }
}