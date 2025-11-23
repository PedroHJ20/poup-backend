package com.poup.poup_api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private LancamentoRepository repository;

    @GetMapping("/grafico")
    public List<DashboardDTO> getDadosGrafico() {
        List<DashboardDTO> dados = new ArrayList<>();

        // 1. Dados fictícios de meses passados (só para o gráfico não ficar vazio)
        dados.add(new DashboardDTO("Set", 2500.0, 1800.0));
        dados.add(new DashboardDTO("Out", 3200.0, 2100.0));

        // 2. DADOS REAIS DO SEU BANCO (Agrupados como "Nov")
        // Somando todas as RECEITAS
        Double totalReceita = repository.findAll().stream()
                .filter(l -> "RECEITA".equals(l.getTipo()))
                .mapToDouble(Lancamento::getValor)
                .sum();

        // Somando todas as DESPESAS (convertendo para positivo com Math.abs)
        Double totalDespesa = repository.findAll().stream()
                .filter(l -> "DESPESA".equals(l.getTipo()))
                .mapToDouble(l -> Math.abs(l.getValor()))
                .sum();

        // Adiciona o mês atual com os dados reais
        dados.add(new DashboardDTO("Nov", totalReceita, totalDespesa));
        
        return dados;
    }
}