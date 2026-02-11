import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { ExtractionPage } from './pages/ExtractionPage';
import { CRMPage } from './pages/CRMPage';
import { TasksPage } from './pages/TasksPage';
import { AgendaPage } from './pages/AgendaPage';
import { ClientsPage } from './pages/ClientsPage';
import { DashboardPage } from './pages/DashboardPage';
import { AgentsPage } from './pages/AgentsPage';
import { LeadDetailModal } from './components/LeadDetailModal';
import { Auth } from './components/Auth';
import { Lead, Task, ExtractionHistory, LeadStatus, Agent, UserProfile } from './types';
import { Menu, Loader2 } from 'lucide-react';
import { supabase } from './services/supabaseClient';
import * as dataService from './services/dataService';
import { Session } from '@supabase/supabase-js';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [history, setHistory] = useState<ExtractionHistory[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Auth State Listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch Data on Session Change
  useEffect(() => {
    if (session) {
      loadAllData();
    }
  }, [session]);

  const loadAllData = async () => {
    if (!session) return;
    try {
      setLoading(true);
      const [leadsData, tasksData, historyData, agentsData, profileData] = await Promise.all([
        dataService.getLeads(),
        dataService.getTasks(),
        dataService.getHistory(),
        dataService.getAgents(),
        dataService.getProfile(session.user.id)
      ]);
      setLeads(leadsData);
      setTasks(tasksData);
      setHistory(historyData);
      setAgents(agentsData);

      if (profileData) {
        setUserProfile(profileData);
      } else {
        // Fallback or create if missing (though Auth.tsx handles it now)
        const fallback = { id: session.user.id, fullName: session.user.email?.split('@')[0] || 'Usuário' };
        setUserProfile(fallback);
      }
    } catch (e) {
      console.error("Error loading data", e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLeads = async (newLeads: Lead[]) => {
    try {
      const createdLeads = await dataService.createLeads(newLeads);
      setLeads(prev => [...createdLeads, ...prev]);

      if (createdLeads.length > 0) {
        const first = createdLeads[0];
        const historyItem = await dataService.createHistory({
          id: '', // Will be set by DB
          date: new Date().toISOString(),
          sector: first.sector,
          location: `${first.city}, ${first.country}`,
          count: createdLeads.length
        });
        setHistory(prev => [historyItem, ...prev]);
      }
    } catch (e) {
      console.error("Error adding leads", e);
    }
  };

  const handleAddSingleLead = async (newLead: Lead) => {
    try {
      const created = await dataService.createLead(newLead);
      setLeads(prev => [created, ...prev]);
    } catch (e) {
      console.error("Error adding lead", e);
    }
  };

  const handleUpdateLead = async (updatedLead: Lead) => {
    try {
      const updated = await dataService.updateLead(updatedLead);
      setLeads(prev => prev.map(l => l.id === updated.id ? updated : l));
      // Also update tasks if lead info is cached there (not currently the case)
    } catch (e) {
      console.error("Error updating lead", e);
    }
  };

  const handleLeadMove = async (leadId: string, newStatus: LeadStatus) => {
    const lead = leads.find(l => l.id === leadId);
    if (lead) {
      try {
        const updated = await dataService.updateLead({ ...lead, status: newStatus });
        setLeads(prev => prev.map(l => l.id === leadId ? updated : l));
      } catch (e) {
        console.error("Error moving lead", e);
      }
    }
  };

  const handleDeleteLead = async (id: string) => {
    try {
      await dataService.deleteLead(id);
      setLeads(prev => prev.filter(l => l.id !== id));
      setSelectedLead(null);
    } catch (e) {
      console.error("Error deleting lead", e);
    }
  };

  const handleAddTask = async (task: Task) => {
    try {
      const created = await dataService.createTask(task);
      setTasks(prev => [...prev, created]);
    } catch (e) {
      console.error("Error adding task", e);
    }
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      const updated = await dataService.updateTask(updatedTask);
      setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
    } catch (e) {
      console.error("Error updating task", e);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await dataService.deleteTask(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (e) {
      console.error("Error deleting task", e);
    }
  };

  const handleToggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      try {
        const updated = await dataService.updateTask({ ...task, completed: !task.completed });
        setTasks(prev => prev.map(t => t.id === id ? updated : t));
      } catch (e) {
        console.error("Error toggling task", e);
      }
    }
  };

  const handleAddAgent = async (agent: Agent) => {
    try {
      const created = await dataService.createAgent(agent);
      setAgents(prev => [...prev, created]);
    } catch (e) {
      console.error("Error adding agent", e);
    }
  };

  const handleUpdateAgent = async (updatedAgent: Agent) => {
    try {
      const updated = await dataService.updateAgent(updatedAgent);
      setAgents(prev => prev.map(a => a.id === updated.id ? updated : a));
    } catch (e) {
      console.error("Error updating agent", e);
    }
  };

  const handleDeleteAgent = async (id: string) => {
    try {
      await dataService.deleteAgent(id);
      setAgents(prev => prev.filter(a => a.id !== id));
    } catch (e) {
      console.error("Error deleting agent", e);
    }
  };

  const handleUpdateProfile = async (profile: UserProfile) => {
    try {
      const updated = await dataService.updateProfile(profile);
      setUserProfile(updated);
    } catch (e) {
      console.error("Error updating profile", e);
    }
  };

  const clients = leads.filter(l => l.status === 'Closed');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <Loader2 className="animate-spin text-yellow-500" size={48} />
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <Router>
      <div className="flex bg-[#f8fafc] min-h-screen font-sans text-slate-800 relative overflow-x-hidden w-full">
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          profile={userProfile}
          onUpdateProfile={handleUpdateProfile}
        />

        <main className="flex-1 md:pl-64 relative bg-[#f8fafc] flex flex-col transition-all duration-300 min-w-0 h-screen overflow-hidden">
          <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center text-black font-black italic border border-white shadow-sm">PM</div>
              <span className="font-bold text-gray-900">Posto de Molas CRM</span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg active:scale-95 transition-all"
            >
              <Menu size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-x-hidden">
            <Routes>
              <Route path="/" element={<DashboardPage leads={leads} tasks={tasks} />} />
              <Route
                path="/extraction"
                element={<ExtractionPage onAddLeads={handleAddLeads} history={history} />}
              />
              <Route
                path="/crm"
                element={<CRMPage leads={leads} onLeadClick={setSelectedLead} onLeadMove={handleLeadMove} onAddLead={handleAddSingleLead} />}
              />
              <Route
                path="/tasks"
                element={<TasksPage tasks={tasks} leads={leads} onAddTask={handleAddTask} onUpdateTask={handleUpdateTask} onDeleteTask={handleDeleteTask} onToggleTask={handleToggleTask} />}
              />
              <Route
                path="/agenda"
                element={<AgendaPage tasks={tasks} leads={leads} onAddTask={handleAddTask} onUpdateTask={handleUpdateTask} onDeleteTask={handleDeleteTask} />}
              />
              <Route
                path="/clients"
                element={<ClientsPage clients={clients} onAddClient={handleAddSingleLead} />}
              />
              <Route
                path="/agents"
                element={<AgentsPage agents={agents} onAddAgent={handleAddAgent} onUpdateAgent={handleUpdateAgent} onDeleteAgent={handleDeleteAgent} />}
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>

        {selectedLead && (
          <LeadDetailModal
            lead={selectedLead}
            onClose={() => setSelectedLead(null)}
            onSave={handleUpdateLead}
            onDelete={handleDeleteLead}
          />
        )}
      </div>
    </Router>
  );
}