import React from 'react';
import { Users, DollarSign, Activity, TrendingUp } from 'lucide-react';
import { Lead, Task } from '../types';

interface DashboardPageProps {
    leads: Lead[];
    tasks: Task[];
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ leads, tasks }) => {
    // KPI Calculations
    const totalLeads = leads.length;
    const closedLeads = leads.filter(l => l.status === 'Closed');
    const totalRevenue = closedLeads.reduce((acc, curr) => acc + (curr.value || 0), 0);
    const conversionRate = totalLeads > 0 ? ((closedLeads.length / totalLeads) * 100).toFixed(1) : "0";
    
    // Funnel Data
    const funnel = {
        new: leads.filter(l => l.status === 'New').length,
        contacted: leads.filter(l => l.status === 'Contacted').length,
        proposal: leads.filter(l => l.status === 'Proposal').length,
        closed: leads.filter(l => l.status === 'Closed').length
    };
    
    const maxVal = Math.max(funnel.new, funnel.contacted, funnel.proposal, funnel.closed, 1);

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Painel de Controle</h1>
                <p className="text-sm md:text-base text-gray-500 mt-1">Visão geral do desempenho comercial</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Total Leads</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-2">{totalLeads}</h3>
                        </div>
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                            <Users size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                     <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Receita Fechada</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-2">R$ {totalRevenue.toLocaleString()}</h3>
                        </div>
                        <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                            <DollarSign size={24} />
                        </div>
                    </div>
                </div>

                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                     <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Conversão</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-2">{conversionRate}%</h3>
                        </div>
                        <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                     <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Tarefas Pendentes</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-2">{tasks.filter(t => !t.completed).length}</h3>
                        </div>
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                            <Activity size={24} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                {/* Visual Sales Funnel */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="font-bold text-lg text-gray-900 mb-6">Funil de Vendas</h3>
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <div className="flex justify-between text-sm font-medium text-gray-600">
                                <span>Novos Leads</span>
                                <span>{funnel.new}</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                                <div className="bg-blue-500 h-4 rounded-full transition-all duration-1000" style={{ width: `${(funnel.new / maxVal) * 100}%` }}></div>
                            </div>
                        </div>
                         <div className="space-y-1">
                            <div className="flex justify-between text-sm font-medium text-gray-600">
                                <span>Em Contato</span>
                                <span>{funnel.contacted}</span>
                            </div>
                             <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                                <div className="bg-yellow-500 h-4 rounded-full transition-all duration-1000" style={{ width: `${(funnel.contacted / maxVal) * 100}%` }}></div>
                            </div>
                        </div>
                         <div className="space-y-1">
                            <div className="flex justify-between text-sm font-medium text-gray-600">
                                <span>Proposta</span>
                                <span>{funnel.proposal}</span>
                            </div>
                             <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                                <div className="bg-purple-500 h-4 rounded-full transition-all duration-1000" style={{ width: `${(funnel.proposal / maxVal) * 100}%` }}></div>
                            </div>
                        </div>
                         <div className="space-y-1">
                            <div className="flex justify-between text-sm font-medium text-gray-600">
                                <span>Fechados</span>
                                <span>{funnel.closed}</span>
                            </div>
                             <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                                <div className="bg-green-500 h-4 rounded-full transition-all duration-1000" style={{ width: `${(funnel.closed / maxVal) * 100}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="font-bold text-lg text-gray-900 mb-6">Atividades Recentes</h3>
                    <div className="space-y-4">
                        {tasks.slice(0, 5).map(task => (
                            <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${task.completed ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-800 truncate">{task.title}</p>
                                    <p className="text-xs text-gray-500">{new Date(task.dueDate).toLocaleDateString()}</p>
                                </div>
                                <span className="text-xs font-medium px-2 py-1 bg-white rounded border border-gray-200 uppercase whitespace-nowrap">{task.type}</span>
                            </div>
                        ))}
                        {tasks.length === 0 && <p className="text-gray-400 text-sm">Nenhuma atividade recente.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};