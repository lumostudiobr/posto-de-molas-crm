import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Mic, Loader2, Bot, User } from 'lucide-react';
import { sendChatMessage, ChatMessage } from '../services/geminiService';

export const ChatWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'model', text: 'Olá! Bem-vindo à RR Posto de Molas. Sou seu assistente virtual. Como posso ajudar com seu veículo hoje?' }
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSendMessage = async () => {
        if (!inputText.trim()) return;

        const userMsg: ChatMessage = { role: 'user', text: inputText };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsLoading(true);

        try {
            const responseText = await sendChatMessage(messages, { text: inputText });
            setMessages(prev => [...prev, { role: 'model', text: responseText }]);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSendMessage();
    };

    // Audio Recording Logic
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' }); // or audio/webm
                await processAudioMessage(audioBlob);
                
                // Stop all tracks to release microphone
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Não foi possível acessar o microfone. Verifique as permissões.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const processAudioMessage = async (audioBlob: Blob) => {
        setIsLoading(true);
        // Visual feedback for audio message
        setMessages(prev => [...prev, { role: 'user', text: '🎤 Mensagem de áudio enviada...' }]);

        try {
            // Convert Blob to Base64
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            reader.onloadend = async () => {
                const base64String = (reader.result as string).split(',')[1];
                
                const responseText = await sendChatMessage(messages, { audio: base64String });
                setMessages(prev => [...prev, { role: 'model', text: responseText }]);
                setIsLoading(false);
            };
        } catch (error) {
            console.error("Error processing audio:", error);
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-inter flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white rounded-2xl shadow-2xl w-[350px] h-[500px] mb-4 flex flex-col border border-gray-200 overflow-hidden animate-fade-in-up">
                    {/* Header */}
                    <div className="bg-black p-4 flex items-center justify-between text-white">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-black relative">
                                <Bot size={24} />
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-black rounded-full"></span>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Atendimento RR</h3>
                                <p className="text-[10px] text-gray-300">Responde instantaneamente</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div 
                                    className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
                                        msg.role === 'user' 
                                        ? 'bg-black text-white rounded-br-none' 
                                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                                    }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                             <div className="flex justify-start">
                                <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-gray-200 shadow-sm flex items-center gap-2">
                                    <Loader2 size={16} className="animate-spin text-yellow-500" />
                                    <span className="text-xs text-gray-500">Digitando...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
                         <div className="relative flex-1">
                            <input 
                                type="text" 
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Digite sua mensagem..."
                                className="w-full pl-4 pr-10 py-3 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                            />
                            <button 
                                onMouseDown={startRecording}
                                onMouseUp={stopRecording}
                                onMouseLeave={stopRecording}
                                onTouchStart={startRecording}
                                onTouchEnd={stopRecording}
                                className={`absolute right-1 top-1 p-2 rounded-full transition-all ${
                                    isRecording 
                                    ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/50 scale-110' 
                                    : 'text-gray-500 hover:bg-gray-200'
                                }`}
                                title="Segure para gravar áudio"
                            >
                                <Mic size={18} />
                            </button>
                         </div>
                        <button 
                            onClick={handleSendMessage}
                            disabled={!inputText.trim() || isLoading}
                            className="p-3 bg-yellow-500 text-black rounded-full hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-transform active:scale-95"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                    {isRecording && (
                        <div className="absolute bottom-16 left-0 right-0 flex justify-center pointer-events-none">
                            <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce">
                                Gravando Áudio... Solte para enviar
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Floating Toggle Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="bg-yellow-500 hover:bg-yellow-400 text-black p-4 rounded-full shadow-lg shadow-yellow-900/20 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center"
            >
                {isOpen ? <X size={28} /> : <MessageCircle size={28} fill="black" />}
            </button>
        </div>
    );
};