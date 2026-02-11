import React, { useState } from 'react';
import { Plus, Bot, Power, Edit, Trash2, MessageCircle, Settings, Play } from 'lucide-react';
import { Agent } from '../types';
import { AgentConfigModal } from '../components/AgentConfigModal';
import { WhatsAppSimulator } from '../components/WhatsAppSimulator';

interface AgentsPageProps {
    agents: Agent[];
    onAddAgent: (agent: Agent) => void;
    onUpdateAgent: (agent: Agent) => void;
    onDeleteAgent: (id: string) => void;
}

export const AgentsPage: React.FC<AgentsPageProps> = ({ agents, onAddAgent, onUpdateAgent, onDeleteAgent }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
    const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
    const [selectedAgentForSim, setSelectedAgentForSim] = useState<Agent | null>(null);

    const handleEdit = (agent: Agent) => {
        setEditingAgent(agent);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingAgent(null);
        setIsModalOpen(true);
    };

    const toggleStatus = (agent: Agent) => {
        onUpdateAgent({ ...agent, isActive: !agent.isActive });
    };

    const openSimulator = (agent: Agent) => {
        setSelectedAgentForSim(agent);
        setIsSimulatorOpen(true);
    }

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto h-full flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Agentes Inteligentes</h1>
                    <p className="text-gray-500 mt-1">Configure sua força de vendas e atendimento automática.</p>
                </div>
                <button 
                    onClick={handleAddNew}
                    className="w-full md:w-auto bg-black hover:bg-gray-800 text-yellow-500 px-6 py-3 rounded-lg font-bold transition-all shadow-lg shadow-gray-200 text-sm flex items-center justify-center gap-2 uppercase tracking-wide"
                >
                    <Plus size={20} strokeWidth={3} /> Novo Agente
                </button>
            </div>

            {agents.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-2xl border border-dashed border-gray-300 p-8 md:p-12 text-center">
                    <div className="w-24 h-24 bg-yellow-50 rounded-full flex items-center justify-center mb-6">
                        <Bot size={48} className="text-yellow-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhum Agente Configurado</h3>
                    <p className="text-gray-500 max-w-md mb-8">Crie seu primeiro agente para automatizar prospecção ou atendimento via WhatsApp.</p>
                    <button 
                        onClick={handleAddNew}
                        className="bg-yellow-500 text-black font-bold px-8 py-3 rounded-lg hover:bg-yellow-400 transition-colors"
                    >
                        Criar Primeiro Agente
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {agents.map(agent => (
                        <div key={agent.id} className={`bg-white rounded-xl shadow-sm border transition-all hover:shadow-md ${agent.isActive ? 'border-gray-200' : 'border-gray-100 opacity-70'}`}>
                            {/* Card Header */}
                            <div className="p-6 border-b border-gray-100 flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 ${agent.isActive ? 'bg-black text-yellow-500 border-black' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
                                        <Bot size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{agent.name}</h3>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${
                                            agent.role === 'Prospector' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                                        }`}>
                                            {agent.role === 'Prospector' ? 'Prospecção' : 'Atendimento'}
                                        </span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => toggleStatus(agent)}
                                    title={agent.isActive ? "Desativar" : "Ativar"}
                                    className={`w-10 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out relative ${agent.isActive ? 'bg-green-500' : 'bg-gray-300'}`}
                                >
                                    <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ${agent.isActive ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                </button>
                            </div>

                            {/* Stats / Details */}
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 flex items-center gap-2"><MessageCircle size={16} /> WhatsApp</span>
                                    <span className="font-medium text-gray-900">{agent.whatsappNumber || 'Não config.'}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 flex items-center gap-2"><Settings size={16} /> Temperatura</span>
                                    <span className="font-medium text-gray-900">{agent.temperature}</span>
                                </div>
                                 <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-600 italic border border-gray-100 line-clamp-2">
                                    "{agent.systemInstruction.slice(0, 100)}..."
                                </div>
                                
                                <button 
                                    onClick={() => openSimulator(agent)}
                                    className="w-full py-3 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
                                >
                                    <Play size={18} fill="white" /> Testar no WhatsApp
                                </button>
                            </div>

                            {/* Footer Actions */}
                            <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-2 rounded-b-xl">
                                <button 
                                    onClick={() => handleEdit(agent)}
                                    className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg font-bold text-sm hover:bg-yellow-50 hover:text-yellow-700 hover:border-yellow-300 transition-colors"
                                >
                                    <Edit size={16} /> Configurar
                                </button>
                                <button 
                                    onClick={() => onDeleteAgent(agent.id)}
                                    className="px-3 py-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <AgentConfigModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={editingAgent ? onUpdateAgent : onAddAgent}
                agentToEdit={editingAgent}
            />

            {isSimulatorOpen && selectedAgentForSim && (
                <WhatsAppSimulator 
                    agent={selectedAgentForSim}
                    onClose={() => setIsSimulatorOpen(false)}
                />
            )}
        </div>
    );
};