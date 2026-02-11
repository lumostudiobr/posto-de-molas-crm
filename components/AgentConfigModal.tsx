
import React, { useState, useEffect } from 'react';
import { X, Save, Bot, BrainCircuit, MessageSquare, Settings2, Sparkles, Wifi, ShieldCheck, Server } from 'lucide-react';
import { Agent, WhatsappConfig } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface AgentConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (agent: Agent) => void;
    agentToEdit?: Agent | null;
}

export const AgentConfigModal: React.FC<AgentConfigModalProps> = ({ isOpen, onClose, onSave, agentToEdit }) => {
    const [showApiConfig, setShowApiConfig] = useState(false);
    const [formData, setFormData] = useState<Agent>({
        id: '',
        name: '',
        role: 'Prospector',
        whatsappNumber: '',
        isActive: true,
        temperature: 0.7,
        tone: 'Profissional e Direto',
        systemInstruction: '',
        knowledgeBase: '',
        whatsappConfig: {
            provider: 'EvolutionAPI',
            baseUrl: 'https://api.seudominio.com',
            instanceName: 'instancia_01',
            apiKey: '',
            isEnabled: false
        }
    });

    // Load templates based on role
    const loadTemplate = (role: 'Prospector' | 'CustomerSupport') => {
        if (role === 'Prospector') {
            setFormData(prev => ({
                ...prev,
                role: 'Prospector',
                temperature: 0.8,
                tone: 'Persuasivo e Cordial',
                systemInstruction: `Você é um especialista em vendas da RR Posto de Molas.
Seu objetivo é agendar uma visita ou uma chamada com o lead.
Nunca seja chato ou insistente demais. Use gatilhos mentais de escassez e autoridade.
Foque em oferecer serviços de manutenção preventiva e peças para frotas.`,
                knowledgeBase: `- A RR Posto de Molas atua há 20 anos no mercado.
- Oferecemos manutenção de suspensão, freios e troca de molas.
- Atendemos caminhões, ônibus e utilitários.
- Temos serviço de socorro 24h.`
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                role: 'CustomerSupport',
                temperature: 0.2,
                tone: 'Empático e Resolutivo',
                systemInstruction: `Você é o assistente virtual de atendimento da RR Posto de Molas.
Sua função é triar o cliente e tirar dúvidas básicas.
Se o cliente quiser um orçamento complexo, transfira para um humano.
Seja sempre educado e use emojis moderadamente.`,
                knowledgeBase: `- Horário de funcionamento: Seg a Sex das 08h às 18h.
- Endereço: Rodovia BR 369, km 10.
- Aceitamos todos os cartões e faturamento para empresas cadastradas.`
            }));
        }
    };

    useEffect(() => {
        if (isOpen) {
            if (agentToEdit) {
                setFormData(agentToEdit);
                // Ensure whatsappConfig exists for legacy data
                if (!agentToEdit.whatsappConfig) {
                    setFormData(prev => ({
                        ...prev,
                        whatsappConfig: {
                            provider: 'EvolutionAPI',
                            baseUrl: 'https://api.seudominio.com',
                            instanceName: 'instancia_01',
                            apiKey: '',
                            isEnabled: false
                        }
                    }));
                }
            } else {
                // Reset to default new agent
                setFormData({
                    id: '',
                    name: '',
                    role: 'Prospector',
                    whatsappNumber: '',
                    isActive: true,
                    temperature: 0.7,
                    tone: 'Profissional',
                    systemInstruction: '',
                    knowledgeBase: '',
                    whatsappConfig: {
                        provider: 'EvolutionAPI',
                        baseUrl: 'https://api.seudominio.com',
                        instanceName: 'instancia_01',
                        apiKey: '',
                        isEnabled: false
                    }
                });
                loadTemplate('Prospector');
            }
            setShowApiConfig(false);
        }
    }, [isOpen, agentToEdit]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...formData,
            id: formData.id || uuidv4()
        });
        onClose();
    };

    const updateWhatsappConfig = (field: keyof WhatsappConfig, value: any) => {
        setFormData(prev => ({
            ...prev,
            whatsappConfig: {
                ...prev.whatsappConfig,
                [field]: value
            }
        }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-inter">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden border border-gray-200">
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-5 border-b border-gray-200 bg-black text-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-500 rounded-lg text-black">
                             <Bot size={24} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h3 className="font-bold text-xl">Configuração do Agente IA</h3>
                            <p className="text-gray-400 text-xs">Treine seu atendente virtual</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors hover:bg-white/10 p-2 rounded-full">
                        <X size={24} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="flex-1 flex overflow-hidden">
                    {/* Left Column: Basic Settings */}
                    <div className="w-1/3 bg-gray-50 border-r border-gray-200 p-6 overflow-y-auto space-y-6 flex flex-col">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Nome do Agente</label>
                            <input 
                                required
                                type="text" 
                                className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none text-sm font-medium"
                                placeholder="Ex: Atendente Bia"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Função (Role)</label>
                            <div className="grid grid-cols-1 gap-3">
                                <button
                                    type="button"
                                    onClick={() => loadTemplate('Prospector')}
                                    className={`p-3 rounded-lg border text-left transition-all ${formData.role === 'Prospector' ? 'bg-black text-yellow-500 border-black ring-1 ring-yellow-500' : 'bg-white border-gray-300 hover:border-gray-400 text-gray-600'}`}
                                >
                                    <div className="font-bold text-sm flex items-center gap-2">
                                        <Sparkles size={16} /> Prospecção Ativa
                                    </div>
                                    <p className="text-[10px] mt-1 opacity-80">Focado em vendas e agendamentos.</p>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => loadTemplate('CustomerSupport')}
                                    className={`p-3 rounded-lg border text-left transition-all ${formData.role === 'CustomerSupport' ? 'bg-black text-yellow-500 border-black ring-1 ring-yellow-500' : 'bg-white border-gray-300 hover:border-gray-400 text-gray-600'}`}
                                >
                                    <div className="font-bold text-sm flex items-center gap-2">
                                        <MessageSquare size={16} /> Pré-Atendimento
                                    </div>
                                    <p className="text-[10px] mt-1 opacity-80">Triagem e tira-dúvidas (Inbound).</p>
                                </button>
                            </div>
                        </div>

                        <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                                <Wifi size={14} className="text-green-500" />
                                Integração WhatsApp
                            </label>
                            
                            {!showApiConfig ? (
                                <div className="space-y-3">
                                    <input 
                                        type="text" 
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500"
                                        placeholder="+55 11 99999-9999"
                                        value={formData.whatsappNumber}
                                        readOnly
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowApiConfig(true)}
                                        className="w-full py-2 bg-black text-yellow-500 font-bold text-xs rounded-lg uppercase tracking-wide hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Settings2 size={14} /> Configurar API
                                    </button>
                                    <div className="flex items-center gap-2 justify-center">
                                        <div className={`w-2 h-2 rounded-full ${formData.whatsappConfig.isEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">{formData.whatsappConfig.isEnabled ? 'API Conectada' : 'API Desconectada'}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3 animate-fade-in">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-black">Credenciais API</span>
                                        <button onClick={() => setShowApiConfig(false)} className="text-[10px] text-red-500 font-bold hover:underline">Fechar</button>
                                    </div>
                                    
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase">Provedor</label>
                                        <select 
                                            className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-xs"
                                            value={formData.whatsappConfig.provider}
                                            onChange={(e) => updateWhatsappConfig('provider', e.target.value)}
                                        >
                                            <option value="EvolutionAPI">Evolution API</option>
                                            <option value="Z-API">Z-API</option>
                                            <option value="WppConnect">WppConnect</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase">Base URL</label>
                                        <div className="relative">
                                            <Server size={12} className="absolute left-2 top-2.5 text-gray-400" />
                                            <input 
                                                type="text"
                                                className="w-full pl-7 p-2 bg-gray-50 border border-gray-200 rounded text-xs"
                                                value={formData.whatsappConfig.baseUrl}
                                                onChange={(e) => updateWhatsappConfig('baseUrl', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase">Nome da Instância</label>
                                        <input 
                                            type="text"
                                            className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-xs"
                                            value={formData.whatsappConfig.instanceName}
                                            onChange={(e) => updateWhatsappConfig('instanceName', e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase">API Key (Token)</label>
                                        <div className="relative">
                                            <ShieldCheck size={12} className="absolute left-2 top-2.5 text-gray-400" />
                                            <input 
                                                type="password"
                                                className="w-full pl-7 p-2 bg-gray-50 border border-gray-200 rounded text-xs"
                                                value={formData.whatsappConfig.apiKey}
                                                onChange={(e) => updateWhatsappConfig('apiKey', e.target.value)}
                                                placeholder="••••••••••••••"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 pt-2">
                                        <input 
                                            type="checkbox" 
                                            id="enableApi"
                                            checked={formData.whatsappConfig.isEnabled}
                                            onChange={(e) => updateWhatsappConfig('isEnabled', e.target.checked)}
                                            className="rounded text-yellow-500 focus:ring-yellow-500"
                                        />
                                        <label htmlFor="enableApi" className="text-xs font-medium text-gray-700">Habilitar Integração</label>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                             <div className="flex items-center justify-between mb-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Criatividade (Temperatura)</label>
                                <span className="text-xs font-bold bg-gray-200 px-2 py-0.5 rounded">{formData.temperature}</span>
                             </div>
                             <input 
                                type="range" 
                                min="0" 
                                max="1" 
                                step="0.1"
                                value={formData.temperature}
                                onChange={e => setFormData({...formData, temperature: parseFloat(e.target.value)})}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                             />
                             <p className="text-[10px] text-gray-500 mt-2">
                                {formData.temperature < 0.3 ? 'Conservador e Preciso (Ideal para Suporte)' : 
                                 formData.temperature > 0.7 ? 'Criativo e Dinâmico (Ideal para Vendas)' : 'Equilibrado'}
                             </p>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Tom de Voz</label>
                            <select 
                                className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none text-sm"
                                value={formData.tone}
                                onChange={e => setFormData({...formData, tone: e.target.value})}
                            >
                                <option value="Profissional e Direto">Profissional e Direto</option>
                                <option value="Amigável e Casual">Amigável e Casual</option>
                                <option value="Empático e Atencioso">Empático e Atencioso</option>
                                <option value="Persuasivo e Energético">Persuasivo e Energético</option>
                            </select>
                        </div>
                    </div>

                    {/* Right Column: Advanced Training */}
                    <div className="flex-1 p-8 overflow-y-auto bg-white space-y-6">
                        <div className="flex items-center gap-2 mb-2 text-black font-bold pb-2 border-b border-gray-100">
                            <BrainCircuit size={20} className="text-yellow-500" />
                            <h3>Instruções do Sistema (Prompt Principal)</h3>
                        </div>
                        
                        <div className="space-y-2">
                            <p className="text-xs text-gray-500">Defina COMO o agente deve se comportar. Use imperativos.</p>
                            <textarea 
                                required
                                rows={8}
                                className="w-full p-4 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-sm font-mono leading-relaxed resize-none"
                                value={formData.systemInstruction}
                                onChange={e => setFormData({...formData, systemInstruction: e.target.value})}
                                placeholder="Ex: Você é um assistente útil..."
                            ></textarea>
                        </div>

                         <div className="flex items-center gap-2 mb-2 text-black font-bold pb-2 border-b border-gray-100 mt-6">
                            <Settings2 size={20} className="text-yellow-500" />
                            <h3>Base de Conhecimento (Contexto)</h3>
                        </div>

                        <div className="space-y-2">
                            <p className="text-xs text-gray-500">Cole aqui informações cruciais sobre a empresa (Preços, FAQ, História).</p>
                            <textarea 
                                rows={6}
                                className="w-full p-4 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-sm leading-relaxed resize-none"
                                value={formData.knowledgeBase}
                                onChange={e => setFormData({...formData, knowledgeBase: e.target.value})}
                                placeholder="Informações que o bot precisa saber..."
                            ></textarea>
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-6 py-2.5 text-gray-600 font-bold hover:bg-gray-200 rounded-lg transition-colors text-sm uppercase">
                        Cancelar
                    </button>
                    <button onClick={handleSubmit} className="px-8 py-2.5 bg-yellow-500 text-black font-black rounded-lg hover:bg-yellow-400 shadow-md flex items-center gap-2 text-sm uppercase tracking-wide transform active:scale-95 transition-all">
                        <Save size={18} strokeWidth={2.5} /> Salvar Agente
                    </button>
                </div>
            </div>
        </div>
    );
};
