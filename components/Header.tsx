
import React from 'react';
import { Tab } from '../types';
import { LayoutGrid, BarChart3, Heart } from 'lucide-react';

interface HeaderProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="sticky top-0 z-50 bg-[#8B5E3C] text-[#FDF6E3] shadow-lg border-b-4 border-[#5e3f28]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          <div className="flex items-center gap-4">
            {/* Custom Mini Vinyl Logo */}
            <div className="relative group">
              <div className="w-12 h-12 bg-black rounded-full border-2 border-[#333] flex items-center justify-center animate-spin-slow shadow-[0_4px_10px_rgba(0,0,0,0.5)] relative overflow-hidden">
                {/* Vinyl Grooves */}
                <div className="absolute inset-1 rounded-full border border-white/5"></div>
                <div className="absolute inset-2 rounded-full border border-white/5"></div>
                <div className="absolute inset-3 rounded-full border border-white/5"></div>
                
                {/* Shine Highlight */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent"></div>
                
                {/* Record Label */}
                <div className="w-5 h-5 rounded-full bg-[#D2691E] border border-black/30 flex items-center justify-center z-10">
                   <div className="w-1 h-1 bg-white/60 rounded-full shadow-[0_0_2px_rgba(0,0,0,0.8)]"></div>
                </div>
              </div>
              {/* Outer Ring Shadow for Depth */}
              <div className="absolute -inset-1 border-2 border-[#5e3f28]/50 rounded-full pointer-events-none"></div>
            </div>

            <h1 className="text-2xl font-black tracking-tighter text-[#FDF6E3]" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.2)' }}>
              Vinyl<span className="text-[#D2691E]">Vault</span>
            </h1>
          </div>

          <nav className="hidden md:flex space-x-2 bg-[#5e3f28]/30 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab(Tab.TILES)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
                activeTab === Tab.TILES
                  ? 'bg-[#FDF6E3] text-[#5e3f28] shadow-md font-bold'
                  : 'text-[#FDF6E3]/80 hover:bg-[#5e3f28]/50'
              }`}
            >
              <LayoutGrid size={18} />
              <span>Collection</span>
            </button>
            <button
              onClick={() => setActiveTab(Tab.WISHLIST)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
                activeTab === Tab.WISHLIST
                  ? 'bg-[#FDF6E3] text-[#5e3f28] shadow-md font-bold'
                  : 'text-[#FDF6E3]/80 hover:bg-[#5e3f28]/50'
              }`}
            >
              <Heart size={18} />
              <span>Wishlist</span>
            </button>
            <button
              onClick={() => setActiveTab(Tab.STATS)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
                activeTab === Tab.STATS
                  ? 'bg-[#FDF6E3] text-[#5e3f28] shadow-md font-bold'
                  : 'text-[#FDF6E3]/80 hover:bg-[#5e3f28]/50'
              }`}
            >
              <BarChart3 size={18} />
              <span>Stats</span>
            </button>
          </nav>
        </div>
      </div>

      <div className="md:hidden flex justify-around bg-[#5e3f28] p-2 text-xs">
         <button onClick={() => setActiveTab(Tab.TILES)} className={`flex flex-col items-center gap-1 ${activeTab === Tab.TILES ? 'text-[#FDF6E3]' : 'text-[#FDF6E3]/50'}`}>
            <LayoutGrid size={20} /> Collection
          </button>
          <button onClick={() => setActiveTab(Tab.WISHLIST)} className={`flex flex-col items-center gap-1 ${activeTab === Tab.WISHLIST ? 'text-[#FDF6E3]' : 'text-[#FDF6E3]/50'}`}>
            <Heart size={20} /> Wishlist
          </button>
          <button onClick={() => setActiveTab(Tab.STATS)} className={`flex flex-col items-center gap-1 ${activeTab === Tab.STATS ? 'text-[#FDF6E3]' : 'text-[#FDF6E3]/50'}`}>
            <BarChart3 size={20} /> Stats
          </button>
      </div>
    </header>
  );
};

export default Header;
