package com.poup.poup_api;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class CartaoCredito {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;          
    private Double limite;        
    private Integer diaFechamento;
    private Integer diaVencimento;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
}