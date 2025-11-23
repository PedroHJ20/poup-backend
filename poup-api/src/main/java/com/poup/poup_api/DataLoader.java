package com.poup.poup_api;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.util.Arrays;

@Component
public class DataLoader implements CommandLineRunner {

    private final LancamentoRepository lancamentoRepository;
    private final CategoriaRepository categoriaRepository;
    private final UsuarioRepository usuarioRepository;
    private final ContaRepository contaRepository;
    private final MetaRepository metaRepository;
    private final OrcamentoRepository orcamentoRepository;
    private final CartaoCreditoRepository cartaoCreditoRepository; // NOVO REPOSITÓRIO

    // Injeção de dependência via construtor (todas as 7 entidades)
    public DataLoader(LancamentoRepository lancamentoRepository, 
                      CategoriaRepository categoriaRepository,
                      UsuarioRepository usuarioRepository,
                      ContaRepository contaRepository,
                      MetaRepository metaRepository,
                      OrcamentoRepository orcamentoRepository,
                      CartaoCreditoRepository cartaoCreditoRepository) {
        this.lancamentoRepository = lancamentoRepository;
        this.categoriaRepository = categoriaRepository;
        this.usuarioRepository = usuarioRepository;
        this.contaRepository = contaRepository;
        this.metaRepository = metaRepository;
        this.orcamentoRepository = orcamentoRepository;
        this.cartaoCreditoRepository = cartaoCreditoRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // 1. Criar um Usuário Padrão
        Usuario user = new Usuario();
        user.setNome("Pedro Henrique");
        user.setEmail("pedro@email.com");
        user.setSenha("123456");
        usuarioRepository.save(user);

        // 2. Criar uma Conta Bancária
        Conta contaNubank = new Conta();
        contaNubank.setNome("Nubank");
        contaNubank.setSaldo(3500.00);
        contaNubank.setUsuario(user);
        contaRepository.save(contaNubank);

        // 3. Pegar Categorias (já criadas pelo data.sql)
        // IDs baseados no script data.sql: 1=Alimentação, 2=Moradia, 3=Transporte, 4=Lazer, 6=Salário
        Categoria catAlimentacao = categoriaRepository.findById(1L).orElse(null);
        Categoria catMoradia = categoriaRepository.findById(2L).orElse(null);
        Categoria catSalario = categoriaRepository.findById(6L).orElse(null);
        Categoria catLazer = categoriaRepository.findById(4L).orElse(null);

        // 4. Criar Metas
        Meta metaViagem = new Meta();
        metaViagem.setTitulo("Viagem Europa");
        metaViagem.setValorAlvo(15000.00);
        metaViagem.setValorAtual(2500.00);
        metaViagem.setDataLimite(LocalDate.of(2026, 12, 31));
        metaViagem.setIcone("✈️");
        metaViagem.setUsuario(user);
        
        Meta metaCarro = new Meta();
        metaCarro.setTitulo("Carro Novo");
        metaCarro.setValorAlvo(40000.00);
        metaCarro.setValorAtual(5000.00);
        metaCarro.setDataLimite(LocalDate.of(2027, 1, 1));
        metaCarro.setIcone("🚗");
        metaCarro.setUsuario(user);

        metaRepository.saveAll(Arrays.asList(metaViagem, metaCarro));

        // 5. Criar Orçamentos (Limites)
        Orcamento orcamentoLazer = new Orcamento();
        orcamentoLazer.setCategoria(catLazer);
        orcamentoLazer.setValorLimite(300.00);
        orcamentoLazer.setMes(11);
        orcamentoLazer.setAno(2025);
        orcamentoLazer.setUsuario(user);
        orcamentoRepository.save(orcamentoLazer);

        // 6. Criar Cartão de Crédito (NOVO!)
        CartaoCredito card = new CartaoCredito();
        card.setNome("Nubank Ultravioleta");
        card.setLimite(15000.00);
        card.setDiaFechamento(7);
        card.setDiaVencimento(14);
        card.setUsuario(user);
        cartaoCreditoRepository.save(card);

        // 7. Criar Lançamentos Iniciais
        Lancamento l1 = new Lancamento();
        l1.setDescricao("Salário TechCorp");
        l1.setValor(5000.00);
        l1.setTipo("RECEITA");
        l1.setData(LocalDate.now());
        l1.setCategoria(catSalario);
        
        Lancamento l2 = new Lancamento();
        l2.setDescricao("Aluguel Apartamento");
        l2.setValor(-1200.00);
        l2.setTipo("DESPESA");
        l2.setData(LocalDate.now());
        l2.setCategoria(catMoradia);
        
        Lancamento l3 = new Lancamento();
        l3.setDescricao("Burguer King");
        l3.setValor(-45.90);
        l3.setTipo("DESPESA");
        l3.setData(LocalDate.now().minusDays(1));
        l3.setCategoria(catAlimentacao);

        lancamentoRepository.saveAll(Arrays.asList(l1, l2, l3));
        
        System.out.println("--- BANCO DE DADOS POVOADO COM SUCESSO (TODAS AS ENTIDADES) ---");
    }
}