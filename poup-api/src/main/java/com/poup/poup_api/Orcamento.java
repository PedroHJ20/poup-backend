package com.poup.poup_api;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Orcamento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double valorLimite; // Ex: 500.00 para gastar com Lazer
    private Integer mes;        // Ex: 11
    private Integer ano;        // Ex: 2025

    @ManyToOne
    @JoinColumn(name = "categoria_id") // O orçamento é de qual categoria?
    private Categoria categoria;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
}