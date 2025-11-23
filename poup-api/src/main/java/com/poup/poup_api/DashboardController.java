package com.poup.poup_api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private LancamentoRepository repository;

    @GetMapping("/grafico")
    public List<DashboardDTO> getDadosGrafico() {
        // ... (Lógica antiga do gráfico de barras) ...
        List<DashboardDTO> dados = new ArrayList<>();
        dados.add(new DashboardDTO("Out", 3200.0, 2100.0)); // Falso (passado)

        Double totalReceita = repository.findAll().stream()
                .filter(l -> "RECEITA".equals(l.getTipo()))
                .mapToDouble(Lancamento::getValor).sum();

        Double totalDespesa = repository.findAll().stream()
                .filter(l -> "DESPESA".equals(l.getTipo()))
                .mapToDouble(l -> Math.abs(l.getValor())).sum();

        dados.add(new DashboardDTO("Nov", totalReceita, totalDespesa)); // Real
        return dados;
    }

    // --- NOVO ENDPOINT: GASTOS POR CATEGORIA (PIZZA) ---
    @GetMapping("/gastos-por-categoria")
    public List<CategoriaSomaDTO> getGastosPorCategoria() {
        // 1. Busca todas as DESPESAS
        List<Lancamento> despesas = repository.findAll().stream()
                .filter(l -> "DESPESA".equals(l.getTipo()))
                .toList();

        // 2. Agrupa por Nome da Categoria e Soma os Valores
        Map<String, Double> somaPorCategoria = despesas.stream()
                .collect(Collectors.groupingBy(
                        l -> l.getCategoria().getNome(), // Agrupar por nome
                        Collectors.summingDouble(l -> Math.abs(l.getValor())) // Somar valor positivo
                ));

        // 3. Converte para a lista de DTOs que o gráfico precisa
        List<CategoriaSomaDTO> resultado = new ArrayList<>();
        somaPorCategoria.forEach((nome, valor) -> {
            if (valor > 0) { // Só mostra se tiver gasto
                resultado.add(new CategoriaSomaDTO(nome, valor));
            }
        });

        return resultado;
    }
}