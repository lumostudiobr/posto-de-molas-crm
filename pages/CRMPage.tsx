import React, { useState } from 'react';
import { Search, MapPin, Phone, MessageCircle, Calendar, Download } from 'lucide-react';
import { Lead, LeadStatus } from '../types';
import { NewLeadModal } from '../components/NewLeadModal';
import { exportLeadsToCSV } from '../utils/csvExport';

interface CRMPageProps {
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
  onLeadMove: (leadId: string, newStatus: LeadStatus) => void;
  onAddLead: (lead: Lead) => void;
}

const CRMColumn: React.FC<{
  title: string;
  status: LeadStatus;
  leads: Lead[];
  color: string;
  borderColor: string;
  onCardClick: (lead: Lead) => void;
  onDrop: (e: React.DragEvent, status: LeadStatus) => void;
}> = ({ title, status, leads, color, borderColor, onCardClick, onDrop }) => {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    onDrop(e, status);
  };

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData("leadId", leadId);
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      className={`flex flex-col h-full w-80 flex-shrink-0 transition-colors rounded-xl ${isOver ? 'bg-gray-100 ring-2 ring-yellow-400' : 'bg-transparent'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className={`flex items-center justify-between mb-4 px-3 py-2 border-l-4 ${borderColor} bg-white rounded-r-lg shadow-sm`}>
        <h3 className="font-bold text-gray-800 uppercase tracking-tight text-sm">{title}</h3>
        <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full font-bold">
          {leads.length}
        </span>
      </div>

      <div className="flex-1 p-2 space-y-3 overflow-y-auto min-h-[200px] scrollbar-hide pb-20 md:pb-0">
        {leads.map((lead) => (
          <div
            key={lead.id}
            draggable
            onDragStart={(e) => handleDragStart(e, lead.id)}
            onClick={() => onCardClick(lead)}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing hover:shadow-lg hover:border-yellow-400 transition-all group relative"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="w-10 h-10 rounded-lg bg-black text-yellow-500 flex items-center justify-center font-bold text-lg shadow-sm">
                {lead.companyName.charAt(0)}
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide border ${lead.priority === 'High' ? 'bg-red-50 text-red-600 border-red-100' :
                lead.priority === 'Medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                  'bg-green-50 text-green-700 border-green-100'
                }`}>
                {lead.priority === 'High' ? 'Alta' : lead.priority === 'Medium' ? 'Média' : 'Baixa'}
              </span>
            </div>

            <h4 className="font-bold text-gray-900 text-sm mb-1 truncate leading-tight">{lead.companyName}</h4>
            <p className="text-xs text-gray-500 mb-3 truncate">{lead.sector}</p>

            <div className="flex items-center gap-2 text-xs text-gray-400 mb-4 bg-gray-50 p-1.5 rounded-md">
              <MapPin size={12} className="text-gray-400" />
              <span className="truncate">{lead.city}</span>
            </div>

            <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-100">
              <div className="text-[10px] text-gray-400 flex items-center gap-1 font-medium">
                <Calendar size={10} /> {new Date(lead.createdAt).toLocaleDateString()}
              </div>
              <div className="flex gap-1">
                <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                  <MessageCircle size={12} />
                </div>
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Phone size={12} />
                </div>
              </div>
            </div>
          </div>
        ))}
        {leads.length === 0 && (
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center opacity-60">
            <p className="text-gray-400 text-xs font-medium">Vazio</p>
          </div>
        )}
      </div>
    </div>
  );
};


export const CRMPage: React.FC<CRMPageProps> = ({ leads, onLeadClick, onLeadMove, onAddLead }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDrop = (e: React.DragEvent, status: LeadStatus) => {
    const leadId = e.dataTransfer.getData("leadId");
    if (leadId) {
      onLeadMove(leadId, status);
    }
  };

  const filteredLeads = leads.filter(l =>
    l.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.sector.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8 bg-[#f8fafc] overflow-hidden">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-6 gap-4">
        <div className="flex-shrink-0">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Pipeline de Vendas</h1>
          <p className="text-sm md:text-base text-gray-500 mt-1 font-medium">Gerencie o fluxo de negociações</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto">
          <div className="relative group flex-1 xl:w-72">
            <Search className="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-yellow-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Buscar leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 bg-white rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all shadow-sm text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => exportLeadsToCSV(filteredLeads, 'CRM_Leads')}
              className="flex-1 sm:flex-none bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg font-bold transition-all shadow-sm text-sm flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Download size={18} /> <span className="hidden xl:inline">Exportar</span>
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 sm:flex-none bg-black hover:bg-gray-800 text-yellow-500 px-5 py-2 rounded-lg font-bold transition-all shadow-lg shadow-gray-200 text-sm flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <span className="text-lg">+</span> Novo Lead
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex gap-6 h-full min-w-max">
          <CRMColumn
            title="Novos Leads"
            status="New"
            leads={filteredLeads.filter(l => l.status === 'New')}
            color="bg-blue-500"
            borderColor="border-blue-500"
            onCardClick={onLeadClick}
            onDrop={handleDrop}
          />
          <CRMColumn
            title="Em Contato"
            status="Contacted"
            leads={filteredLeads.filter(l => l.status === 'Contacted')}
            color="bg-yellow-500"
            borderColor="border-yellow-500"
            onCardClick={onLeadClick}
            onDrop={handleDrop}
          />
          <CRMColumn
            title="Proposta Enviada"
            status="Proposal"
            leads={filteredLeads.filter(l => l.status === 'Proposal')}
            color="bg-purple-500"
            borderColor="border-purple-500"
            onCardClick={onLeadClick}
            onDrop={handleDrop}
          />
          <CRMColumn
            title="Fechados"
            status="Closed"
            leads={filteredLeads.filter(l => l.status === 'Closed')}
            color="bg-green-500"
            borderColor="border-green-500"
            onCardClick={onLeadClick}
            onDrop={handleDrop}
          />
          <CRMColumn
            title="Perdidos"
            status="Lost"
            leads={filteredLeads.filter(l => l.status === 'Lost')}
            color="bg-red-500"
            borderColor="border-red-500"
            onCardClick={onLeadClick}
            onDrop={handleDrop}
          />
        </div>
      </div>

      <NewLeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={onAddLead}
      />
    </div>
  );
};