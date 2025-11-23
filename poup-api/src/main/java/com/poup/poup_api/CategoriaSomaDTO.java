package com.poup.poup_api;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CategoriaSomaDTO {
    private String name;  // Ex: "Alimentação"
    private Double value; // Ex: 450.50
}