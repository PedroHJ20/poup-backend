package com.poup.poup_api;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class CartaoCredito {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;          // Ex: "Nubank Violeta"
    private Double limite;        // Ex: 10000.00
    private Integer diaFechamento;// Ex: 20 (O dia que a fatura fecha)
    private Integer diaVencimento;// Ex: 27 (O dia que precisa pagar)

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
}