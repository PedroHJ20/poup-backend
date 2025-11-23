"use client";

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, TrendingDown, TrendingUp, Target, Wallet, PieChart, Settings, LogOut, Bell, Menu, ChevronRight, Plus, Trash2, X, User, AlertTriangle, Download, Moon, Sun, Eye
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- TIPOS ---
type Categoria = { id: number; nome: string; icone: string; };
type Transaction = { id: number; descricao: string; valor: number; tipo: string; data: string; categoria?: Categoria; };
type Meta = { id: number; titulo: string; valorAlvo: number; valorAtual: number; dataLimite: string; icone: string; };
type ChartData = { name: string; receita: number; despesa: number; };
type Orcamento = { id: number; valorLimite: number; categoria: Categoria; }; // NOVO TIPO

// --- CONFIGURAÇÃO ---
// ATENÇÃO: Mantenha o link que estava funcionando para você!
const API_BASE = "https://upgraded-space-acorn-jj9q4jg556g9h56g6-8080.app.github.dev"; 

const INITIAL_CHART_DATA = [
  { name: 'Jan', receita: 0, despesa: 0 },
];

// --- COMPONENTES VISUAIS ---

const SummaryCard = ({ title, value, subtitle, type = 'neutral' }: any) => {
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
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${transaction.tipo === 'RECEITA' ? 'bg-green-100' : 'bg-red-100'}`}>
        {transaction.categoria ? transaction.categoria.icone : (transaction.tipo === 'RECEITA' ? '💰' : '💸')}
      </div>
      <div>
        <h4 className="font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">{transaction.descricao}</h4>
        <p className="text-xs text-gray-500 font-medium">
          {new Date(transaction.data).toLocaleDateString('pt-BR')} • {transaction.categoria ? transaction.categoria.nome : 'Geral'}
        </p>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <span className={`font-bold text-lg ${transaction.tipo === 'RECEITA' ? 'text-green-600' : 'text-red-600'}`}>
        {transaction.tipo === 'DESPESA' ? '- ' : '+ '}
        {transaction.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
      </span>
      <button onClick={() => onDelete(transaction.id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
    </div>
  </div>
);

// --- PÁGINA DE ORÇAMENTO (AGORA REAL!) ---
const BudgetPage = ({ budgets, transactions }: { budgets: Orcamento[], transactions: Transaction[] }) => {
  
  // Calcular totais gerais
  const totalLimite = budgets.reduce((acc, b) => acc + b.valorLimite, 0);
  
  // Calcula quanto gastou SOMENTE nas categorias que têm orçamento
  const totalGastoGeral = budgets.reduce((acc, b) => {
    const gastosCategoria = transactions
      .filter(t => t.tipo === 'DESPESA' && t.categoria?.id === b.categoria.id)
      .reduce((sum, t) => sum + Math.abs(t.valor), 0);
    return acc + gastosCategoria;
  }, 0);

  const saldoDisponivel = totalLimite - totalGastoGeral;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Orçamento</h1>
        <button className="bg-indigo-100 text-indigo-600 p-2 rounded-lg hover:bg-indigo-200"><Plus size={20} /></button>
      </div>

      {/* Resumo Geral */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 text-center space-y-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div><p className="text-xs text-gray-400 uppercase font-bold">Limite Total</p><p className="text-xl font-bold text-gray-800">R$ {totalLimite.toLocaleString()}</p></div>
          <div><p className="text-xs text-gray-400 uppercase font-bold">Gasto</p><p className="text-xl font-bold text-red-500">R$ {totalGastoGeral.toLocaleString()}</p></div>
          <div><p className="text-xs text-gray-400 uppercase font-bold">Disponível</p><p className={`text-xl font-bold ${saldoDisponivel >= 0 ? 'text-green-500' : 'text-red-600'}`}>R$ {saldoDisponivel.toLocaleString()}</p></div>
        </div>
      </div>

      {/* Lista de Categorias */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {budgets.map(budget => {
          // Calcula gasto desta categoria específica
          const gastoCategoria = transactions
            .filter(t => t.tipo === 'DESPESA' && t.categoria?.id === budget.categoria.id)
            .reduce((sum, t) => sum + Math.abs(t.valor), 0);
          
          const percent = Math.min(100, Math.round((gastoCategoria / budget.valorLimite) * 100));
          const isAlert = percent > 80;

          return (
            <div key={budget.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{budget.categoria.icone}</span>
                  <h3 className="font-bold text-gray-800">{budget.categoria.nome}</h3>
                </div>
                <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded-lg text-gray-500">Mensal</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span className={isAlert ? "text-red-500" : "text-indigo-600"}>Gasto: R$ {gastoCategoria}</span>
                  <span className="text-gray-400">Limite: R$ {budget.valorLimite}</span>
                </div>
                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${isAlert ? 'bg-red-500' : 'bg-indigo-500'}`} 
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
                {isAlert && (
                  <div className="flex items-center gap-1 text-xs text-red-500 mt-1">
                    <AlertTriangle size={12} /> Cuidado! Você usou {percent}% do limite.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {budgets.length === 0 && (
        <p className="text-center text-gray-400 py-10">Nenhum orçamento definido no sistema.</p>
      )}
    </div>
  );
};

const GoalsPage = ({ goals, onAdd }: { goals: Meta[], onAdd: () => void }) => (
  <div className="space-y-6 animate-fadeIn">
    <header className="flex justify-between items-center">
      <h1 className="text-3xl font-bold text-gray-800">Metas</h1>
      <button onClick={onAdd} className="bg-indigo-100 text-indigo-600 p-2 rounded-lg hover:bg-indigo-200"><Plus size={20} /></button>
    </header>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {goals.map((goal) => {
        const percent = Math.min(100, Math.round((goal.valorAtual / goal.valorAlvo) * 100));
        return (
          <div key={goal.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="text-4xl mb-4">{goal.icone}</div>
            <h3 className="font-bold text-gray-800">{goal.titulo}</h3>
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1"><span className="font-bold text-indigo-600">R$ {goal.valorAtual.toLocaleString()}</span><span className="text-gray-400">Meta: R$ {goal.valorAlvo.toLocaleString()}</span></div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 transition-all duration-1000" style={{width: `${percent}%`}}></div></div>
              <p className="text-right text-xs text-indigo-400 mt-1 font-bold">{percent}%</p>
            </div>
          </div>
        );
      })}
      {goals.length === 0 && <p className="col-span-3 text-center text-gray-400 py-10">Nenhuma meta criada.</p>}
    </div>
  </div>
);

const ReportsPage = () => (
  <div className="space-y-6 animate-fadeIn">
    <header className="flex justify-between items-center">
      <h1 className="text-3xl font-bold text-gray-800">Relatórios</h1>
      <button className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl font-bold text-sm"><Download size={18} /> PDF</button>
    </header>
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Gastos por Categoria</h3>
      <div className="space-y-4">
        {[{cat: 'Moradia', val: 1200, pct: 60}, {cat: 'Alimentação', val: 450, pct: 25}, {cat: 'Lazer', val: 120, pct: 15}].map((item) => (
          <div key={item.cat}>
            <div className="flex justify-between text-sm mb-1"><span className="font-medium text-gray-700">{item.cat}</span><span className="text-gray-500">R$ {item.val} ({item.pct}%)</span></div>
            <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-500" style={{ width: `${item.pct}%` }}></div></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const SettingsPage = () => (
  <div className="space-y-6 animate-fadeIn">
    <h1 className="text-3xl font-bold text-gray-800">Configurações</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2"><User size={20}/> Perfil</h3>
        <div className="space-y-4">
          <div><label className="text-sm font-bold text-gray-600">Nome</label><input type="text" defaultValue="Usuário Demo" className="w-full p-3 bg-gray-50 rounded-xl mt-1" /></div>
          <div><label className="text-sm font-bold text-gray-600">Email</label><input type="email" defaultValue="user@email.com" className="w-full p-3 bg-gray-50 rounded-xl mt-1" /></div>
          <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700">Salvar</button>
        </div>
      </div>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><Eye size={20}/> Aparência</h3>
          <div className="flex gap-4">
            <button className="flex-1 p-4 border-2 border-indigo-600 bg-indigo-50 rounded-xl flex flex-col items-center gap-2 text-indigo-700 font-bold"><Sun size={24}/> Claro</button>
            <button className="flex-1 p-4 border border-gray-200 rounded-xl flex flex-col items-center gap-2 text-gray-500 hover:bg-gray-50"><Moon size={24}/> Escuro</button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// --- MODAL ---
const ModalTransaction = ({ isOpen, onClose, onSave, type, categories }: any) => {
  if (!isOpen) return null;
  const [desc, setDesc] = useState("");
  const [val, setVal] = useState("");
  const [catId, setCatId] = useState("");

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(desc, parseFloat(val), catId); setDesc(""); setVal(""); setCatId(""); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-fadeIn">
        <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-gray-800">Nova {type === 'RECEITA' ? 'Receita' : 'Despesa'}</h2><button onClick={onClose} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100"><X size={20}/></button></div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-bold text-gray-600 mb-1">Descrição</label><input required type="text" className="w-full p-3 bg-gray-50 rounded-xl" value={desc} onChange={e => setDesc(e.target.value)} /></div>
          <div><label className="block text-sm font-bold text-gray-600 mb-1">Valor (R$)</label><input required type="number" step="0.01" className="w-full p-3 bg-gray-50 rounded-xl" value={val} onChange={e => setVal(e.target.value)} /></div>
          <div><label className="block text-sm font-bold text-gray-600 mb-1">Categoria</label><select required className="w-full p-3 bg-gray-50 rounded-xl" value={catId} onChange={e => setCatId(e.target.value)}><option value="">Selecione...</option>{categories.map((c: any) => <option key={c.id} value={c.id}>{c.icone} {c.nome}</option>)}</select></div>
          <button type="submit" className={`w-full py-3 rounded-xl font-bold text-white mt-4 ${type === 'RECEITA' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-500 hover:bg-red-600'}`}>Salvar</button>
        </form>
      </div>
    </div>
  );
};

// --- APP PRINCIPAL ---

export default function PoupApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [goals, setGoals] = useState<Meta[]>([]);
  const [budgets, setBudgets] = useState<Orcamento[]>([]); // NOVO STATE
  const [chartData, setChartData] = useState<ChartData[]>(INITIAL_CHART_DATA);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'RECEITA' | 'DESPESA'>('DESPESA');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [resTrans, resCat, resGoals, resChart, resBudgets] = await Promise.all([
        fetch(`${API_BASE}/lancamentos`),
        fetch(`${API_BASE}/categorias`),
        fetch(`${API_BASE}/metas`),
        fetch(`${API_BASE}/dashboard/grafico`),
        fetch(`${API_BASE}/orcamentos`) // <--- NOVO: Buscando orçamentos
      ]);

      setTransactions(await resTrans.json());
      setCategories(await resCat.json());
      setGoals(await resGoals.json());
      setChartData(await resChart.json());
      setBudgets(await resBudgets.json()); // <--- SALVANDO ORÇAMENTOS

    } catch (error) { console.error("Erro:", error); }
  };

  const handleSave = async (descricao: string, valor: number, categoriaId: string) => {
    const valorFinal = modalType === 'DESPESA' ? -Math.abs(valor) : Math.abs(valor);
    const newTransaction = { descricao, valor: valorFinal, tipo: modalType, data: new Date().toISOString().split('T')[0], categoria: { id: parseInt(categoriaId) } };
    try { const res = await fetch(`${API_BASE}/lancamentos`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newTransaction) }); if (res.ok) { fetchData(); setIsModalOpen(false); } } catch (error) { alert("Erro ao salvar."); }
  };

  const handleAddGoal = async () => {
    const titulo = prompt("Nome da Meta:"); if(!titulo) return;
    const valorAlvo = parseFloat(prompt("Valor Alvo:") || "0");
    const valorAtual = parseFloat(prompt("Valor Atual:") || "0");
    const icone = prompt("Emoji:") || "🎯";
    const newGoal = { titulo, valorAlvo, valorAtual, icone, dataLimite: "2025-12-31" };
    try { const res = await fetch(`${API_BASE}/metas`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newGoal) }); if(res.ok) fetchData(); } catch(e) { alert("Erro"); }
  }

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza?")) { await fetch(`${API_BASE}/lancamentos/${id}`, { method: 'DELETE' }); fetchData(); }
  };

  const income = transactions.filter(t => t.tipo === 'RECEITA').reduce((acc, cur) => acc + cur.valor, 0);
  const expense = transactions.filter(t => t.tipo === 'DESPESA').reduce((acc, cur) => acc + Math.abs(cur.valor), 0);
  const balance = income - expense;

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard': return (
        <div className="space-y-8 animate-fadeIn">
           <div><h1 className="text-3xl font-bold text-gray-800">Dashboard</h1></div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6"><SummaryCard title="Saldo Atual" value={balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} subtitle="Receitas - Despesas" /><SummaryCard title="Receitas do Mês" value={`+ ${income.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`} type="positive" subtitle="Entradas" /><SummaryCard title="Despesas do Mês" value={`- ${expense.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`} type="negative" subtitle="Saídas" /></div>
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm"><h2 className="text-lg font-bold text-gray-800 mb-4">Balanço</h2><div className="h-72 w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" /><XAxis dataKey="name" axisLine={false} tickLine={false} /><YAxis axisLine={false} tickLine={false} /><Tooltip /><Bar dataKey="receita" fill="#818CF8" radius={[4, 4, 0, 0]} /><Bar dataKey="despesa" fill="#C084FC" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div></div>
             <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col h-full"><div className="flex justify-between items-center mb-6"><h2 className="text-lg font-bold text-gray-800">Últimas</h2><div className="flex gap-2"><button onClick={() => {setModalType('RECEITA'); setIsModalOpen(true)}} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"><Plus size={18}/></button><button onClick={() => {setModalType('DESPESA'); setIsModalOpen(true)}} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><Plus size={18}/></button></div></div><div className="space-y-3 overflow-y-auto max-h-80 pr-2 custom-scrollbar">{transactions.slice(0, 5).map(t => <TransactionItem key={t.id} transaction={t} onDelete={handleDelete} />)}</div></div>
           </div>
        </div>
      );
      case 'orcamento': return <BudgetPage budgets={budgets} transactions={transactions} />; // Passando dados reais
      case 'metas': return <GoalsPage goals={goals} onAdd={handleAddGoal} />;
      case 'relatorios': return <ReportsPage />;
      case 'configuracoes': return <SettingsPage />;
      case 'receitas': case 'despesas': return (
        <div className="space-y-6 animate-fadeIn"><header className="flex justify-between items-center"><div><h1 className="text-3xl font-bold text-gray-800 capitalize">{activeTab}</h1></div><button onClick={() => {setModalType(activeTab === 'receitas' ? 'RECEITA' : 'DESPESA'); setIsModalOpen(true)}} className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold shadow-lg"><Plus size={18} /> Novo</button></header><div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm"><div className="space-y-3">{transactions.filter(t => t.tipo === (activeTab === 'receitas' ? 'RECEITA' : 'DESPESA')).map(t => <TransactionItem key={t.id} transaction={t} onDelete={handleDelete} />)}</div></div></div>
      );
      default: return null;
    }
  };

  const NavItem = ({ id, icon: Icon, label }: any) => (
    <button onClick={() => setActiveTab(id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === id ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' : 'text-gray-500 hover:bg-indigo-50'}`}><Icon size={20} /> {label} {activeTab === id && <ChevronRight size={16} className="ml-auto opacity-50" />}</button>
  );

  return (
    <div className="flex h-screen bg-[#F3F4F6] font-sans overflow-hidden text-gray-800">
      <aside className={`fixed inset-y-0 left-0 z-30 w-72 bg-white flex flex-col border-r border-gray-100 md:static ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} transition-transform`}>
        <div className="p-6 flex flex-col items-center text-center border-b border-gray-50"><div className="w-32 h-32 mb-4 bg-indigo-50 rounded-full flex items-center justify-center overflow-hidden"><img src="/poup.png" alt="POUP" className="w-full h-full object-cover" /></div><h1 className="text-3xl font-black text-indigo-600">POUP</h1></div>
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto"><NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" /><NavItem id="receitas" icon={TrendingUp} label="Receitas" /><NavItem id="despesas" icon={TrendingDown} label="Despesas" /><NavItem id="orcamento" icon={Wallet} label="Orçamento" /><NavItem id="metas" icon={Target} label="Metas" /><NavItem id="relatorios" icon={PieChart} label="Relatórios" /><NavItem id="configuracoes" icon={Settings} label="Configurações" /></nav>
      </aside>
      <main className="flex-1 flex flex-col h-full relative">
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8"><button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}><Menu /></button><div className="ml-auto flex items-center gap-4"><Bell className="text-gray-400" /><div className="w-10 h-10 bg-indigo-600 rounded-full text-white flex items-center justify-center font-bold shadow-md">UD</div></div></header>
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#FAFAFA]"><div className="max-w-7xl mx-auto">{renderContent()}</div></div>
      </main>
      <ModalTransaction isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} type={modalType} categories={categories} />
    </div>
  );
}