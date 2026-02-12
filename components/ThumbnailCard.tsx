import React, { useState } from 'react';
import { Download, ExternalLink, Copy, Share2, Check, Monitor, Smartphone, LayoutGrid } from 'lucide-react';
import { ThumbnailOption } from '../types';

interface ThumbnailCardProps {
  thumbnail: ThumbnailOption;
  isFeatured?: boolean;
  onToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  onInvalid?: (resolution: string) => void;
}

const ThumbnailCard: React.FC<ThumbnailCardProps> = ({ thumbnail, isFeatured = false, onToast, onInvalid }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    // YouTube returns a 120x90 grey "placeholder" if the resolution doesn't exist
    if (img.naturalWidth === 120) {
      if (onInvalid) onInvalid(thumbnail.resolution);
    } else {
      setIsLoaded(true);
    }
  };

  const handleDownload = async () => {
    onToast(`Preparing Download...`, 'info');
    try {
      const response = await fetch(thumbnail.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `youtube_asset_${thumbnail.resolution}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      onToast('Download Successful', 'success');
    } catch (e) {
      window.open(thumbnail.url, '_blank');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(thumbnail.url);
      setCopied(true);
      onToast('URL Copied', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      onToast('Access Denied', 'error');
    }
  };

  return (
    <div className={`group laser-border rounded-3xl overflow-hidden transition-all duration-500 backdrop-blur-3xl flex flex-col ${isFeatured ? 'md:flex-row md:col-span-2' : ''}`}>
      
      {/* Media Sector */}
      <div className={`relative overflow-hidden bg-black/40 ${isFeatured ? 'md:w-3/5 aspect-video' : 'aspect-video w-full'}`}>
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-white/5 border-t-red-500 rounded-full animate-spin"></div>
          </div>
        )}
        
        <img
          src={thumbnail.url}
          alt={thumbnail.label}
          onLoad={handleImageLoad}
          className={`w-full h-full object-cover transition-all duration-1000 ease-out will-change-transform ${isLoaded ? 'opacity-100 scale-100 group-hover:scale-105' : 'opacity-0 scale-110'}`}
        />

        {/* Floating Metrics */}
        <div className="absolute top-4 left-4 flex gap-2">
            <span className="bg-black/60 backdrop-blur-xl border border-white/10 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest text-white shadow-2xl">
                {thumbnail.width} × {thumbnail.height}
            </span>
            {isFeatured && (
                <span className="bg-red-500/20 backdrop-blur-xl border border-red-500/30 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest text-red-400 shadow-2xl flex items-center gap-1">
                    <LayoutGrid className="w-3 h-3" /> MASTER
                </span>
            )}
        </div>
      </div>

      {/* Control Sector */}
      <div className={`p-6 flex flex-col justify-between ${isFeatured ? 'md:w-2/5' : ''}`}>
        <div>
            <div className="flex items-center gap-2 mb-2">
                {thumbnail.width > 700 ? <Monitor className="w-3 h-3 text-cyan-400" /> : <Smartphone className="w-3 h-3 text-purple-400" />}
                <span className="text-[10px] font-bold text-gray-500 tracking-[0.2em] uppercase">{thumbnail.label}</span>
            </div>
            <h3 className="text-lg font-bold cyber-font text-white mb-6 group-hover:text-red-500 transition-colors">
                ASSET_{thumbnail.resolution.toUpperCase()}
            </h3>
        </div>

        <div className="space-y-3">
            <button
                onClick={handleDownload}
                className="w-full py-4 rounded-xl bg-white text-black font-black text-xs tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-[0_10px_30px_rgba(255,255,255,0.1)] active:scale-95 flex items-center justify-center gap-2"
            >
                <Download className="w-4 h-4" />
                INITIATE DOWNLOAD
            </button>

            <div className="flex gap-2">
                <button
                    onClick={handleCopy}
                    className="flex-1 py-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-white font-bold text-[10px] tracking-widest transition-all flex items-center justify-center gap-2"
                >
                    {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'COPIED' : 'COPY URL'}
                </button>
                <a
                    href={thumbnail.url}
                    target="_blank"
                    className="p-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-white transition-all"
                >
                    <ExternalLink className="w-4 h-4" />
                </a>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ThumbnailCard;