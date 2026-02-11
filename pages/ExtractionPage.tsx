import React, { useState } from 'react';
import { Search, MapPin, Globe, Users, Loader2, Plus, Check } from 'lucide-react';
import { searchLeads } from '../services/geminiService';
import { Lead } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface ExtractionPageProps {
  onAddLeads: (leads: Lead[]) => void;
  history: any[];
}

export const ExtractionPage: React.FC<ExtractionPageProps> = ({ onAddLeads, history }) => {
  const [sector, setSector] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [quantity, setQuantity] = useState('10');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Partial<Lead>[]>([]);
  const [addedIndices, setAddedIndices] = useState<number[]>([]);

  const handleSearch = async () => {
    if (!sector || !city || !country) return;
    setLoading(true);
    setResults([]);
    setAddedIndices([]);
    try {
      const leads = await searchLeads(sector, city, country, parseInt(quantity));
      setResults(leads);
    } catch (error) {
      alert("Erro ao buscar leads. Verifique a API Key.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddLead = (index: number) => {
    const rawLead = results[index];
    const newLead: Lead = {
      id: uuidv4(),
      companyName: rawLead.companyName || 'Empresa Desconhecida',
      sector: rawLead.sector || sector,
      city: rawLead.city || city,
      country: rawLead.country || country,
      address: rawLead.address || '',
      phone: rawLead.phone || '',
      email: rawLead.email || '',
      website: rawLead.website || '',
      status: 'New',
      priority: 'Medium',
      value: 0,
      rating: rawLead.rating || 0,
      notes: rawLead.notes || '',
      source: 'Google Maps Extraction',
      contactPerson: '',
      createdAt: new Date().toISOString()
    };

    onAddLeads([newLead]);
    setAddedIndices(prev => [...prev, index]);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Extração de Leads</h1>
        <p className="text-sm md:text-base text-gray-500 mt-1">Busque empresas reais via Google Maps e adicione ao CRM.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Search Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-black p-6 md:p-8 rounded-2xl shadow-xl relative overflow-hidden">
             {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500 rounded-full translate-x-20 -translate-y-20 -z-0 pointer-events-none opacity-20 blur-3xl"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center mb-8">
                <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/20 mb-4 text-black transform rotate-3">
                    <Search size={32} strokeWidth={2.5} />
                </div>
                <h2 className="text-xl font-bold text-white">Nova Busca</h2>
                <p className="text-gray-400 text-sm mt-1 max-w-md">Preencha os dados abaixo para localizar empresas.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 relative z-10">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-wider">Setor / Nicho</label>
                <div className="relative">
                    <Users size={18} className="absolute left-3 top-3.5 text-gray-500" />
                    <input
                    type="text"
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    placeholder="Ex: Transportadoras"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all shadow-sm text-gray-900 placeholder-gray-400 font-medium"
                    />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-wider">Cidade</label>
                <div className="relative">
                    <MapPin size={18} className="absolute left-3 top-3.5 text-gray-500" />
                    <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ex: Londrina"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all shadow-sm text-gray-900 placeholder-gray-400 font-medium"
                    />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-wider">País</label>
                 <div className="relative">
                    <Globe size={18} className="absolute left-3 top-3.5 text-gray-500" />
                    <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Ex: Brasil"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all shadow-sm text-gray-900 placeholder-gray-400 font-medium"
                    />
                 </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-wider">Quantidade</label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all shadow-sm text-gray-900 font-medium"
                >
                  <option value="5">5 leads</option>
                  <option value="10">10 leads</option>
                  <option value="20">20 leads</option>
                </select>
              </div>
            </div>

            <div className="mt-8 flex justify-center relative z-10">
              <button
                onClick={handleSearch}
                disabled={loading}
                className="w-full md:w-auto bg-yellow-500 hover:bg-yellow-400 text-black font-black py-4 px-10 rounded-lg shadow-lg shadow-yellow-900/40 transition-all transform active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2 text-lg uppercase tracking-wide"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Search size={22} strokeWidth={3} />}
                {loading ? 'BUSCANDO NO MAPS...' : 'EXTRAIR LEADS'}
              </button>
            </div>
          </div>

          {/* Results List */}
          {results.length > 0 && (
            <div className="space-y-4 animate-fade-in-up">
                <div className="flex justify-between items-end border-b border-gray-200 pb-2">
                    <h3 className="font-bold text-lg text-gray-800">Resultados da Busca</h3>
                    <span className="text-sm text-gray-500">{results.length} empresas encontradas</span>
                </div>
                
                {results.map((lead, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between hover:shadow-md transition-all hover:border-yellow-400 group gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-bold text-gray-900 text-lg group-hover:text-yellow-600 transition-colors">{lead.companyName}</h4>
                                {lead.rating && lead.rating > 0 && (
                                    <span className="bg-yellow-100 text-yellow-800 text-[10px] px-1.5 py-0.5 rounded font-bold">★ {lead.rating}</span>
                                )}
                            </div>
                            <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                                <MapPin size={14} className="text-gray-400 flex-shrink-0" /> <span className="truncate">{lead.address}</span>
                            </p>
                            <p className="text-sm text-gray-500 mt-1 font-medium">{lead.phone}</p>
                        </div>
                        <button 
                            onClick={() => handleAddLead(idx)}
                            disabled={addedIndices.includes(idx)}
                            className={`p-3 rounded-xl transition-all font-bold flex items-center justify-center gap-2 w-full md:w-auto ${
                                addedIndices.includes(idx) 
                                ? 'bg-green-100 text-green-700 cursor-default' 
                                : 'bg-black text-white hover:bg-yellow-500 hover:text-black shadow-md'
                            }`}
                        >
                            {addedIndices.includes(idx) ? (
                                <>
                                    <Check size={20} strokeWidth={3} /> Adicionado
                                </>
                            ) : (
                                <>
                                    <Plus size={20} strokeWidth={3} /> Adicionar
                                </>
                            )}
                        </button>
                    </div>
                ))}
            </div>
          )}
        </div>

        {/* History Sidebar */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-fit sticky top-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-gray-900">Histórico Recente</h3>
            <span className="text-xs bg-black text-yellow-500 px-2 py-1 rounded-md font-bold">{history.length}</span>
          </div>

          <div className="space-y-5">
            {history.map((item) => (
              <div key={item.id} className="group relative pl-4 border-l-2 border-yellow-400 hover:border-black transition-colors py-1">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-bold text-gray-800 text-sm">{item.sector}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <MapPin size={10} /> {item.location}
                        </p>
                    </div>
                    <span className="bg-gray-100 text-gray-700 text-[10px] px-2 py-1 rounded font-bold uppercase">{item.count} leads</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] text-gray-400 uppercase tracking-wide">
                    <span>{item.date}</span>
                </div>
              </div>
            ))}
            {history.length === 0 && (
                <div className="text-center py-8 text-gray-400 text-sm">
                    Nenhum histórico.
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};