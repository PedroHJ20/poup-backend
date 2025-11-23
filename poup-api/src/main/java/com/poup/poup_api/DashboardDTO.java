package com.poup.poup_api;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardDTO {
    private String name;    // Nome do mês (ex: "Nov")
    private Double receita; // Valor da barra roxa
    private Double despesa; // Valor da barra azul
}