import React, { useState } from 'react';
import { X, Save, Briefcase } from 'lucide-react';
import { Lead, LeadStatus } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface NewLeadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (lead: Lead) => void;
    initialStatus?: LeadStatus;
}

export const NewLeadModal: React.FC<NewLeadModalProps> = ({ isOpen, onClose, onSave, initialStatus = 'New' }) => {
    const [formData, setFormData] = useState({
        companyName: '',
        contactPerson: '',
        phone: '',
        email: '',
        sector: '',
        city: '',
        value: 0
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newLead: any = {
            ...formData,
            status: initialStatus,
            priority: 'Medium',
            country: 'Brasil',
            address: '',
            website: '',
            rating: 0,
            notes: '',
            source: 'Manual',
            createdAt: new Date().toISOString()
        };
        onSave(newLead as Lead);
        setFormData({ companyName: '', contactPerson: '', phone: '', email: '', sector: '', city: '', value: 0 });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-black text-white">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Briefcase size={20} className="text-yellow-500" />
                        {initialStatus === 'Closed' ? 'Novo Cliente' : 'Novo Lead'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome da Empresa *</label>
                        <input
                            required
                            type="text"
                            className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                            value={formData.companyName}
                            onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Contato</label>
                            <input
                                type="text"
                                className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                                value={formData.contactPerson}
                                onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Telefone</label>
                            <input
                                type="text"
                                className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Setor</label>
                            <input
                                type="text"
                                className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                                value={formData.sector}
                                onChange={e => setFormData({ ...formData, sector: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cidade</label>
                            <input
                                type="text"
                                className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                                value={formData.city}
                                onChange={e => setFormData({ ...formData, city: e.target.value })}
                            />
                        </div>
                    </div>
                    {initialStatus === 'Closed' && (
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Valor do Contrato (R$)</label>
                            <input
                                type="number"
                                className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                                value={formData.value}
                                onChange={e => setFormData({ ...formData, value: parseFloat(e.target.value) })}
                            />
                        </div>
                    )}

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg">Cancelar</button>
                        <button type="submit" className="px-6 py-2 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 shadow-md flex items-center gap-2">
                            <Save size={18} /> Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};