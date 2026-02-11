import { supabase } from './supabaseClient';
import { Lead, Task, ExtractionHistory, Agent, LeadStatus, UserProfile } from '../types';

// Helper to handle Supabase errors
const handleError = (error: any) => {
    if (error) {
        console.error('Supabase Error:', error.message);
        throw error;
    }
};

// --- LEADS ---

export const getLeads = async (): Promise<Lead[]> => {
    const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

    handleError(error);
    return (data || []).map(mapLeadFromDb);
};

export const createLead = async (lead: Lead): Promise<Lead> => {
    const dbLead = mapLeadToDb(lead);
    const { data, error } = await supabase
        .from('leads')
        .insert([dbLead])
        .select()
        .single();

    handleError(error);
    return mapLeadFromDb(data);
};

export const createLeads = async (leads: Lead[]): Promise<Lead[]> => {
    const dbLeads = leads.map(mapLeadToDb);
    const { data, error } = await supabase
        .from('leads')
        .insert(dbLeads)
        .select();

    handleError(error);
    return (data || []).map(mapLeadFromDb);
};

export const updateLead = async (lead: Lead): Promise<Lead> => {
    const dbLead = mapLeadToDb(lead);
    const { data, error } = await supabase
        .from('leads')
        .update(dbLead)
        .eq('id', lead.id)
        .select()
        .single();

    handleError(error);
    return mapLeadFromDb(data);
};

export const deleteLead = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);

    handleError(error);
};

// --- TASKS ---

export const getTasks = async (): Promise<Task[]> => {
    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('due_date', { ascending: true });

    handleError(error);
    return (data || []).map(mapTaskFromDb);
};

export const createTask = async (task: Task): Promise<Task> => {
    const dbTask = mapTaskToDb(task);
    const { data, error } = await supabase
        .from('tasks')
        .insert([dbTask])
        .select()
        .single();

    handleError(error);
    return mapTaskFromDb(data);
};

export const updateTask = async (task: Task): Promise<Task> => {
    const dbTask = mapTaskToDb(task);
    const { data, error } = await supabase
        .from('tasks')
        .update(dbTask)
        .eq('id', task.id)
        .select()
        .single();

    handleError(error);
    return mapTaskFromDb(data);
};

export const deleteTask = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

    handleError(error);
};

// --- EXTRACTION HISTORY ---

export const getHistory = async (): Promise<ExtractionHistory[]> => {
    const { data, error } = await supabase
        .from('extraction_history')
        .select('*')
        .order('date', { ascending: false });

    handleError(error);
    return (data || []).map(mapHistoryFromDb);
};

export const createHistory = async (item: ExtractionHistory): Promise<ExtractionHistory> => {
    const dbItem = {
        date: item.date,
        sector: item.sector,
        location: item.location,
        count: item.count
    };
    const { data, error } = await supabase
        .from('extraction_history')
        .insert([dbItem])
        .select()
        .single();

    handleError(error);
    return mapHistoryFromDb(data);
};

// --- AGENTS ---

export const getAgents = async (): Promise<Agent[]> => {
    const { data, error } = await supabase
        .from('agents')
        .select('*');

    handleError(error);
    return (data || []).map(mapAgentFromDb);
};

export const createAgent = async (agent: Agent): Promise<Agent> => {
    const dbAgent = mapAgentToDb(agent);
    const { data, error } = await supabase
        .from('agents')
        .insert([dbAgent])
        .select()
        .single();

    handleError(error);
    return mapAgentFromDb(data);
};

export const updateAgent = async (agent: Agent): Promise<Agent> => {
    const dbAgent = mapAgentToDb(agent);
    const { data, error } = await supabase
        .from('agents')
        .update(dbAgent)
        .eq('id', agent.id)
        .select()
        .single();

    handleError(error);
    return mapAgentFromDb(data);
};

export const deleteAgent = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from('agents')
        .delete()
        .eq('id', id);

    handleError(error);
};

// --- MAPPING HELPERS ---

const mapLeadFromDb = (db: any): Lead => ({
    id: db.id,
    companyName: db.company_name,
    sector: db.sector,
    contactPerson: db.contact_person,
    address: db.address,
    city: db.city,
    country: db.country,
    phone: db.phone,
    email: db.email,
    website: db.website,
    status: db.status as LeadStatus,
    priority: db.priority as any,
    value: Number(db.value),
    rating: db.rating,
    notes: db.notes,
    source: db.source,
    createdAt: db.created_at,
    lastContact: db.last_contact
});

const mapLeadToDb = (lead: Lead) => ({
    company_name: lead.companyName,
    sector: lead.sector,
    contact_person: lead.contactPerson,
    address: lead.address,
    city: lead.city,
    country: lead.country,
    phone: lead.phone,
    email: lead.email,
    website: lead.website,
    status: lead.status,
    priority: lead.priority,
    value: lead.value,
    rating: lead.rating,
    notes: lead.notes,
    source: lead.source,
    last_contact: lead.lastContact || null
});

const mapTaskFromDb = (db: any): Task => ({
    id: db.id,
    leadId: db.lead_id,
    title: db.title,
    description: db.description,
    dueDate: db.due_date,
    completed: db.completed,
    type: db.type as any
});

const mapTaskToDb = (task: Task) => ({
    lead_id: task.leadId || null,
    title: task.title,
    description: task.description,
    due_date: task.dueDate,
    completed: task.completed,
    type: task.type
});

const mapHistoryFromDb = (db: any): ExtractionHistory => ({
    id: db.id,
    date: db.date,
    sector: db.sector,
    location: db.location,
    count: db.count
});

const mapAgentFromDb = (db: any): Agent => ({
    id: db.id,
    name: db.name,
    role: db.role as any,
    whatsappNumber: db.whatsapp_number,
    isActive: db.is_active,
    temperature: Number(db.temperature),
    tone: db.tone,
    systemInstruction: db.system_instruction,
    knowledgeBase: db.knowledge_base,
    whatsappConfig: db.whatsapp_config
});

const mapAgentToDb = (agent: Agent) => ({
    name: agent.name,
    role: agent.role,
    whatsapp_number: agent.whatsappNumber,
    is_active: agent.isActive,
    temperature: agent.temperature,
    tone: agent.tone,
    system_instruction: agent.systemInstruction,
    knowledge_base: agent.knowledgeBase,
    whatsapp_config: agent.whatsappConfig
});

// --- PROFILES ---

const mapProfileFromDb = (db: any): UserProfile => ({
    id: db.id,
    fullName: db.full_name,
    avatarUrl: db.avatar_url,
    updatedAt: db.updated_at
});

const mapProfileToDb = (profile: UserProfile) => ({
    full_name: profile.fullName,
    avatar_url: profile.avatarUrl,
    updated_at: new Date().toISOString()
});

export const getProfile = async (id: string): Promise<UserProfile | null> => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        handleError(error);
    }
    return data ? mapProfileFromDb(data) : null;
};

export const updateProfile = async (profile: UserProfile): Promise<UserProfile> => {
    const dbProfile = mapProfileToDb(profile);
    const { data, error } = await supabase
        .from('profiles')
        .upsert({ id: profile.id, ...dbProfile })
        .select()
        .single();

    handleError(error);
    return mapProfileFromDb(data);
};
