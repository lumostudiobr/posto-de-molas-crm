
import { Lead, Task } from '../types';

export const exportLeadsToCSV = (leads: Lead[], filename: string) => {
    const headers = ['ID', 'Empresa', 'Setor', 'Contato', 'Telefone', 'Email', 'Cidade', 'Estado', 'Status', 'Prioridade', 'Valor', 'Avaliação', 'Criado Em', 'Observações'];
    
    const rows = leads.map(lead => [
        lead.id,
        lead.companyName,
        lead.sector,
        lead.contactPerson,
        lead.phone,
        lead.email,
        lead.city,
        lead.country,
        lead.status,
        lead.priority,
        lead.value,
        lead.rating,
        new Date(lead.createdAt).toLocaleDateString('pt-BR'),
        lead.notes.replace(/(\r\n|\n|\r)/gm, " ") // Remove line breaks for CSV safety
    ]);

    const csvContent = [
        headers.join(';'), // Using semicolon for better Excel compatibility in Brazil
        ...rows.map(e => e.map(cell => `"${cell || ''}"`).join(';'))
    ].join('\n');

    downloadCSV(csvContent, filename);
};

export const exportTasksToCSV = (tasks: Task[], leads: Lead[], filename: string) => {
    const headers = ['Título', 'Descrição', 'Cliente', 'Tipo', 'Data', 'Hora', 'Concluído'];
    
    const rows = tasks.map(task => {
        const lead = leads.find(l => l.id === task.leadId);
        const dateObj = new Date(task.dueDate);
        
        return [
            task.title,
            task.description,
            lead ? lead.companyName : 'N/A',
            task.type,
            dateObj.toLocaleDateString('pt-BR'),
            dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            task.completed ? 'Sim' : 'Não'
        ];
    });

    const csvContent = [
        headers.join(';'),
        ...rows.map(e => e.map(cell => `"${cell || ''}"`).join(';'))
    ].join('\n');

    downloadCSV(csvContent, filename);
};

const downloadCSV = (content: string, filename: string) => {
    // Add BOM for Excel to recognize UTF-8 characters properly
    const blob = new Blob(["\ufeff" + content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
