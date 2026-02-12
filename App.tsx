import React, { useState, useEffect, useMemo } from 'react';
import { Youtube, Zap, Shield, Cpu, Terminal, Clipboard, X, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { extractVideoId, generateThumbnails } from './utils/youtube';
import { VideoDetails, ThumbnailOption } from './types';
import ThumbnailCard from './components/ThumbnailCard';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState<string | null>(null);
  const [invalidResolutions, setInvalidResolutions] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [systemReady, setSystemReady] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    setTimeout(() => setSystemReady(true), 300);
  }, []);

  const addToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const handleExtract = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!url) {
        addToast("Sequence required", "error");
        return;
    }

    setError(null);
    setVideoId(null);
    setInvalidResolutions(new Set());
    setIsProcessing(true);

    await new Promise(resolve => setTimeout(resolve, 800));

    const id = extractVideoId(url);
    if (id) {
      setVideoId(id);
      addToast("Encryption Broken", "success");
    } else {
      setError("SIGNATURE_FAIL");
      addToast("Invalid URL", "error");
    }
    setIsProcessing(false);
  };

  const handleInvalidAsset = (res: string) => {
    setInvalidResolutions(prev => {
      const next = new Set(prev);
      next.add(res);
      return next;
    });
  };

  const filteredThumbnails = useMemo(() => {
    if (!videoId) return [];
    return generateThumbnails(videoId).filter(t => !invalidResolutions.has(t.resolution));
  }, [videoId, invalidResolutions]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      addToast("Data Injected", "info");
    } catch (err) {
      addToast("Access Denied", "error");
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-opacity duration-1000 ${systemReady ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Toast Manager */}
      <div className="fixed top-8 right-8 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map(toast => (
          <div key={toast.id} className="pointer-events-auto flex items-center gap-3 px-5 py-3 rounded-2xl bg-black/80 border border-white/10 backdrop-blur-2xl shadow-2xl animate-in slide-in-from-right fade-in">
            {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : 
             toast.type === 'error' ? <AlertTriangle className="w-4 h-4 text-red-400" /> : 
             <Zap className="w-4 h-4 text-cyan-400" />}
            <span className="text-[10px] font-black tracking-widest uppercase">{toast.message}</span>
          </div>
        ))}
      </div>

      <main className="flex-grow container mx-auto px-6 py-12 flex flex-col items-center">
        
        {/* Top Navbar */}
        <header className="w-full flex justify-between items-center mb-24 max-w-6xl">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center">
                    <Youtube className="w-5 h-5 text-black" />
                </div>
                <h1 className="cyber-font text-xl font-black tracking-tighter text-white">NEON<span className="text-red-500">GENESIS</span></h1>
            </div>
            <div className="flex gap-6">
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500">
                    <Cpu className="w-3 h-3 text-red-500" /> V3.2_ULTRA
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500">
                    <Shield className="w-3 h-3 text-cyan-500" /> SECURE_LAYER
                </div>
            </div>
        </header>

        {/* Search Deck */}
        <div className="w-full max-w-2xl mb-24 text-center">
            <div className="mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white text-[10px] font-black tracking-[0.3em] uppercase mb-6">
                    <Sparkles className="w-3 h-3 text-yellow-400" /> New Decryption Engine
                </div>
                <h2 className="text-5xl md:text-7xl font-black cyber-font tracking-tighter text-white mb-6 leading-tight">
                    VISUAL<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-cyan-500">EXTRACTOR</span>
                </h2>
                <p className="text-gray-500 text-sm font-medium tracking-wide max-w-sm mx-auto">
                    Decrypt high-definition visual assets from any YouTube sequence instantly.
                </p>
            </div>

            <div className="relative group p-1 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-xl">
                <div className="relative flex items-center bg-black/40 rounded-[22px]">
                    <div className="pl-6 pr-4">
                        <Terminal className={`w-5 h-5 ${isProcessing ? 'text-red-500 animate-pulse' : 'text-gray-700'}`} />
                    </div>
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Paste link sequence..."
                        className="flex-1 bg-transparent text-white placeholder-gray-800 py-6 px-2 focus:outline-none font-mono text-sm tracking-widest"
                        disabled={isProcessing}
                    />
                    <div className="flex gap-3 pr-4">
                        {!url && (
                             <button onClick={handlePaste} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                                <Clipboard className="w-4 h-4 text-gray-500" />
                             </button>
                        )}
                        {url && (
                             <button onClick={() => setUrl('')} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                                <X className="w-4 h-4 text-gray-500" />
                             </button>
                        )}
                        <button
                            onClick={(e) => handleExtract(e)}
                            disabled={!url || isProcessing}
                            className="bg-white text-black font-black text-[10px] tracking-widest px-8 py-3 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-xl disabled:opacity-50"
                        >
                            {isProcessing ? 'LOADING' : 'INITIATE'}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* Result Sector */}
        {videoId && (
            <div className="w-full max-w-6xl animate-in fade-in slide-in-from-bottom-20 duration-1000">
                <div className="flex items-center gap-6 mb-12">
                    <div className="h-px flex-1 bg-white/10"></div>
                    <span className="text-[10px] font-black cyber-font text-red-500 tracking-[0.5em] uppercase">Assets Retrieved</span>
                    <div className="h-px flex-1 bg-white/10"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {filteredThumbnails.map((thumb, idx) => (
                        <ThumbnailCard 
                            key={thumb.resolution}
                            thumbnail={thumb}
                            isFeatured={idx === 0}
                            onToast={addToast}
                            onInvalid={handleInvalidAsset}
                        />
                    ))}
                    {filteredThumbnails.length === 0 && !isProcessing && (
                         <div className="col-span-full py-20 text-center text-gray-600 font-mono text-xs uppercase tracking-widest">
                            Scanning complete. No valid HD assets found for this ID.
                         </div>
                    )}
                </div>
            </div>
        )}
      </main>

      <footer className="py-12 border-t border-white/5 text-center">
          <p className="text-[10px] font-bold text-gray-600 tracking-[0.4em] uppercase">
              NeonGenesis Systems // Distributed by AI Beasts007
          </p>
      </footer>
    </div>
  );
};

export default App;