import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, ArrowLeft, Phone, Video, MoreVertical, Paperclip, Smile, Search, Check, CheckCheck, Trash2 } from 'lucide-react';
import { Agent } from '../types';
import { sendChatMessage, ChatMessage } from '../services/geminiService';

interface WhatsAppSimulatorProps {
    agent: Agent;
    onClose: () => void;
}

export const WhatsAppSimulator: React.FC<WhatsAppSimulatorProps> = ({ agent, onClose }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Initial greeting based on agent
    useEffect(() => {
        setMessages([{
            role: 'model',
            text: `Olá! Sou ${agent.name}. ${agent.role === 'Prospector' ? 'Vi que você tem uma frota, como posso ajudar com a manutenção?' : 'Bem-vindo à RR Posto de Molas, como posso ajudar?'}`
        }]);
    }, [agent]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputText.trim()) return;

        const userMsg: ChatMessage = { role: 'user', text: inputText };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsLoading(true);

        try {
            const responseText = await sendChatMessage(
                messages, 
                { text: inputText },
                { 
                    systemInstruction: agent.systemInstruction,
                    temperature: agent.temperature,
                    knowledgeBase: agent.knowledgeBase
                }
            );
            setMessages(prev => [...prev, { role: 'model', text: responseText }]);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !isRecording) handleSendMessage();
    };

    // Audio Logic
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            // Detect supported mime type
            let mimeType = 'audio/webm';
            if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
                mimeType = 'audio/webm;codecs=opus';
            } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
                mimeType = 'audio/mp4';
            }

            const mediaRecorder = new MediaRecorder(stream, { mimeType });
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                // Check if we should actually process (it might have been cancelled)
                if (audioChunksRef.current.length > 0) {
                     // Important: Use the same mimeType for the Blob
                    const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
                    await processAudioMessage(audioBlob, mimeType);
                }
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingTime(0);
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);

        } catch (err) {
            console.error("Mic error:", err);
            alert("Erro no microfone. Verifique se o navegador tem permissão.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerRef.current) clearInterval(timerRef.current);
        }
    };

    const cancelRecording = () => {
         if (mediaRecorderRef.current && isRecording) {
            // Clear chunks to prevent processing in onstop (simple logic check there or here)
            // Ideally we modify onstop logic or just clear the ref before stop
            audioChunksRef.current = []; 
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerRef.current) clearInterval(timerRef.current);
        }
    }

    const processAudioMessage = async (audioBlob: Blob, mimeType: string) => {
        // Double check blob size
        if (audioBlob.size < 100) return; 

        setIsLoading(true);
        // Add a placeholder audio message for UI
        setMessages(prev => [...prev, { role: 'user', text: '🎤 Áudio enviado (' + formatTime(recordingTime) + ')' }]);

        try {
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            reader.onloadend = async () => {
                // Extract base64 part
                const base64String = (reader.result as string).split(',')[1];
                
                const responseText = await sendChatMessage(
                    messages, 
                    { audio: base64String, mimeType: mimeType }, // Pass correct mimeType
                    { 
                        systemInstruction: agent.systemInstruction,
                        temperature: agent.temperature,
                        knowledgeBase: agent.knowledgeBase
                    }
                );
                setMessages(prev => [...prev, { role: 'model', text: responseText }]);
                setIsLoading(false);
            };
        } catch (error) {
            console.error(error);
            setIsLoading(false);
            setMessages(prev => [...prev, { role: 'model', text: "Erro ao processar áudio." }]);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 font-sans">
            <div className="w-full max-w-4xl h-[90vh] bg-[#f0f2f5] shadow-2xl overflow-hidden flex flex-col relative rounded-lg">
                
                {/* Header - Green WhatsApp Style */}
                <div className="bg-[#00a884] h-16 px-4 flex items-center justify-between shadow-sm z-10 shrink-0">
                    <div className="flex items-center gap-3">
                        <button onClick={onClose} className="text-white mr-1 hover:bg-white/10 p-2 rounded-full">
                            <ArrowLeft size={24} />
                        </button>
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                            <div className="bg-white w-full h-full flex items-center justify-center text-gray-500 font-bold text-lg">
                                {agent.name.charAt(0)}
                            </div>
                        </div>
                        <div className="flex flex-col text-white">
                            <span className="font-semibold text-base leading-tight">{agent.name}</span>
                            <span className="text-xs text-gray-100/90">online</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-white">
                        <Video size={20} />
                        <Phone size={20} />
                        <div className="h-6 w-px bg-white/20 mx-1"></div>
                        <Search size={20} />
                        <MoreVertical size={20} />
                    </div>
                </div>

                {/* Chat Area - Beige Background */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#efeae2] relative" style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundRepeat: 'repeat', backgroundSize: '400px' }}>
                     {/* Encryption Notice */}
                    <div className="flex justify-center mb-6">
                        <div className="bg-[#ffeecd] text-[#54656f] text-xs px-3 py-1.5 rounded-lg shadow-sm text-center max-w-md">
                            🔒 As mensagens e as chamadas são protegidas com criptografia de ponta a ponta. Ninguém fora desse bate-papo, nem mesmo o WhatsApp, pode ler ou ouvi-las.
                        </div>
                    </div>

                    <div className="space-y-2 flex flex-col">
                        {messages.map((msg, idx) => (
                            <div 
                                key={idx} 
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`relative max-w-[65%] md:max-w-[50%] px-3 py-1.5 rounded-lg text-sm shadow-sm ${
                                    msg.role === 'user' 
                                    ? 'bg-[#d9fdd3] rounded-tr-none' 
                                    : 'bg-white rounded-tl-none'
                                }`}>
                                    <div className="text-[#111b21] pb-4 leading-relaxed whitespace-pre-wrap">
                                        {msg.text}
                                    </div>
                                    <div className="absolute bottom-1 right-2 text-[10px] text-[#667781] flex items-center gap-1">
                                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        {msg.role === 'user' && <CheckCheck size={14} className="text-[#53bdeb]" />}
                                    </div>
                                </div>
                            </div>
                        ))}
                         {isLoading && (
                             <div className="flex justify-start animate-pulse">
                                <div className="bg-white rounded-lg rounded-tl-none px-4 py-3 shadow-sm">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input Area */}
                <div className="bg-[#f0f2f5] px-4 py-2 flex items-center gap-2 border-t border-gray-200 shrink-0">
                    <button className="text-[#54656f] p-2 hover:bg-gray-200 rounded-full" disabled={isRecording}>
                        <Smile size={24} />
                    </button>
                    <button className="text-[#54656f] p-2 hover:bg-gray-200 rounded-full" disabled={isRecording}>
                        <Paperclip size={24} />
                    </button>
                    
                    <div className="flex-1 bg-white rounded-lg flex items-center px-4 py-2 mx-2">
                        {isRecording ? (
                            <div className="flex-1 flex items-center justify-between">
                                <span className="text-red-500 font-medium animate-pulse flex items-center gap-2">
                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                    Gravando... {formatTime(recordingTime)}
                                </span>
                                <button onClick={cancelRecording} className="text-gray-400 hover:text-red-500 text-xs font-bold uppercase">Cancelar</button>
                            </div>
                        ) : (
                            <input 
                                type="text" 
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Mensagem" 
                                className="flex-1 outline-none text-[#111b21] text-sm placeholder:text-[#54656f]"
                            />
                        )}
                    </div>

                    {inputText.trim() ? (
                         <button 
                            onClick={handleSendMessage}
                            className="text-[#54656f] p-2 hover:bg-gray-200 rounded-full"
                        >
                            <Send size={24} />
                        </button>
                    ) : (
                        <div className="relative">
                            <button 
                                onClick={isRecording ? stopRecording : startRecording}
                                className={`p-2 rounded-full transition-all ${
                                    isRecording 
                                    ? 'bg-[#00a884] text-white shadow-lg scale-110' 
                                    : 'text-[#54656f] hover:bg-gray-200'
                                }`}
                            >
                                {isRecording ? <Send size={24} /> : <Mic size={24} />}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}