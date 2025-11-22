"use client";

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  TrendingDown, 
  TrendingUp, 
  Target, 
  Menu, 
  X, 
  Plus, 
  ChevronRight,
  Wallet,
  PieChart,
  Settings,
  LogOut,
  Bell,
  AlertTriangle,
  Search,
  HelpCircle,
  User,
  Accessibility,
  Eye,
  Volume2,
  Download,
  Pencil,
  Trash2
} from 'lucide-react';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- TIPO DE DADOS (Igual ao Java) ---
type Transaction = {
  id: number;
  descricao: string;
  valor: number;
  tipo: string;
  data: string;
};

type Goal = {
  id: number;
  title: string;
  target: number;
  current: number;
  deadline: string;
  icon: string;
};

// --- URL DO BACKEND ---
// Se não carregar, trocaremos localhost pelo endereço público do Codespaces
const API_URL = "http://localhost:8080/lancamentos";

const MOCK_GOALS: Goal[] = [
  { id: 1, title: 'Comprar Notebook', target: 3500, current: 1575, deadline: 'Dez/2025', icon: '💻' },
  { id: 2, title: 'Viagem Europa', target: 12000, current: 2400, deadline: 'Jun/2026', icon: '✈️' },
  { id: 3, title: 'Reserva Emergência', target: 18000, current: 10800, deadline: 'Dez/2025', icon: '🏠' },
];

const CHART_DATA = [
  { name: 'Jan', receita: 4000, despesa: 2400 },
  { name: 'Fev', receita: 3000, despesa: 1398 },
  { name: 'Mar', receita: 2000, despesa: 9800 },
];

// --- COMPONENTES UI ---

const SummaryCard = ({ title, value, subtitle, type = 'neutral' }: { title: string, value: string, subtitle: string, type?: 'neutral' | 'positive' | 'negative' }) => {
  const getTextColor = () => {
    if (type === 'positive') return 'text-green-600';
    if (type === 'negative') return 'text-red-600';
    return 'text-gray-800';
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{title}</h3>
      <p className={`text-2xl font-bold ${getTextColor()}`}>{value}</p>
      <p className="text-xs text-gray-400 mt-2">{subtitle}</p>
    </div>
  );
};

const TransactionItem = ({ transaction, onDelete }: { transaction: Transaction, onDelete: (id: number) => void }) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl hover:bg-white hover:border-indigo-100 transition-all group">
    <div className="flex items-center gap-4">
      <div className={`p-2 rounded-lg ${transaction.tipo === 'RECEITA' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
        {transaction.tipo === 'RECEITA' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
      </div>
      <div>
        <h4 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">{transaction.descricao}</h4>
        <p className="text-xs text-gray-500">
          {new Date(transaction.data).toLocaleDateString('pt-BR')}
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
        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        title="Excluir"
      >
        <Trash2 size={16} />
      </button>
    </div>
  </div>
);

// --- TELAS ---

const Dashboard = ({ transactions, onDelete }: { transactions: Transaction[], onDelete: (id: number) => void }) => {
  const income = transactions.filter(t => t.tipo === 'RECEITA').reduce((acc, cur) => acc + cur.valor, 0);
  const expense = transactions.filter(t => t.tipo === 'DESPESA').reduce((acc, cur) => acc + Math.abs(cur.valor), 0);
  const balance = income - expense;

  return (
    <div className="space-y-6 animate-fadeIn pb-20 md:pb-0">
      <header>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500">Visão geral das suas finanças</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard title="Saldo Atual" value={balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} subtitle="Receitas - Despesas" />
        <SummaryCard title="Receitas do Mês" value={`+ ${income.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`} type="positive" subtitle="Total de entradas" />
        <SummaryCard title="Despesas do Mês" value={`- ${expense.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`} type="negative" subtitle="Total de saídas" />
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-6">Últimas Transações</h2>
        <div className="space-y-3">
          {transactions.slice(0, 5).map(t => (
            <TransactionItem key={t.id} transaction={t} onDelete={onDelete} />
          ))}
          {transactions.length === 0 && <p className="text-gray-400">Nenhuma transação encontrada.</p>}
        </div>
      </div>
    </div>
  );
};

const TransactionPage = ({ title, type, transactions, onAdd, onDelete }: { title: string, type: 'RECEITA' | 'DESPESA', transactions: Transaction[], onAdd: () => void, onDelete: (id: number) => void }) => {
  const filtered = transactions.filter(t => t.tipo === type);
  const total = filtered.reduce((acc, cur) => acc + Math.abs(cur.valor), 0);

  return (
    <div className="space-y-6 animate-fadeIn pb-20 md:pb-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
          <p className="text-gray-500">Gerencie suas {title.toLowerCase()}</p>
        </div>
        <button onClick={onAdd} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
          <Plus size={18} /> Nova {type === 'RECEITA' ? 'Receita' : 'Despesa'}
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <div className="text-right w-full">
             <p className="text-xs text-gray-500 uppercase">Total {title}</p>
             <p className={`text-xl font-bold ${type === 'RECEITA' ? 'text-green-600' : 'text-red-600'}`}>
                {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
             </p>
          </div>
        </div>
        <div className="space-y-3">
          {filtered.map(t => (
            <TransactionItem key={t.id} transaction={t} onDelete={onDelete} />
          ))}
          {filtered.length === 0 && <p className="text-center text-gray-400 py-8">Nenhum registro encontrado.</p>}
        </div>
      </div>
    </div>
  );
};

// --- APP PRINCIPAL ---

export default function PoupApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Carregar dados ao iniciar
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
      alert("Erro ao salvar! Verifique se o Back-end está rodando.");
    }
  };

  const handleDeleteTransaction = async (id: number) => {
    if (confirm("Excluir este item?")) {
      try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchTransactions(); // Recarrega a lista
      } catch (error) {
        console.error("Erro ao deletar:", error);
      }
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard transactions={transactions} onDelete={handleDeleteTransaction} />;
      case 'receitas': return <TransactionPage title="Receitas" type="RECEITA" transactions={transactions} onAdd={() => handleAddTransaction('RECEITA')} onDelete={handleDeleteTransaction} />;
      case 'despesas': return <TransactionPage title="Despesas" type="DESPESA" transactions={transactions} onAdd={() => handleAddTransaction('DESPESA')} onDelete={handleDeleteTransaction} />;
      default: return <Dashboard transactions={transactions} onDelete={handleDeleteTransaction} />;
    }
  };

  const NavItem = ({ id, icon: Icon, label }: { id: string, icon: any, label: string }) => (
    <button 
      onClick={() => { setActiveTab(id); setIsMobileMenuOpen(false); }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
        activeTab === id 
          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200' 
          : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
      }`}
    >
      <Icon size={20} />
      {label}
      {activeTab === id && <ChevronRight size={16} className="ml-auto opacity-50" />}
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden text-gray-800">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 bg-white flex-col border-r border-gray-200 z-20">
        <div className="p-8 border-b border-gray-100 flex flex-col items-center text-center">
          <h1 className="text-3xl font-black bg-gradient-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent">POUP</h1>
          <p className="text-xs text-gray-400 mt-1">Finanças Simplificadas</p>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem id="receitas" icon={TrendingUp} label="Receitas" />
          <NavItem id="despesas" icon={TrendingDown} label="Despesas" />
          <NavItem id="configuracoes" icon={Settings} label="Configurações" />
        </nav>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-8 pt-10 scroll-smooth">
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}