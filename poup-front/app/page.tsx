"use client";

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  TrendingDown, 
  TrendingUp, 
  Target, 
  Wallet,
  PieChart,
  Settings,
  LogOut,
  Bell,
  Search,
  HelpCircle,
  Accessibility,
  Menu,
  X,
  ChevronRight,
  Plus,
  Trash2,
  User,
  AlertTriangle,
  Download
} from 'lucide-react';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- TIPO DE DADOS ---
type Transaction = {
  id: number;
  descricao: string;
  valor: number;
  tipo: string;
  data: string;
};

// --- URL DO BACKEND ---
// IMPORTANTE: Mantenha a URL que estava funcionando para você!
const API_URL = "https://upgraded-space-acorn-jj9q4jg556g9h56g6-8080.app.github.dev/lancamentos";

// Dados Falsos para o Gráfico (Enquanto não fazemos isso no Java)
const CHART_DATA = [
  { name: 'Jan', receita: 4000, despesa: 2400 },
  { name: 'Fev', receita: 3000, despesa: 1398 },
  { name: 'Mar', receita: 2000, despesa: 9800 },
  { name: 'Abr', receita: 2780, despesa: 3908 },
  { name: 'Mai', receita: 1890, despesa: 4800 },
  { name: 'Jun', receita: 2390, despesa: 3800 },
];

// --- COMPONENTES VISUAIS (CARDS E ITENS) ---

const SummaryCard = ({ title, value, subtitle, type = 'neutral' }: { title: string, value: string, subtitle: string, type?: 'neutral' | 'positive' | 'negative' }) => {
  const getTextColor = () => {
    if (type === 'positive') return 'text-green-600';
    if (type === 'negative') return 'text-red-600';
    return 'text-gray-800';
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{title}</h3>
      <p className={`text-2xl font-bold ${getTextColor()}`}>{value}</p>
      <p className="text-xs text-gray-400 mt-2">{subtitle}</p>
    </div>
  );
};

const TransactionItem = ({ transaction, onDelete }: { transaction: Transaction, onDelete: (id: number) => void }) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-white hover:border-indigo-100 transition-all group">
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-xl ${transaction.tipo === 'RECEITA' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
        {transaction.tipo === 'RECEITA' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
      </div>
      <div>
        <h4 className="font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">{transaction.descricao}</h4>
        <p className="text-xs text-gray-500 font-medium">
          {new Date(transaction.data).toLocaleDateString('pt-BR')} • {transaction.tipo === 'RECEITA' ? 'Entrada' : 'Saída'}
        </p>
      </div>
    </div>
    
    <div className="flex items-center gap-4">
      <span className={`font-bold text-lg ${transaction.tipo === 'RECEITA' ? 'text-green-600' : 'text-red-600'}`}>
        {transaction.tipo === 'DESPESA' ? '- ' : '+ '}
        {transaction.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
      </span>
      
      <button 
        onClick={() => onDelete(transaction.id)}
        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        title="Excluir"
      >
        <Trash2 size={18} />
      </button>
    </div>
  </div>
);

// --- COMPONENTES DAS TELAS INTERNAS ---

const BudgetPage = () => (
  <div className="space-y-6 animate-fadeIn pb-20 md:pb-0">
    <header>
      <h1 className="text-3xl font-bold text-gray-800">Orçamento</h1>
      <p className="text-gray-500">Controle de limites mensais</p>
    </header>

    <div className="bg-white p-8 rounded-3xl border border-gray-100 text-center space-y-6 relative overflow-hidden shadow-sm">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
      
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-xs text-gray-400 uppercase font-bold">Limite</p>
          <p className="text-xl font-bold text-gray-800">R$ 3.600,00</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase font-bold">Gasto</p>
          <p className="text-xl font-bold text-red-500">R$ 2.352,50</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase font-bold">Disponível</p>
          <p className="text-xl font-bold text-green-500">R$ 1.247,50</p>
        </div>
      </div>

      <div className="py-4">
        <div className="flex justify-between text-sm mb-2 font-medium">
          <span>Progresso do Mês</span>
          <span className="text-yellow-600">65%</span>
        </div>
        <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-yellow-400 w-[65%]"></div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 flex items-start gap-3 text-left">
        <AlertTriangle className="text-yellow-600 shrink-0" size={20} />
        <div>
          <h4 className="text-sm font-bold text-yellow-800">Atenção ao consumo</h4>
          <p className="text-xs text-yellow-700 mt-1">Você já consumiu 65% do orçamento. Tente reduzir gastos com Lazer.</p>
        </div>
      </div>
    </div>
  </div>
);

const SettingsPage = () => (
  <div className="space-y-6 animate-fadeIn pb-20 md:pb-0">
    <header>
      <h1 className="text-3xl font-bold text-gray-800">Configurações</h1>
      <p className="text-gray-500">Gerencie seu perfil e preferências</p>
    </header>

    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
      <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
        <User size={20} /> Dados do Perfil
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
          <input type="text" defaultValue="Usuário Demo" className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
          <input type="email" defaultValue="usuario@email.com" className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors font-bold">
          Salvar Alterações
        </button>
      </div>
    </div>

    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
      <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Bell size={20} /> Notificações
      </h3>
      <div className="space-y-3">
        {['Alertas de Orçamento', 'Vencimento de Contas', 'Dicas Semanais'].map((item) => (
          <label key={item} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg">
            <input type="checkbox" defaultChecked className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" />
            <span className="text-gray-700">{item}</span>
          </label>
        ))}
      </div>
    </div>
  </div>
);

const ReportsPage = () => (
  <div className="space-y-6 animate-fadeIn pb-20 md:pb-0">
    <header className="flex justify-between items-center">
      <div>
         <h1 className="text-3xl font-bold text-gray-800">Relatórios</h1>
         <p className="text-gray-500">Análise detalhada das suas finanças</p>
      </div>
      <button className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-colors text-sm font-bold">
        <Download size={18} /> Exportar PDF
      </button>
    </header>

    <div className="grid grid-cols-1 gap-6">
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Gastos por Categoria (Simulação)</h3>
        <div className="space-y-4">
          {[{cat: 'Moradia', val: 1200, pct: 60}, {cat: 'Alimentação', val: 450, pct: 25}, {cat: 'Lazer', val: 120, pct: 15}].map((item) => (
            <div key={item.cat}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">{item.cat}</span>
                <span className="text-gray-500">R$ {item.val} ({item.pct}%)</span>
              </div>
              <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500" style={{ width: `${item.pct}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const GoalsPage = () => (
  <div className="space-y-6 animate-fadeIn pb-20 md:pb-0">
    <header className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Metas</h1>
        <p className="text-gray-500">Seus objetivos financeiros</p>
      </div>
      <button className="bg-indigo-100 text-indigo-600 p-2 rounded-lg hover:bg-indigo-200 transition-colors">
        <Plus size={20} />
      </button>
    </header>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        { title: 'Notebook Novo', target: 3500, current: 1500, icon: '💻' },
        { title: 'Viagem', target: 5000, current: 1000, icon: '✈️' },
        { title: 'Carro', target: 25000, current: 5000, icon: '🚗' },
      ].map((goal, idx) => (
        <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="text-4xl mb-4">{goal.icon}</div>
          <h3 className="font-bold text-gray-800">{goal.title}</h3>
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1">
               <span className="font-bold text-indigo-600">R$ {goal.current}</span>
               <span className="text-gray-400">Meta: R$ {goal.target}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
               <div className="h-full bg-indigo-500" style={{width: `${(goal.current/goal.target)*100}%`}}></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// --- APP PRINCIPAL ---

export default function PoupApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  const handleAddTransaction = async (type: 'RECEITA' | 'DESPESA') => {
    const descricao = prompt(`Descrição da ${type === 'RECEITA' ? 'Receita' : 'Despesa'}:`);
    if (!descricao) return;
    let valorInput = parseFloat(prompt("Valor (ex: 100.50):") || "0");
    if (!valorInput || valorInput === 0) return;
    const valorFinal = type === 'DESPESA' ? -Math.abs(valorInput) : Math.abs(valorInput);

    const newTransaction = {
      descricao,
      valor: valorFinal,
      tipo: type,
      data: new Date().toISOString().split('T')[0]
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTransaction)
      });
      if (response.ok) fetchTransactions();
    } catch (error) {
      alert("Erro de conexão com o Java.");
    }
  };

  const handleDeleteTransaction = async (id: number) => {
    if (confirm("Excluir transação?")) {
      try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchTransactions();
      } catch (error) { console.error(error); }
    }
  };

  // Cálculos do Dashboard
  const income = transactions.filter(t => t.tipo === 'RECEITA').reduce((acc, cur) => acc + cur.valor, 0);
  const expense = transactions.filter(t => t.tipo === 'DESPESA').reduce((acc, cur) => acc + Math.abs(cur.valor), 0);
  const balance = income - expense;

  // --- RENDERIZAÇÃO DO CONTEÚDO ---
  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8 animate-fadeIn">
             <div>
              <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-gray-500 mt-1">Visão geral das suas finanças</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SummaryCard title="Saldo Atual" value={balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} subtitle="Receitas - Despesas" />
              <SummaryCard title="Receitas do Mês" value={`+ ${income.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`} type="positive" subtitle="Total de entradas" />
              <SummaryCard title="Despesas do Mês" value={`- ${expense.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`} type="negative" subtitle="Total de saídas" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                   <h2 className="text-lg font-bold text-gray-800">Balanço Semestral</h2>
                   <span className="text-xs font-medium text-gray-400 border px-3 py-1 rounded-full">Últimos 6 meses</span>
                </div>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={CHART_DATA} barSize={40}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                      <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} itemStyle={{ fontSize: '12px', fontWeight: 'bold' }} cursor={{fill: '#F8FAFC'}} />
                      <Bar dataKey="receita" fill="#818CF8" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="despesa" fill="#C084FC" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col h-full">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-gray-800">Últimas Transações</h2>
                  <div className="flex gap-2">
                     <button onClick={() => handleAddTransaction('RECEITA')} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"><Plus size={18}/></button>
                     <button onClick={() => handleAddTransaction('DESPESA')} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"><Plus size={18}/></button>
                  </div>
                </div>
                <div className="space-y-3 overflow-y-auto max-h-80 pr-2 custom-scrollbar">
                  {transactions.slice(0, 5).map(t => (
                    <TransactionItem key={t.id} transaction={t} onDelete={handleDeleteTransaction} />
                  ))}
                  {transactions.length === 0 && <p className="text-center text-gray-400 py-8 text-sm">Nenhum registro.</p>}
                </div>
                <button className="mt-auto w-full py-3 text-sm font-bold text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors">Ver todas</button>
              </div>
            </div>
          </div>
        );
      case 'orcamento': return <BudgetPage />;
      case 'configuracoes': return <SettingsPage />;
      case 'metas': return <GoalsPage />;
      case 'relatorios': return <ReportsPage />;
      
      // Receitas e Despesas usam a mesma lista por enquanto
      case 'receitas':
      case 'despesas':
        return (
          <div className="space-y-6 animate-fadeIn">
            <header className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{activeTab === 'receitas' ? 'Receitas' : 'Despesas'}</h1>
                <p className="text-gray-500">Gerencie seus lançamentos</p>
              </div>
              <button onClick={() => handleAddTransaction(activeTab === 'receitas' ? 'RECEITA' : 'DESPESA')} className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold shadow-lg">
                <Plus size={18} /> Novo
              </button>
            </header>
            <div className="bg-white p-6 rounded-3xl border border-gray-100">
               <div className="space-y-3">
                  {transactions.filter(t => t.tipo === (activeTab === 'receitas' ? 'RECEITA' : 'DESPESA')).map(t => (
                    <TransactionItem key={t.id} transaction={t} onDelete={handleDeleteTransaction} />
                  ))}
                  {transactions.filter(t => t.tipo === (activeTab === 'receitas' ? 'RECEITA' : 'DESPESA')).length === 0 && <p className="text-gray-400 text-center py-10">Nada aqui ainda.</p>}
               </div>
            </div>
          </div>
        );
      
      default: return null;
    }
  };

  const NavItem = ({ id, icon: Icon, label }: { id: string, icon: any, label: string }) => (
    <button 
      onClick={() => { setActiveTab(id); setIsMobileMenuOpen(false); }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
        activeTab === id 
          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200' 
          : 'text-gray-500 hover:bg-indigo-50 hover:text-indigo-600'
      }`}
    >
      <Icon size={20} />
      {label}
      {activeTab === id && <ChevronRight size={16} className="ml-auto opacity-50" />}
    </button>
  );

  return (
    <div className="flex h-screen bg-[#F3F4F6] font-sans overflow-hidden text-gray-800">
      <aside className={`fixed inset-y-0 left-0 z-30 w-72 bg-white flex flex-col border-r border-gray-100 transition-transform duration-300 md:translate-x-0 md:static ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 pb-8 border-b border-gray-50 flex flex-col items-center text-center">
          <div className="w-40 h-40 mb-4 bg-indigo-50 rounded-full flex items-center justify-center relative overflow-hidden">
             <img src="/poup.png" alt="Mascote POUP" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl font-black text-indigo-600 tracking-tight">POUP</h1>
          <p className="text-xs text-gray-400 font-medium mt-1">Finanças Simplificadas</p>
        </div>
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem id="receitas" icon={TrendingUp} label="Receitas" />
          <NavItem id="despesas" icon={TrendingDown} label="Despesas" />
          <NavItem id="orcamento" icon={Wallet} label="Orçamento" />
          <NavItem id="metas" icon={Target} label="Metas" />
          <NavItem id="relatorios" icon={PieChart} label="Relatórios" />
          <NavItem id="configuracoes" icon={Settings} label="Configurações" />
        </nav>
        <div className="p-6 border-t border-gray-50">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors">
            <LogOut size={20} /> Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 z-10">
          <button className="md:hidden text-gray-500" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>
          <div className="flex-1"></div>
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-gray-400 hover:text-indigo-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-700">Usuário Demo</p>
                <p className="text-xs text-indigo-500 font-medium">Premium</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-md shadow-indigo-200">
                UD
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth bg-[#FAFAFA]">
          <div className="max-w-7xl mx-auto space-y-8">
            {renderContent()}
          </div>
        </div>
      </main>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/20 z-20 md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}
    </div>
  );
}