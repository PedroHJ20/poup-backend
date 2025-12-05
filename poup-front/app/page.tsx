

"use client";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE as string;

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, TrendingDown, TrendingUp, Target, Wallet, PieChart, Settings, LogOut, Bell, Menu, ChevronRight, Plus, Trash2, X, User, AlertTriangle, Download, Moon, Sun, Eye, Pencil, Search, CreditCard, Lock, ShieldAlert, Save
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPie, Pie, Cell } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// --- TIPOS ---
type Categoria = { id: number; nome: string; icone: string; };
type Transaction = { id: number; descricao: string; valor: number; tipo: string; data: string; categoria?: Categoria; };
type Meta = { id: number; titulo: string; valorAlvo: number; valorAtual: number; dataLimite: string; icone: string; };
type ChartData = { name: string; receita: number; despesa: number; };
type Orcamento = { id: number; valorLimite: number; categoria: Categoria; };
type CategoryData = { name: string; value: number; };
type Cartao = { id: number; nome: string; limite: number; diaFechamento: number; diaVencimento: number; };
type Usuario = { id: number; nome: string; email: string; };

// --- CONFIGURAÇÃO ---



const INITIAL_CHART_DATA = [{ name: 'Jan', receita: 0, despesa: 0 }];
const COLORS = ['#6366f1', '#ec4899', '#8b5cf6', '#10b981', '#f59e0b', '#3b82f6'];

// --- COMPONENTES VISUAIS ---

const SummaryCard = ({ title, value, subtitle, type = 'neutral' }: any) => {
  const getTextColor = () => {
    if (type === 'positive') return 'text-green-600 dark:text-green-400';
    if (type === 'negative') return 'text-red-600 dark:text-red-400';
    return 'text-gray-800 dark:text-white';
  };
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{title}</h3>
      <p className={`text-2xl font-bold ${getTextColor()}`}>{value}</p>
      <p className="text-xs text-gray-400 mt-2">{subtitle}</p>
    </div>
  );
};

const TransactionItem = ({ transaction, onEdit, onDelete }: { transaction: Transaction, onEdit: (t: Transaction) => void, onDelete: (id: number) => void }) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700 rounded-2xl hover:bg-white dark:hover:bg-gray-700 transition-all group">
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${transaction.tipo === 'RECEITA' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
        {transaction.categoria ? transaction.categoria.icone : (transaction.tipo === 'RECEITA' ? '💰' : '💸')}
      </div>
      <div>
        <h4 className="font-bold text-gray-800 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{transaction.descricao}</h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
          {new Date(transaction.data).toLocaleDateString('pt-BR')} • {transaction.categoria ? transaction.categoria.nome : 'Geral'}
        </p>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <span className={`font-bold text-lg ${transaction.tipo === 'RECEITA' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
        {transaction.tipo === 'DESPESA' ? '- ' : '+ '}
        {Math.abs(transaction.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
      </span>
      <div className="flex gap-1">
        <button onClick={() => onEdit(transaction)} className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-600 rounded-lg transition-colors"><Pencil size={18} /></button>
        <button onClick={() => onDelete(transaction.id)} className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-gray-600 rounded-lg transition-colors"><Trash2 size={18} /></button>
      </div>
    </div>
  </div>
);

// --- PÁGINAS INTERNAS ---

const BudgetPage = ({ budgets, transactions, onAdd }: { budgets: Orcamento[], transactions: Transaction[], onAdd: () => void }) => {
  const totalLimite = budgets.reduce((acc, b) => acc + b.valorLimite, 0);
  const totalGastoGeral = budgets.reduce((acc, b) => {
    const gastosCategoria = transactions.filter(t => t.tipo === 'DESPESA' && t.categoria?.id === b.categoria.id).reduce((sum, t) => sum + Math.abs(t.valor), 0);
    return acc + gastosCategoria;
  }, 0);
  const saldoDisponivel = totalLimite - totalGastoGeral;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center"><h1 className="text-3xl font-bold text-gray-800 dark:text-white">Orçamento</h1><button onClick={onAdd} className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700"><Plus size={20} /></button></div>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 text-center space-y-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div><p className="text-xs text-gray-400 uppercase font-bold">Limite Total</p><p className="text-xl font-bold text-gray-800 dark:text-white">R$ {totalLimite.toLocaleString()}</p></div>
          <div><p className="text-xs text-gray-400 uppercase font-bold">Gasto</p><p className="text-xl font-bold text-red-500 dark:text-red-400">R$ {totalGastoGeral.toLocaleString()}</p></div>
          <div><p className="text-xs text-gray-400 uppercase font-bold">Disponível</p><p className={`text-xl font-bold ${saldoDisponivel >= 0 ? 'text-green-500 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>R$ {saldoDisponivel.toLocaleString()}</p></div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {budgets.map(budget => {
          const gastoCategoria = transactions.filter(t => t.tipo === 'DESPESA' && t.categoria?.id === budget.categoria.id).reduce((sum, t) => sum + Math.abs(t.valor), 0);
          const percent = Math.min(100, Math.round((gastoCategoria / budget.valorLimite) * 100));
          const isAlert = percent > 80;
          return (
            <div key={budget.id} className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex justify-between items-center mb-4"><div className="flex items-center gap-3"><span className="text-2xl">{budget.categoria.icone}</span><h3 className="font-bold text-gray-800 dark:text-gray-100">{budget.categoria.nome}</h3></div><span className="text-xs font-bold bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg text-gray-500 dark:text-gray-300">Mensal</span></div>
              <div className="space-y-2"><div className="flex justify-between text-xs font-medium"><span className={isAlert ? "text-red-500" : "text-indigo-600 dark:text-indigo-400"}>Gasto: R$ {gastoCategoria}</span><span className="text-gray-400">Limite: R$ {budget.valorLimite}</span></div><div className="h-3 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden"><div className={`h-full transition-all duration-1000 ${isAlert ? 'bg-red-500' : 'bg-indigo-500'}`} style={{ width: `${percent}%` }}></div></div></div>
            </div>
          );
        })}
        {budgets.length === 0 && <p className="col-span-2 text-center text-gray-400 py-10">Nenhum orçamento cadastrado.</p>}
      </div>
    </div>
  );
};

const GoalsPage = ({ goals, onAdd }: { goals: Meta[], onAdd: () => void }) => (
  <div className="space-y-6 animate-fadeIn">
    <header className="flex justify-between items-center"><h1 className="text-3xl font-bold text-gray-800 dark:text-white">Metas</h1><button onClick={onAdd} className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700"><Plus size={20} /></button></header>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {goals.map((goal) => {
        const percent = Math.min(100, Math.round((goal.valorAtual / goal.valorAlvo) * 100));
        return (
          <div key={goal.id} className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="text-4xl mb-4">{goal.icone}</div><h3 className="font-bold text-gray-800 dark:text-white">{goal.titulo}</h3>
            <div className="mt-4"><div className="flex justify-between text-xs mb-1"><span className="font-bold text-indigo-600 dark:text-indigo-400">R$ {goal.valorAtual.toLocaleString()}</span><span className="text-gray-400">Meta: R$ {goal.valorAlvo.toLocaleString()}</span></div><div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 transition-all duration-1000" style={{width: `${percent}%`}}></div></div><p className="text-right text-xs text-indigo-400 mt-1 font-bold">{percent}%</p></div>
          </div>
        );
      })}
    </div>
  </div>
);

const CardsPage = ({ cards, onAdd, onEdit, onDelete }: { cards: Cartao[], onAdd: () => void, onEdit: (c: Cartao) => void, onDelete: (id: number) => void }) => (
  <div className="space-y-6 animate-fadeIn">
    <header className="flex justify-between items-center"><h1 className="text-3xl font-bold text-gray-800 dark:text-white">Cartões de Crédito</h1><button onClick={onAdd} className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700"><Plus size={20} /></button></header>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card) => (
        <div key={card.id} className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-3xl shadow-xl text-white h-48 flex flex-col justify-between overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
          <div className="flex justify-between items-start z-10"><div><h3 className="font-bold text-lg">{card.nome}</h3><p className="text-xs text-gray-400">Limite: R$ {card.limite.toLocaleString()}</p></div><div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => onEdit(card)} className="p-1.5 bg-white/10 rounded hover:bg-white/20"><Pencil size={14} /></button><button onClick={() => onDelete(card.id)} className="p-1.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500/40"><Trash2 size={14} /></button></div></div>
          <div className="z-10"><div className="flex justify-between text-xs text-gray-400 mb-1"><span>Fecha dia {card.diaFechamento}</span><span>Vence dia {card.diaVencimento}</span></div><p className="font-mono text-lg tracking-widest">•••• •••• •••• 1234</p></div>
        </div>
      ))}
      {cards.length === 0 && (<div className="col-span-full text-center py-10"><p className="text-gray-400">Nenhum cartão cadastrado.</p><button onClick={onAdd} className="text-indigo-600 font-bold mt-2 hover:underline">Cadastrar agora</button></div>)}
    </div>
  </div>
);

const ReportsPage = ({ categoryData, transactions }: { categoryData: CategoryData[], transactions: Transaction[] }) => {
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20); doc.setTextColor(79, 70, 229); doc.text("Relatório Financeiro - POUP", 14, 22);
    doc.setFontSize(10); doc.setTextColor(100); doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, 14, 30);
    const tableRows = transactions.map(t => [new Date(t.data).toLocaleDateString('pt-BR'), t.descricao, t.categoria ? t.categoria.nome : 'Geral', t.tipo, t.tipo === 'DESPESA' ? `- R$ ${Math.abs(t.valor)}` : `+ R$ ${t.valor}`]);
    autoTable(doc, { head: [['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor']], body: tableRows, startY: 40, styles: { fontSize: 8 }, headStyles: { fillColor: [79, 70, 229] } });
    doc.save("Relatorio_POUP.pdf");
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <header className="flex justify-between items-center"><h1 className="text-3xl font-bold text-gray-800 dark:text-white">Relatórios</h1><button onClick={generatePDF} className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-gray-800 px-4 py-2 rounded-xl font-bold text-sm hover:bg-indigo-100 transition-colors"><Download size={18} /> Baixar PDF</button></header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center"><h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 w-full">Distribuição</h3><div className="h-64 w-full"><ResponsiveContainer width="100%" height="100%"><RechartsPie><Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">{categoryData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}</Pie><Tooltip /></RechartsPie></ResponsiveContainer></div></div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm"><h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Detalhes</h3><div className="space-y-4">{categoryData.map((item, index) => { const total = categoryData.reduce((acc, curr) => acc + curr.value, 0); const percent = Math.round((item.value / total) * 100); return (<div key={index}><div className="flex justify-between text-sm mb-1"><span className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}}></div>{item.name}</span><span className="text-gray-500">R$ {item.value.toLocaleString()} ({percent}%)</span></div><div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden"><div className="h-full" style={{ width: `${percent}%`, backgroundColor: COLORS[index % COLORS.length] }}></div></div></div>); })}</div></div>
      </div>
    </div>
  );
};

// --- CONFIGURAÇÕES COMPLETA ---
const SettingsPage = ({ isDarkMode, toggleTheme, user, onUpdateUser }: any) => {
  const [name, setName] = useState(user?.nome || "");
  const [email, setEmail] = useState(user?.email || "");

  useEffect(() => { if(user) { setName(user.nome); setEmail(user.email); } }, [user]);

  const handleSave = () => { onUpdateUser(name, email); };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Configurações</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PERFIL REAL */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2"><User size={20}/> Perfil</h3>
          <div className="space-y-4">
            <div><label className="text-sm font-bold text-gray-600 dark:text-gray-400">Nome</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-xl mt-1 border-none" /></div>
            <div><label className="text-sm font-bold text-gray-600 dark:text-gray-400">Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-xl mt-1 border-none" /></div>
            <button onClick={handleSave} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 flex items-center gap-2"><Save size={18}/> Salvar Alterações</button>
          </div>
        </div>

        <div className="space-y-6">
          {/* TEMA */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2"><Eye size={20}/> Aparência</h3>
            <div className="flex gap-4">
              <button onClick={() => toggleTheme(false)} className={`flex-1 p-4 border-2 rounded-xl flex flex-col items-center gap-2 font-bold transition-all ${!isDarkMode ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}><Sun size={24}/> Claro</button>
              <button onClick={() => toggleTheme(true)} className={`flex-1 p-4 border-2 rounded-xl flex flex-col items-center gap-2 font-bold transition-all ${isDarkMode ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400' : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}><Moon size={24}/> Escuro</button>
            </div>
          </div>

          {/* SEGURANÇA */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2"><Lock size={20}/> Segurança</h3>
            <button className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-left">Alterar Senha</button>
          </div>

          {/* ZONA DE PERIGO */}
          <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-3xl border border-red-100 dark:border-red-800/50 shadow-sm">
            <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2"><ShieldAlert size={20}/> Zona de Perigo</h3>
            <p className="text-xs text-red-500 dark:text-red-300 mb-4">Ações irreversíveis que afetam sua conta.</p>
            <button onClick={() => alert("Função não disponível na versão demo.")} className="w-full p-3 bg-white dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl font-bold hover:bg-red-50 dark:hover:bg-red-900/50">Excluir Conta</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MODAIS (Transação e Orçamento - iguais) ---
const ModalTransaction = ({ onClose, onSave, type, categories, editingTransaction }: any) => {
  const [desc, setDesc] = useState(""); const [val, setVal] = useState(""); const [catId, setCatId] = useState("");
  useEffect(() => { if (editingTransaction) { setDesc(editingTransaction.descricao); setVal(Math.abs(editingTransaction.valor).toString()); setCatId(editingTransaction.categoria ? editingTransaction.categoria.id.toString() : ""); } else { setDesc(""); setVal(""); setCatId(""); } }, [editingTransaction]);
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(desc, parseFloat(val), catId, editingTransaction?.id); };
  return (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"><div className="bg-white dark:bg-gray-800 rounded-3xl p-6 w-full max-w-md shadow-2xl animate-fadeIn"><div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-gray-800 dark:text-white">{editingTransaction ? 'Editar' : 'Nova'} {type === 'RECEITA' ? 'Receita' : 'Despesa'}</h2><button onClick={onClose} className="p-2 bg-gray-50 dark:bg-gray-700 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"><X size={20} className="dark:text-white"/></button></div><form onSubmit={handleSubmit} className="space-y-4"><div><label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-1">Descrição</label><input required type="text" className="w-full p-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-xl border-none" value={desc} onChange={e => setDesc(e.target.value)} /></div><div><label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-1">Valor (R$)</label><input required type="number" step="0.01" className="w-full p-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-xl border-none" value={val} onChange={e => setVal(e.target.value)} /></div><div><label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-1">Categoria</label><select required className="w-full p-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-xl border-none" value={catId} onChange={e => setCatId(e.target.value)}><option value="">Selecione...</option>{categories.map((c: any) => <option key={c.id} value={c.id}>{c.icone} {c.nome}</option>)}</select></div><button type="submit" className={`w-full py-3 rounded-xl font-bold text-white mt-4 ${type === 'RECEITA' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-500 hover:bg-red-600'}`}> {editingTransaction ? 'Atualizar' : 'Salvar'} </button></form></div></div>);
};
const ModalBudget = ({ onClose, onSave, categories }: any) => {
  const [val, setVal] = useState(""); const [catId, setCatId] = useState(""); const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(parseFloat(val), catId); setVal(""); setCatId(""); };
  return (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"><div className="bg-white dark:bg-gray-800 rounded-3xl p-6 w-full max-w-md shadow-2xl animate-fadeIn"><div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-gray-800 dark:text-white">Novo Orçamento</h2><button onClick={onClose} className="p-2 bg-gray-50 dark:bg-gray-700 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"><X size={20} className="dark:text-white"/></button></div><form onSubmit={handleSubmit} className="space-y-4"><div><label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-1">Categoria</label><select required className="w-full p-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-xl border-none" value={catId} onChange={e => setCatId(e.target.value)}><option value="">Selecione...</option>{categories.map((c: any) => <option key={c.id} value={c.id}>{c.icone} {c.nome}</option>)}</select></div><div><label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-1">Limite Mensal (R$)</label><input required type="number" step="0.01" className="w-full p-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-xl border-none" value={val} onChange={e => setVal(e.target.value)} /></div><button type="submit" className="w-full py-3 rounded-xl font-bold text-white mt-4 bg-indigo-600 hover:bg-indigo-700">Criar Orçamento</button></form></div></div>);
};
const ModalCard = ({ onClose, onSave, editingCard }: any) => {
  const [nome, setNome] = useState(""); const [limite, setLimite] = useState(""); const [fechamento, setFechamento] = useState(""); const [vencimento, setVencimento] = useState("");
  useEffect(() => { if (editingCard) { setNome(editingCard.nome); setLimite(editingCard.limite.toString()); setFechamento(editingCard.diaFechamento.toString()); setVencimento(editingCard.diaVencimento.toString()); } else { setNome(""); setLimite(""); setFechamento(""); setVencimento(""); } }, [editingCard]);
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(nome, parseFloat(limite), parseInt(fechamento), parseInt(vencimento), editingCard?.id); };
  return (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"><div className="bg-white dark:bg-gray-800 rounded-3xl p-6 w-full max-w-md shadow-2xl animate-fadeIn"><div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-gray-800 dark:text-white">{editingCard ? 'Editar Cartão' : 'Novo Cartão'}</h2><button onClick={onClose} className="p-2 bg-gray-50 dark:bg-gray-700 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"><X size={20} className="dark:text-white"/></button></div><form onSubmit={handleSubmit} className="space-y-3"><div><label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-1">Nome do Cartão</label><input required type="text" placeholder="Ex: Nubank" className="w-full p-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-xl border-none" value={nome} onChange={e => setNome(e.target.value)} /></div><div><label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-1">Limite (R$)</label><input required type="number" step="0.01" className="w-full p-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-xl border-none" value={limite} onChange={e => setLimite(e.target.value)} /></div><div className="flex gap-4"><div className="flex-1"><label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-1">Dia Fechamento</label><input required type="number" min="1" max="31" className="w-full p-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-xl border-none" value={fechamento} onChange={e => setFechamento(e.target.value)} /></div><div className="flex-1"><label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-1">Dia Vencimento</label><input required type="number" min="1" max="31" className="w-full p-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-xl border-none" value={vencimento} onChange={e => setVencimento(e.target.value)} /></div></div><button type="submit" className="w-full py-3 rounded-xl font-bold text-white mt-4 bg-indigo-600 hover:bg-indigo-700">{editingCard ? 'Atualizar' : 'Criar Cartão'}</button></form></div></div>);
};

// --- APP PRINCIPAL ---

export default function PoupApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [goals, setGoals] = useState<Meta[]>([]);
  const [budgets, setBudgets] = useState<Orcamento[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>(INITIAL_CHART_DATA);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [cards, setCards] = useState<Cartao[]>([]);
  const [user, setUser] = useState<Usuario | null>(null); // ESTADO DO USUÁRIO
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'RECEITA' | 'DESPESA'>('DESPESA');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editingCard, setEditingCard] = useState<Cartao | null>(null);

  useEffect(() => { fetchData(); if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) { setIsDarkMode(true); } }, []);
  useEffect(() => { if (isDarkMode) { document.documentElement.classList.add('dark'); } else { document.documentElement.classList.remove('dark'); } }, [isDarkMode]);

  const fetchData = async () => {
    try {
      const [resTrans, resCat, resGoals, resChart, resBudgets, resCatData, resCards, resUser] = await Promise.all([
        fetch(`${API_BASE}/lancamentos`), fetch(`${API_BASE}/categorias`), fetch(`${API_BASE}/metas`), fetch(`${API_BASE}/dashboard/grafico`), fetch(`${API_BASE}/orcamentos`), fetch(`${API_BASE}/dashboard/gastos-por-categoria`), fetch(`${API_BASE}/cartoes`),
        fetch(`${API_BASE}/usuarios/1`) // <--- BUSCA O USUÁRIO ID 1
      ]);
      setTransactions(await resTrans.json()); setCategories(await resCat.json()); setGoals(await resGoals.json()); setChartData(await resChart.json()); setBudgets(await resBudgets.json()); setCategoryData(await resCatData.json()); setCards(await resCards.json());
      setUser(await resUser.json()); // <--- SALVA O USUÁRIO
    } catch (error) { console.error("Erro:", error); }
  };

  // ... (Funções de busca, modais, delete iguais) ...
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => { const term = e.target.value; setSearchTerm(term); if (term.length > 0) { const res = await fetch(`${API_BASE}/lancamentos/busca?termo=${term}`); setTransactions(await res.json()); } else { const res = await fetch(`${API_BASE}/lancamentos`); setTransactions(await res.json()); } };
  const openCreateModal = (type: 'RECEITA' | 'DESPESA') => { setModalType(type); setEditingTransaction(null); setIsModalOpen(true); };
  const openEditModal = (transaction: Transaction) => { setModalType(transaction.tipo as 'RECEITA' | 'DESPESA'); setEditingTransaction(transaction); setIsModalOpen(true); };
  const openCreateCardModal = () => { setEditingCard(null); setIsCardModalOpen(true); };
  const openEditCardModal = (card: Cartao) => { setEditingCard(card); setIsCardModalOpen(true); };
  const handleSaveTransaction = async (descricao: string, valor: number, categoriaId: string, id?: number) => { const valorFinal = modalType === 'DESPESA' ? -Math.abs(valor) : Math.abs(valor); const payload = { descricao, valor: valorFinal, tipo: modalType, data: new Date().toISOString().split('T')[0], categoria: { id: parseInt(categoriaId) } }; try { let url = `${API_BASE}/lancamentos`; let method = 'POST'; if (id) { url = `${API_BASE}/lancamentos/${id}`; method = 'PUT'; } const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); if (res.ok) { fetchData(); setIsModalOpen(false); } } catch (error) { alert("Erro ao salvar."); } };
  const handleSaveBudget = async (valorLimite: number, categoriaId: string) => { const payload = { valorLimite, mes: 11, ano: 2025, categoria: { id: parseInt(categoriaId) }, usuario: { id: 1 } }; try { const res = await fetch(`${API_BASE}/orcamentos`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); if (res.ok) { fetchData(); setIsBudgetModalOpen(false); } } catch (error) { alert("Erro ao salvar orçamento."); } };
  const handleSaveCard = async (nome: string, limite: number, diaFechamento: number, diaVencimento: number, id?: number) => { const payload = { nome, limite, diaFechamento, diaVencimento, usuario: { id: 1 } }; try { let url = `${API_BASE}/cartoes`; let method = 'POST'; if (id) { url = `${API_BASE}/cartoes/${id}`; method = 'PUT'; } const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); if(res.ok) { fetchData(); setIsCardModalOpen(false); } } catch(e) { alert("Erro ao salvar cartão"); } }
  const handleAddGoal = async () => { const titulo = prompt("Nome da Meta:"); if(!titulo) return; const valorAlvo = parseFloat(prompt("Valor Alvo:") || "0"); const valorAtual = parseFloat(prompt("Valor Atual:") || "0"); const icone = prompt("Emoji:") || "🎯"; const newGoal = { titulo, valorAlvo, valorAtual, icone, dataLimite: "2025-12-31", usuario: { id: 1 } }; try { const res = await fetch(`${API_BASE}/metas`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newGoal) }); if(res.ok) fetchData(); } catch(e) { alert("Erro"); } }
  const handleDelete = async (id: number) => { if (confirm("Tem certeza?")) { await fetch(`${API_BASE}/lancamentos/${id}`, { method: 'DELETE' }); fetchData(); } };
  const handleDeleteCard = async (id: number) => { if (confirm("Tem certeza que deseja excluir este cartão?")) { await fetch(`${API_BASE}/cartoes/${id}`, { method: 'DELETE' }); fetchData(); } };

  // NOVO: FUNÇÃO PARA ATUALIZAR USUÁRIO
  const handleUpdateUser = async (nome: string, email: string) => {
    try {
      const res = await fetch(`${API_BASE}/usuarios/1`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email })
      });
      if (res.ok) {
        alert("Perfil atualizado com sucesso!");
        fetchData(); // Recarrega para atualizar o nome no cabeçalho
      }
    } catch(e) { alert("Erro ao atualizar perfil"); }
  };

  const income = transactions.filter(t => t.tipo === 'RECEITA').reduce((acc, cur) => acc + cur.valor, 0);
  const expense = transactions.filter(t => t.tipo === 'DESPESA').reduce((acc, cur) => acc + Math.abs(cur.valor), 0);
  const balance = income - expense;

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard': return (
        <div className="space-y-8 animate-fadeIn">
           <div><h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1></div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6"><SummaryCard title="Saldo Atual" value={balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} subtitle="Receitas - Despesas" /><SummaryCard title="Receitas do Mês" value={`+ ${income.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`} type="positive" subtitle="Entradas" /><SummaryCard title="Despesas do Mês" value={`- ${expense.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`} type="negative" subtitle="Saídas" /></div>
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm"><h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Balanço</h2><div className="h-72 w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" /><XAxis dataKey="name" axisLine={false} tickLine={false} /><YAxis axisLine={false} tickLine={false} /><Tooltip /><Bar dataKey="receita" fill="#818CF8" radius={[4, 4, 0, 0]} /><Bar dataKey="despesa" fill="#C084FC" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div></div>
             <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col h-full"><div className="flex justify-between items-center mb-6"><h2 className="text-lg font-bold text-gray-800 dark:text-white">Últimas</h2><div className="flex gap-2"><button onClick={() => openCreateModal('RECEITA')} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"><Plus size={18}/></button><button onClick={() => openCreateModal('DESPESA')} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><Plus size={18}/></button></div></div><div className="space-y-3 overflow-y-auto max-h-80 pr-2 custom-scrollbar">{transactions.slice(0, 5).map(t => <TransactionItem key={t.id} transaction={t} onEdit={openEditModal} onDelete={handleDelete} />)}</div></div>
           </div>
        </div>
      );
      case 'orcamento': return <BudgetPage budgets={budgets} transactions={transactions} onAdd={() => setIsBudgetModalOpen(true)} />;
      case 'metas': return <GoalsPage goals={goals} onAdd={handleAddGoal} />;
      case 'cartoes': return <CardsPage cards={cards} onAdd={openCreateCardModal} onEdit={openEditCardModal} onDelete={handleDeleteCard} />;
      case 'relatorios': return <ReportsPage categoryData={categoryData} transactions={transactions} />;
      case 'configuracoes': return <SettingsPage isDarkMode={isDarkMode} toggleTheme={setIsDarkMode} user={user} onUpdateUser={handleUpdateUser} />; // PASSANDO USER
      case 'receitas': case 'despesas': return (<div className="space-y-6 animate-fadeIn"><header className="flex flex-col md:flex-row md:items-center justify-between gap-4"><div><h1 className="text-3xl font-bold text-gray-800 dark:text-white capitalize">{activeTab}</h1></div><div className="flex gap-3"><div className="relative"><Search className="absolute left-3 top-3 text-gray-400" size={20} /><input type="text" placeholder="Buscar..." className="pl-10 p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" value={searchTerm} onChange={handleSearch} /></div><button onClick={() => openCreateModal(activeTab === 'receitas' ? 'RECEITA' : 'DESPESA')} className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold shadow-lg"><Plus size={18} /> Novo</button></div></header><div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm"><div className="space-y-3">{transactions.filter(t => t.tipo === (activeTab === 'receitas' ? 'RECEITA' : 'DESPESA')).map(t => <TransactionItem key={t.id} transaction={t} onEdit={openEditModal} onDelete={handleDelete} />)}</div></div></div>);
      default: return null;
    }
  };

  const NavItem = ({ id, icon: Icon, label }: any) => (<button onClick={() => setActiveTab(id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === id ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' : 'text-gray-500 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-gray-700'}`}><Icon size={20} /> {label} {activeTab === id && <ChevronRight size={16} className="ml-auto opacity-50" />}</button>);

  return (
    <div className={`flex h-screen bg-[#F3F4F6] dark:bg-gray-900 font-sans overflow-hidden text-gray-800 ${isDarkMode ? 'dark' : ''}`}>
      <aside className={`fixed inset-y-0 left-0 z-30 w-72 bg-white dark:bg-gray-800 flex flex-col border-r border-gray-100 dark:border-gray-700 md:static ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} transition-transform`}>
        <div className="p-6 flex flex-col items-center text-center border-b border-gray-50 dark:border-gray-700"><div className="w-32 h-32 mb-4 bg-indigo-50 dark:bg-gray-700 rounded-full flex items-center justify-center overflow-hidden"><img src="/poup.png" alt="POUP" className="w-full h-full object-cover" /></div><h1 className="text-3xl font-black text-indigo-600 dark:text-indigo-400">POUP</h1></div>
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto"><NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" /><NavItem id="receitas" icon={TrendingUp} label="Receitas" /><NavItem id="despesas" icon={TrendingDown} label="Despesas" /><NavItem id="cartoes" icon={CreditCard} label="Cartões" /><NavItem id="orcamento" icon={Wallet} label="Orçamento" /><NavItem id="metas" icon={Target} label="Metas" /><NavItem id="relatorios" icon={PieChart} label="Relatórios" /><NavItem id="configuracoes" icon={Settings} label="Configurações" /></nav>
      </aside>
      <main className="flex-1 flex flex-col h-full relative"><header className="h-20 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between px-8"><button className="md:hidden text-gray-500 dark:text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}><Menu /></button><div className="ml-auto flex items-center gap-4"><Bell className="text-gray-400" /><div className="w-10 h-10 bg-indigo-600 rounded-full text-white flex items-center justify-center font-bold shadow-md">{user ? user.nome.substring(0,2).toUpperCase() : 'UD'}</div></div></header><div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#FAFAFA] dark:bg-gray-900"><div className="max-w-7xl mx-auto">{renderContent()}</div></div></main>
      
      {isModalOpen && (<ModalTransaction onClose={() => setIsModalOpen(false)} onSave={handleSaveTransaction} type={modalType} categories={categories} editingTransaction={editingTransaction} />)}
      {isBudgetModalOpen && (<ModalBudget onClose={() => setIsBudgetModalOpen(false)} onSave={handleSaveBudget} categories={categories} />)}
      {isCardModalOpen && (<ModalCard onClose={() => setIsCardModalOpen(false)} onSave={handleSaveCard} editingCard={editingCard} />)}
    </div>
  );
}