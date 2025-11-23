package com.poup.poup_api;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Conta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;  // Ex: "Nubank", "Carteira"
    private Double saldo; // Ex: 1500.00

    @ManyToOne // Um usuário pode ter várias contas
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
}