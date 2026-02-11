import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 text-center font-sans">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-200">
             <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
             </div>
             <h1 className="text-xl font-bold text-gray-900 mb-2">Ops! Algo deu errado.</h1>
             <p className="text-gray-500 mb-6 text-sm">O aplicativo encontrou um erro inesperado. Tente recarregar.</p>
             
             <div className="bg-gray-50 p-3 rounded text-left text-xs font-mono text-red-500 mb-6 overflow-auto max-h-32 border border-gray-200">
               {this.state.error?.toString()}
             </div>

             <button 
                onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                }}
                className="w-full py-3 bg-black text-yellow-500 font-bold rounded-lg hover:bg-gray-900 transition-colors uppercase tracking-wide text-sm"
             >
                Limpar Dados e Reiniciar
             </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}