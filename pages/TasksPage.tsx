import React, { useState } from 'react';
import { Plus, CheckCircle, Circle, Clock, Download } from 'lucide-react';
import { Task, Lead } from '../types';
import { NewTaskModal } from '../components/NewTaskModal';
import { TaskDetailModal } from '../components/TaskDetailModal';
import { exportTasksToCSV } from '../utils/csvExport';

interface TasksPageProps {
  tasks: Task[];
  leads: Lead[];
  onAddTask: (task: Task) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleTask: (id: string) => void;
}

export const TasksPage: React.FC<TasksPageProps> = ({ tasks, leads, onAddTask, onUpdateTask, onDeleteTask, onToggleTask }) => {
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Completed'>('All');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const filteredTasks = tasks.filter(t => {
      if (filter === 'Pending') return !t.completed;
      if (filter === 'Completed') return t.completed;
      return true;
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
           <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Gestão de Tarefas</h1>
           <p className="text-gray-500 mt-1">Organize e acompanhe suas tarefas por cliente</p>
        </div>
        <div className="flex gap-3">
             <button 
                onClick={() => exportTasksToCSV(filteredTasks, leads, 'Tarefas')}
                className="flex-1 md:flex-none justify-center bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg font-bold transition-all shadow-sm text-sm flex items-center gap-2"
            >
                <Download size={18} /> Exportar
            </button>
            <button 
                onClick={() => setIsNewModalOpen(true)}
                className="flex-1 md:flex-none justify-center bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-2 shadow-sm"
            >
                <Plus size={20} /> Nova Tarefa
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
         {/* Simple Statistics Cards */}
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
             <div className="flex items-center gap-2 mb-2 text-blue-600 font-medium">
                 <Circle size={16} strokeWidth={3} /> A Fazer
             </div>
             <div className="text-3xl font-bold text-gray-900">{tasks.filter(t => !t.completed).length}</div>
             <p className="text-xs text-gray-400 mt-1">Tarefas pendentes</p>
         </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
             <div className="flex items-center gap-2 mb-2 text-green-600 font-medium">
                 <CheckCircle size={16} strokeWidth={3} /> Concluído
             </div>
             <div className="text-3xl font-bold text-gray-900">{tasks.filter(t => t.completed).length}</div>
             <p className="text-xs text-gray-400 mt-1">Tarefas finalizadas</p>
         </div>
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex gap-4 overflow-x-auto">
              <button 
                onClick={() => setFilter('All')}
                className={`text-sm font-medium pb-2 -mb-4.5 border-b-2 px-2 transition-colors whitespace-nowrap ${filter === 'All' ? 'border-yellow-500 text-yellow-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
              >
                  Todas
              </button>
              <button 
                 onClick={() => setFilter('Pending')}
                 className={`text-sm font-medium pb-2 -mb-4.5 border-b-2 px-2 transition-colors whitespace-nowrap ${filter === 'Pending' ? 'border-yellow-500 text-yellow-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
              >
                  Pendentes
              </button>
              <button 
                 onClick={() => setFilter('Completed')}
                 className={`text-sm font-medium pb-2 -mb-4.5 border-b-2 px-2 transition-colors whitespace-nowrap ${filter === 'Completed' ? 'border-yellow-500 text-yellow-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
              >
                  Concluídas
              </button>
          </div>
          
          <div className="divide-y divide-gray-100">
            {filteredTasks.length === 0 ? (
                <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-400">
                        <CheckCircle size={32} />
                    </div>
                    <h3 className="text-gray-900 font-medium mb-1">Nenhuma tarefa encontrada</h3>
                    <p className="text-gray-500 text-sm">Crie novas tarefas para organizar seu dia.</p>
                </div>
            ) : (
                filteredTasks.map(task => (
                    <div 
                        key={task.id} 
                        onClick={() => setSelectedTask(task)}
                        className="p-4 md:p-6 hover:bg-gray-50 transition-colors flex flex-col md:flex-row md:items-center justify-between group cursor-pointer gap-4 md:gap-0"
                    >
                        <div className="flex items-start md:items-center gap-4">
                            <button 
                                onClick={(e) => { e.stopPropagation(); onToggleTask(task.id); }}
                                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 text-transparent hover:border-yellow-500'}`}
                            >
                                <CheckCircle size={14} />
                            </button>
                            <div>
                                <h3 className={`font-medium text-gray-900 ${task.completed ? 'line-through text-gray-400' : ''}`}>{task.title}</h3>
                                <p className="text-sm text-gray-500 line-clamp-1">{task.description}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 ml-10 md:ml-0">
                            <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
                                <Clock size={14} /> {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                            <span className={`px-2 py-1 rounded-md text-xs font-medium uppercase ${
                                task.type === 'Call' ? 'bg-blue-100 text-blue-700' :
                                task.type === 'Meeting' ? 'bg-purple-100 text-purple-700' :
                                'bg-gray-100 text-gray-700'
                            }`}>
                                {task.type}
                            </span>
                        </div>
                    </div>
                ))
            )}
          </div>
      </div>

      <NewTaskModal 
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSave={onAddTask}
        leads={leads}
      />

      <TaskDetailModal 
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onSave={onUpdateTask}
        onDelete={onDeleteTask}
        leads={leads}
      />
    </div>
  );
};