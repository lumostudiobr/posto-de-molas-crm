import React, { useState } from 'react';
import { Search, Mail, Phone, MoreVertical, Plus, Download } from 'lucide-react';
import { Lead } from '../types';
import { NewLeadModal } from '../components/NewLeadModal';
import { exportLeadsToCSV } from '../utils/csvExport';

interface ClientsPageProps {
    clients: Lead[];
    onAddClient: (lead: Lead) => void;
}

export const ClientsPage: React.FC<ClientsPageProps> = ({ clients, onAddClient }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredClients = clients.filter(c => 
        c.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
             <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Meus Clientes</h1>
                    <p className="text-sm md:text-base text-gray-500 mt-1">Gerencie sua carteira de clientes ativos</p>
                </div>
                <div className="flex flex-col md:flex-row gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                        <input 
                            type="text" 
                            placeholder="Buscar cliente..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 bg-white rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all shadow-sm"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => exportLeadsToCSV(filteredClients, 'Clientes_Fechados')}
                            className="flex-1 md:flex-none justify-center bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg font-bold transition-all shadow-sm text-sm flex items-center gap-2"
                        >
                            <Download size={18} /> Exportar
                        </button>
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="flex-1 md:flex-none justify-center bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-2 shadow-sm text-sm"
                        >
                            <Plus size={18} /> Novo Cliente
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[600px]">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Empresa</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Contato</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Valor</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredClients.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                        Nenhum cliente encontrado.
                                    </td>
                                </tr>
                            ) : (
                                filteredClients.map(client => (
                                    <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-black text-yellow-500 flex items-center justify-center font-bold">
                                                    {client.companyName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{client.companyName}</p>
                                                    <p className="text-xs text-gray-500">{client.sector}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-700">{client.contactPerson || 'N/A'}</p>
                                            <div className="flex gap-2 mt-1">
                                                {client.email && <Mail size={14} className="text-gray-400" />}
                                                {client.phone && <Phone size={14} className="text-gray-400" />}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Ativo
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-gray-900">R$ {client.value.toLocaleString('pt-BR')}</p>
                                            <p className="text-xs text-gray-400">Mensal</p>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-gray-400 hover:text-gray-600">
                                                <MoreVertical size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <NewLeadModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={onAddClient}
                initialStatus="Closed"
            />
        </div>
    );
}