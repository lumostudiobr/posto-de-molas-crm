import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock } from 'lucide-react';
import { Task, Lead } from '../types';
import { NewTaskModal } from '../components/NewTaskModal';
import { TaskDetailModal } from '../components/TaskDetailModal';

interface AgendaPageProps {
    tasks: Task[];
    leads: Lead[];
    onAddTask: (task: Task) => void;
    onUpdateTask: (task: Task) => void;
    onDeleteTask: (taskId: string) => void;
}

export const AgendaPage: React.FC<AgendaPageProps> = ({ tasks, leads, onAddTask, onUpdateTask, onDeleteTask }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isNewModalOpen, setIsNewModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const days = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday

        const calendarDays = [];

        // Fill previous month days
        for (let i = 0; i < startingDayOfWeek; i++) {
            calendarDays.push(null);
        }

        // Fill current month days
        for (let i = 1; i <= daysInMonth; i++) {
            calendarDays.push(new Date(year, month, i));
        }

        return calendarDays;
    };

    const calendarDays = getDaysInMonth(currentDate);

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto h-full flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Agenda de Visitas</h1>
                    <p className="text-gray-500 mt-1 capitalize">{currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</p>
                </div>
                <div className="flex items-center justify-between md:justify-end gap-3">
                    <button
                        onClick={goToToday}
                        className="px-4 py-2 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        Hoje
                    </button>
                    <div className="flex items-center bg-white border border-gray-300 rounded-lg p-1 shadow-sm">
                        <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-md transition-colors text-gray-600"><ChevronLeft size={16} /></button>
                        <div className="px-3 font-black text-xs text-gray-800 uppercase tracking-tighter min-w-[80px] text-center">
                            {currentDate.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })}
                        </div>
                        <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-md transition-colors text-gray-600"><ChevronRight size={16} /></button>
                    </div>
                    <button
                        onClick={() => setIsNewModalOpen(true)}
                        className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-2 shadow-sm text-sm"
                    >
                        <Plus size={18} /> <span className="hidden lg:inline">Novo Evento</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col overflow-hidden">
                {/* Days Header */}
                <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50 min-w-[700px] overflow-x-auto">
                    {days.map(day => (
                        <div key={day} className="py-4 text-center text-xs font-black text-gray-400 uppercase tracking-wider">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="flex-1 grid grid-cols-7 grid-rows-5 overflow-auto min-w-[700px]">
                    {calendarDays.map((dayDate, idx) => {
                        if (!dayDate) return <div key={idx} className="bg-gray-50/30 border-b border-r border-gray-100"></div>;

                        const isToday = dayDate.toDateString() === new Date().toDateString();

                        // Find tasks for this day
                        const dayTasks = tasks.filter(t => {
                            const tDate = new Date(t.dueDate);
                            return tDate.getDate() === dayDate.getDate() &&
                                tDate.getMonth() === dayDate.getMonth() &&
                                tDate.getFullYear() === dayDate.getFullYear() &&
                                !t.completed;
                        });

                        return (
                            <div key={idx} className={`border-b border-r border-gray-100 p-2 min-h-[100px] relative group hover:bg-yellow-50/10 transition-colors`}>
                                <span className={`text-sm font-bold w-8 h-8 flex items-center justify-center rounded-lg mb-1 ${isToday ? 'bg-black text-yellow-500 shadow-md' : 'text-gray-700'
                                    }`}>
                                    {dayDate.getDate()}
                                </span>

                                <div className="space-y-1">
                                    {dayTasks.map(task => (
                                        <div
                                            key={task.id}
                                            onClick={() => setSelectedTask(task)}
                                            className="p-1.5 bg-blue-50 text-blue-900 text-[10px] rounded-md truncate font-medium border-l-2 border-blue-500 shadow-sm cursor-pointer hover:bg-blue-100 transition-colors"
                                        >
                                            <div className="flex items-center gap-1">
                                                <Clock size={10} className="text-blue-500" />
                                                <span className="truncate">{task.title}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
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