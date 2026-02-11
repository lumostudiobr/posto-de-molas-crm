import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Search, Users, CheckSquare, Calendar, Briefcase, MessageSquare, X, LogOut, Settings, User, Save, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { UserProfile } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile | null;
  onUpdateProfile: (profile: UserProfile) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, profile, onUpdateProfile }) => {
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [editData, setEditData] = React.useState({ fullName: '', avatarUrl: '' });

  React.useEffect(() => {
    if (profile) {
      setEditData({ fullName: profile.fullName, avatarUrl: profile.avatarUrl || '' });
    }
  }, [profile]);

  const navItems = [
    { name: 'Painel de Controle', icon: LayoutDashboard, path: '/' },
    { name: 'Extrair Leads', icon: Search, path: '/extraction' },
    { name: 'CRM', icon: Users, path: '/crm' },
    { name: 'Tarefas', icon: CheckSquare, path: '/tasks' },
    { name: 'Agenda', icon: Calendar, path: '/agenda' },
    { name: 'Clientes', icon: Briefcase, path: '/clients' },
    { name: 'Agentes WhatsApp', icon: MessageSquare, path: '/agents' },
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile) {
      onUpdateProfile({ ...profile, fullName: editData.fullName, avatarUrl: editData.avatarUrl });
      setIsEditModalOpen(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <>
      <aside
        className={`w-64 bg-white h-screen fixed left-0 top-0 border-r border-gray-200 flex flex-col z-40 font-inter transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0`}
      >
        <div className="p-6 flex items-center justify-between bg-black">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500 rounded-md flex items-center justify-center text-black font-black italic text-xl tracking-tighter transform -skew-x-12 border-2 border-white">PM</div>
            <div className="flex flex-col justify-center">
              <span className="text-sm font-bold tracking-tight text-white leading-none">POSTO DE MOLAS</span>
              <span className="text-xs font-semibold text-yellow-500 tracking-wide leading-none uppercase mt-0.5">CRM</span>
            </div>
          </div>
          {/* Close button for mobile only */}
          <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 bg-white overflow-y-auto">
          <div className="px-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Menu Principal</div>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 768) {
                  onClose();
                }
              }}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-bold transition-all ${isActive
                  ? 'bg-black text-yellow-500 shadow-lg shadow-gray-200 translate-x-1'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-black'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  {item.name}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 bg-gray-50 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-500 text-black border-2 border-black flex items-center justify-center font-bold shadow-sm overflow-hidden">
                {profile?.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  getInitials(profile?.fullName || 'AD')
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">
                  {profile?.fullName || 'Admin'}
                </p>
                <p className="text-xs text-gray-500 font-medium truncate">Painel</p>
              </div>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-200 rounded-lg transition-all"
                title="Perfil"
              >
                <Settings size={18} />
              </button>
              <button
                onClick={() => supabase.auth.signOut()}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                title="Sair"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Profile Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-black text-white">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <User size={20} className="text-yellow-500" />
                Meu Perfil
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    required
                    type="text"
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                    value={editData.fullName}
                    onChange={e => setEditData({ ...editData, fullName: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">URL da Imagem</label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="url"
                    placeholder="https://exemplo.com/foto.jpg"
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                    value={editData.avatarUrl}
                    onChange={e => setEditData({ ...editData, avatarUrl: e.target.value })}
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1 ml-1">Insira um link para sua foto de perfil.</p>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-2 bg-black text-yellow-500 font-bold rounded-xl hover:bg-gray-800 shadow-lg flex items-center justify-center gap-2 transition-all"
                >
                  <Save size={18} /> Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};