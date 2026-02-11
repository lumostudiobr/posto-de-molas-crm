import { GoogleGenAI } from "@google/genai";
import { Lead } from "../types";

const getClient = () => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) throw new Error("API Key not found. Please set VITE_GEMINI_API_KEY in your .env.local or Vercel environment variables.");
    return new GoogleGenAI({ apiKey });
};

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
    audio?: string; // Base64 audio string
}

export const searchLeads = async (sector: string, city: string, country: string, quantity: number): Promise<Partial<Lead>[]> => {
    try {
        const ai = getClient();

        // Strategy 1: Attempt with Google Maps Tool
        try {
            const prompt = `
                Find ${quantity} REAL companies in the '${sector}' sector in '${city}, ${country}'.
                
                For each company, retrieve:
                - Name
                - Full Address
                - Phone Number
                - Website
                - Rating
                
                CRITICAL: Output the result strictly as a valid JSON array inside a \`\`\`json\`\`\` code block.
                The JSON object keys must be: companyName, address, phone, website, rating, notes.
            `;

            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: prompt,
                config: {
                    tools: [{ googleMaps: {} }],
                }
            });

            const parsed = parseResponse(response.text);
            if (parsed && parsed.length > 0) {
                return mapToLeads(parsed, sector, city, country, "Google Maps");
            }
        } catch (e) {
            console.warn("Maps extraction failed or returned empty, switching to generative fallback...", e);
        }

        // Strategy 2: Generative Fallback
        const fallbackPrompt = `
            Generate a list of ${quantity} realistic representative leads for the '${sector}' sector in '${city}, ${country}'.
            Include realistic company names, addresses, and phone numbers for that region.
            
            Output strictly as a JSON array with keys: companyName, address, phone, website, rating, notes.
        `;

        const fallbackResponse = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: fallbackPrompt,
            config: {
                responseMimeType: "application/json"
            }
        });

        const fallbackParsed = JSON.parse(fallbackResponse.text || "[]");
        return mapToLeads(fallbackParsed, sector, city, country, "AI Generated (Fallback)");

    } catch (error) {
        console.error("Error searching leads:", error);
        throw error;
    }
};

// Helper to extract JSON from potentially markdown-wrapped text
const parseResponse = (text: string | undefined): any[] | null => {
    if (!text) return null;
    try {
        // Try direct parse
        return JSON.parse(text);
    } catch {
        // Try regex extract
        const match = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (match) {
            try {
                return JSON.parse(match[1] || match[0]);
            } catch (e) {
                return null;
            }
        }
        return null;
    }
}

const mapToLeads = (data: any[], sector: string, city: string, country: string, source: string): Partial<Lead>[] => {
    return data.map((item: any) => ({
        companyName: item.companyName || "Empresa Desconhecida",
        address: item.address || `${city}, ${country}`,
        phone: item.phone || "",
        website: item.website || "",
        rating: item.rating || 0,
        notes: item.notes || `Empresa identificada no setor de ${sector}`,
        sector: sector,
        city: city,
        country: country,
        source: source
    }));
}

export const generateLeadMessage = async (lead: Lead): Promise<string> => {
    try {
        const ai = getClient();
        const prompt = `
            Escreva uma mensagem de abordagem comercial curta e direta para WhatsApp (Português Brasil).
            Remetente: "RR Posto de Molas".
            Destinatário: "${lead.companyName}" (Setor: ${lead.sector}).
            Objetivo: Oferecer serviços de manutenção e peças.
            Tom: Profissional mas próximo. Máximo 30 palavras.
        `;
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt
        });
        return response.text || `Olá ${lead.companyName}, somos da RR Posto de Molas e gostaríamos de apresentar nossos serviços.`;
    } catch (e) {
        return `Olá ${lead.companyName}, somos da RR Posto de Molas e gostaríamos de apresentar nossos serviços.`;
    }
}

interface AgentConfig {
    systemInstruction: string;
    temperature: number;
    knowledgeBase?: string;
}

export const sendChatMessage = async (
    history: ChatMessage[],
    newContent: { text?: string, audio?: string, mimeType?: string },
    config?: AgentConfig
): Promise<string> => {
    const ai = getClient();

    // Default fallback instruction if none provided
    const defaultInstruction = `
        Você é o **Atendente Virtual da RR Posto de Molas**.
        Sua função é realizar o pré-atendimento de clientes que entram em contato.
        
        **SEU OBJETIVO:**
        Coletar as seguintes informações do cliente, de forma natural e conversada (não peça tudo de uma vez):
        1. Nome da pessoa.
        2. Cidade de onde fala.
        3. Qual o veículo (Caminhão, Ônibus, Utilitário) e Modelo.
        4. O que aconteceu (Problema na mola, suspensão, freio, etc).
        
        Após coletar essas informações, **AGENDAR UMA VISITA** para avaliação técnica. Sugira horários comerciais (Seg-Sex, 08h-18h).
        
        **DIRETRIZES:**
        - Seja educado, prestativo e profissional.
        - Se o usuário mandar áudio, transcreva mentalmente e responda em texto.
        - Mantenha as respostas curtas (estilo WhatsApp).
        - Use emojis moderadamente.
        - Se o cliente perguntar preço exato, diga que precisa avaliar o veículo pessoalmente para passar um orçamento justo.
    `;

    // Combine Knowledge Base with System Instruction if provided
    let finalInstruction = config?.systemInstruction || defaultInstruction;
    if (config?.knowledgeBase) {
        finalInstruction += `\n\n**BASE DE CONHECIMENTO (Informações Importantes):**\n${config.knowledgeBase}`;
    }

    // Format history for the API
    const contents = history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
    }));

    // Add the new user message
    const newParts: any[] = [];
    if (newContent.text) {
        newParts.push({ text: newContent.text });
    }
    if (newContent.audio) {
        newParts.push({
            inlineData: {
                // Use provided mimeType or default to webm (common for browsers)
                mimeType: newContent.mimeType || "audio/webm",
                data: newContent.audio
            }
        });
    }

    contents.push({
        role: 'user',
        parts: newParts
    });

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: contents,
            config: {
                systemInstruction: finalInstruction,
                temperature: config?.temperature ?? 0.4,
            }
        });

        return response.text || "Desculpe, não consegui entender. Poderia repetir?";
    } catch (error) {
        console.error("Chat Error:", error);
        return "Desculpe, estou com dificuldades técnicas no momento. Tente enviar texto.";
    }
};