import React, { useState, useEffect } from 'react';
import { X, Phone, MessageCircle, Calendar, Trash2, Save, ExternalLink, Briefcase } from 'lucide-react';
import { Lead } from '../types';

interface LeadDetailModalProps {
  lead: Lead | null;
  onClose: () => void;
  onSave: (updatedLead: Lead) => void;
  onDelete: (id: string) => void;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({ lead, onClose, onSave, onDelete }) => {
  const [formData, setFormData] = useState<Lead | null>(null);
  const [whatsappMessage, setWhatsappMessage] = useState('');

  useEffect(() => {
    if (lead) {
      setFormData({ ...lead });
      // Hardcoded, standard message template as requested
      const message = `Olá ${lead.companyName}, aqui é da RR Posto de Molas. Entro em contato sobre nossos serviços de manutenção e peças.`;
      setWhatsappMessage(message);
    }
  }, [lead]);

  if (!lead || !formData) return null;

  const handleChange = (field: keyof Lead, value: any) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleSave = () => {
    if (formData) {
      onSave(formData);
      onClose();
    }
  };

  const handleWhatsApp = () => {
    const cleanNumber = formData.phone.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(whatsappMessage);
    window.open(`https://wa.me/${cleanNumber}?text=${encodedMessage}`, '_blank');
  };

  const handleCall = () => {
    window.open(`tel:${formData.phone}`, '_self');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-white">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-black text-yellow-500 rounded-xl flex items-center justify-center font-bold text-2xl shadow-md">
                    {formData.companyName.charAt(0)}
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 truncate max-w-md">{formData.companyName}</h2>
                    <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                        {formData.sector} 
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span> 
                        {formData.city}, {formData.country}
                    </p>
                </div>
            </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-900 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-gray-50/50">
            
          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
             <button 
                onClick={handleWhatsApp}
                className="bg-[#25D366] hover:bg-[#128C7E] text-white py-4 px-6 rounded-xl flex items-center justify-center gap-3 font-bold transition-all shadow-sm active:scale-95"
             >
                <MessageCircle size={22} /> Contatar via WhatsApp
             </button>
             <button 
                onClick={handleCall}
                className="bg-white border-2 border-black hover:bg-gray-50 text-black py-4 px-6 rounded-xl flex items-center justify-center gap-3 font-bold transition-all shadow-sm active:scale-95"
             >
                <Phone size={22} /> Ligar Agora
             </button>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-6 text-black font-bold border-b border-gray-100 pb-3">
                <Briefcase size={20} className="text-yellow-500" />
                <h3>Dados da Empresa</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Nome da Empresa</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => handleChange('companyName', e.target.value)}
                    className="w-full p-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Pessoa de Contato</label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => handleChange('contactPerson', e.target.value)}
                    className="w-full p-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all font-medium"
                    placeholder="Ex: João Silva"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Setor</label>
                  <input
                    type="text"
                    value={formData.sector}
                    onChange={(e) => handleChange('sector', e.target.value)}
                    className="w-full p-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Telefone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full p-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all font-medium"
                  />
                </div>
              </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-black font-bold border-b border-gray-100 pb-3">
              <Calendar size={20} className="text-yellow-500" />
              <h3>Status do Funil</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Fase Atual</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full p-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all font-medium"
                >
                    <option value="New">Novo Lead</option>
                    <option value="Contacted">Em Contato</option>
                    <option value="Proposal">Proposta Enviada</option>
                    <option value="Closed">Cliente Fechado</option>
                    <option value="Lost">Perdido</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Prioridade</label>
                <select
                  value={formData.priority}
                  onChange={(e) => handleChange('priority', e.target.value)}
                  className="w-full p-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all font-medium"
                >
                    <option value="Low">Baixa</option>
                    <option value="Medium">Média</option>
                    <option value="High">Alta</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Observações Internas</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  className="w-full p-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all font-medium resize-none"
                  placeholder="Anotações sobre o cliente..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-gray-200 bg-white flex justify-between items-center">
          <button
            onClick={() => onDelete(formData.id)}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-bold uppercase tracking-wide"
          >
            <Trash2 size={18} /> Excluir Lead
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-bold uppercase tracking-wide"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-8 py-3 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors text-sm font-bold uppercase tracking-wide shadow-md"
            >
              <Save size={18} /> Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};