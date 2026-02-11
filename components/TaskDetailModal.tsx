import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, CheckCircle, Calendar } from 'lucide-react';
import { Task, Lead } from '../types';

interface TaskDetailModalProps {
    task: Task | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (task: Task) => void;
    onDelete: (taskId: string) => void;
    leads: Lead[];
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, isOpen, onClose, onSave, onDelete, leads }) => {
    const [formData, setFormData] = useState<{
        title: string;
        description: string;
        leadId: string;
        date: string;
        time: string;
        type: 'Message' | 'Call' | 'Meeting' | 'Email';
        completed: boolean;
    }>({
        title: '',
        description: '',
        leadId: '',
        date: '',
        time: '',
        type: 'Call',
        completed: false
    });

    useEffect(() => {
        if (task) {
            const dateObj = new Date(task.dueDate);
            setFormData({
                title: task.title,
                description: task.description,
                leadId: task.leadId,
                date: dateObj.toISOString().split('T')[0],
                time: dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false }),
                type: task.type,
                completed: task.completed
            });
        }
    }, [task]);

    if (!isOpen || !task) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedTask: Task = {
            ...task,
            leadId: formData.leadId,
            title: formData.title,
            description: formData.description,
            dueDate: `${formData.date}T${formData.time}:00.000Z`,
            completed: formData.completed,
            type: formData.type
        };
        onSave(updatedTask);
        onClose();
    };

    const handleDelete = () => {
        if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
            onDelete(task.id);
            onClose();
        }
    };

    const toggleComplete = () => {
        setFormData(prev => ({ ...prev, completed: !prev.completed }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-black text-white">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Calendar size={20} className="text-yellow-500" />
                        Editar Tarefa
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="flex justify-end mb-2">
                         <button 
                            type="button" 
                            onClick={toggleComplete}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
                                formData.completed 
                                ? 'bg-green-100 text-green-700 border border-green-200' 
                                : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                            }`}
                         >
                            <CheckCircle size={16} />
                            {formData.completed ? 'Concluída' : 'Marcar como Concluída'}
                         </button>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Título</label>
                        <input 
                            required
                            type="text" 
                            className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                        />
                    </div>
                    
                    <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cliente</label>
                         <select 
                            className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                            value={formData.leadId}
                            onChange={e => setFormData({...formData, leadId: e.target.value})}
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
                                onChange={e => setFormData({...formData, date: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Hora</label>
                            <input 
                                type="time" 
                                required
                                className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                                value={formData.time}
                                onChange={e => setFormData({...formData, time: e.target.value})}
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
                                        onChange={() => setFormData({...formData, type: type as 'Message' | 'Call' | 'Meeting' | 'Email'})}
                                        className="text-yellow-500 focus:ring-yellow-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700">
                                        {type === 'Call' ? 'Ligação' : type === 'Meeting' ? 'Reunião' : type === 'Email' ? 'Email' : 'Msg'}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 flex justify-between items-center border-t border-gray-100 mt-4">
                        <button 
                            type="button" 
                            onClick={handleDelete} 
                            className="px-4 py-2 text-red-600 font-bold hover:bg-red-50 rounded-lg flex items-center gap-2"
                        >
                            <Trash2 size={18} /> Excluir
                        </button>
                        <div className="flex gap-3">
                            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg">Cancelar</button>
                            <button type="submit" className="px-6 py-2 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 shadow-md flex items-center gap-2">
                                <Save size={18} /> Salvar Alterações
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};