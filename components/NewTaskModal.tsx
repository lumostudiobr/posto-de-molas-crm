import React, { useState } from 'react';
import { X, Save, CheckSquare } from 'lucide-react';
import { Task, Lead } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface NewTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (task: Task) => void;
    leads: Lead[];
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({ isOpen, onClose, onSave, leads }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        leadId: '',
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        type: 'Call' as const
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newTask: any = {
            leadId: formData.leadId || null,
            title: formData.title,
            description: formData.description,
            dueDate: `${formData.date}T${formData.time}:00.000Z`,
            completed: false,
            type: formData.type
        };
        onSave(newTask as Task);
        setFormData({ title: '', description: '', leadId: '', date: new Date().toISOString().split('T')[0], time: '09:00', type: 'Call' });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-black text-white">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <CheckSquare size={20} className="text-yellow-500" />
                        Nova Tarefa / Evento
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Título *</label>
                        <input
                            required
                            type="text"
                            className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                            placeholder="Ex: Ligar para confirmar reunião"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cliente Relacionado</label>
                        <select
                            className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                            value={formData.leadId}
                            onChange={e => setFormData({ ...formData, leadId: e.target.value })}
                        >
                            <option value="">Selecione um cliente (Opcional)</option>
                            {leads.map(l => (
                                <option key={l.id} value={l.id}>{l.companyName}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Data</label>
                            <input
                                type="date"
                                required
                                className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Hora</label>
                            <input
                                type="time"
                                required
                                className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                                value={formData.time}
                                onChange={e => setFormData({ ...formData, time: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tipo</label>
                        <div className="flex gap-4">
                            {['Call', 'Meeting', 'Email', 'Message'].map(type => (
                                <label key={type} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="type"
                                        value={type}
                                        checked={formData.type === type}
                                        onChange={() => setFormData({ ...formData, type: type as any })}
                                        className="text-yellow-500 focus:ring-yellow-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700">
                                        {type === 'Call' ? 'Ligação' : type === 'Meeting' ? 'Reunião' : type === 'Email' ? 'Email' : 'Mensagem'}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

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