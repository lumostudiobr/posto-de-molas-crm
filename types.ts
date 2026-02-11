

export type LeadStatus = 'New' | 'Contacted' | 'Proposal' | 'Closed' | 'Lost';

export type LeadPriority = 'Low' | 'Medium' | 'High';

export interface Lead {
  id: string;
  companyName: string;
  sector: string;
  contactPerson: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  status: LeadStatus;
  priority: LeadPriority;
  value: number;
  rating: number; // 1-5
  notes: string;
  source: string;
  createdAt: string;
  lastContact?: string;
}

export interface Task {
  id: string;
  leadId: string;
  title: string;
  description: string;
  dueDate: string; // ISO date string
  completed: boolean;
  type: 'Message' | 'Call' | 'Meeting' | 'Email';
}

export interface ExtractionHistory {
  id: string;
  date: string;
  sector: string;
  location: string;
  count: number;
}

export type AgentRole = 'Prospector' | 'CustomerSupport';

export interface WhatsappConfig {
  provider: 'EvolutionAPI' | 'Z-API' | 'WppConnect';
  baseUrl: string;
  instanceName: string;
  apiKey: string;
  isEnabled: boolean;
}

export interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  whatsappNumber: string;
  isActive: boolean;
  // AI Configuration
  temperature: number; // 0.0 to 1.0 (Creativity vs Precision)
  tone: string; // e.g., 'Professional', 'Friendly', 'Aggressive'
  systemInstruction: string; // The "Brain" / Main Prompt
  knowledgeBase: string; // Context about the company
  whatsappConfig: WhatsappConfig; // API Configuration
}

export interface UserProfile {
  id: string;
  fullName: string;
  avatarUrl?: string;
  updatedAt?: string;
}
