package com.poup.poup_api;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

import java.time.LocalDate;

@Data // O Lombok gera Getters, Setters, Equals e HashCode automaticamente
@Entity // Diz ao Spring: "Crie uma tabela no banco com os campos desta classe"
public class Lancamento {

    @Id // Diz que este campo é a Chave Primária (PK)
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Diz para o banco gerar o ID sozinho (1, 2, 3...)
    private Long id;

    private String descricao; // Ex: "Supermercado", "Salário"
    private Double valor;     // Ex: -150.00, 3000.00
    private String tipo;      // "DESPESA" ou "RECEITA"
    private LocalDate data;   // A data do movimento

    @ManyToOne // Muitos lançamentos para Uma categoria
    @JoinColumn(name = "categoria_id") // Cria uma coluna 'categoria_id' na tabela
    private Categoria categoria;
}