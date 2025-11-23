package com.poup.poup_api;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Perfil {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome; // Ex: "ADMIN", "USUARIO"
}