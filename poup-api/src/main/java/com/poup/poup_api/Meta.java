package com.poup.poup_api;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
public class Meta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;      // Ex: "Viagem Disney"
    private Double valorAlvo;   // Ex: 10000.00
    private Double valorAtual;  // Ex: 2500.00
    private LocalDate dataLimite; // Quando quero realizar?
    private String icone;       // Ex: ✈️

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
}