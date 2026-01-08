import React from 'react';
import { Album } from '../types';

interface ShelfViewProps {
  records: Album[];
}

const ShelfView: React.FC<ShelfViewProps> = ({ records }) => {
  // Sort records alphabetically by artist to simulate organized shelving
  const sortedRecords = [...records].sort((a, b) => a.artist.localeCompare(b.artist));

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="bg-[#4a3b2a] p-8 rounded-lg shadow-2xl border-4 border-[#3e2b1c]">
        {/* Shelf Frame */}
        <div className="flex flex-wrap gap-y-12 items-end justify-start min-h-[400px]">
          
          {records.length === 0 && (
             <div className="w-full text-center text-[#d6cbb8] italic py-20">Your shelf is empty. Time to visit the record store!</div>
          )}

          {sortedRecords.map((record) => {
             // Generate a somewhat random width for variety
             const width = 24 + (record.title.length % 3) * 4; 
             
             return (
              <div key={record.id} className="group relative flex flex-col items-center justify-end">
                 {/* Tooltip on hover */}
                 <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
                    <div className="bg-black/90 text-white text-xs p-2 rounded whitespace-nowrap shadow-xl">
                      <p className="font-bold">{record.title}</p>
                      <p>{record.artist}</p>
                    </div>
                    {/* Tooltip Arrow */}
                    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-black/90 mx-auto"></div>
                 </div>

                 {/* Spine */}
                 <div 
                  className="h-64 rounded-sm border-l border-r border-white/10 shadow-lg cursor-pointer transition-transform hover:-translate-y-4 hover:z-10 relative"
                  style={{ 
                    width: `${width}px`, 
                    backgroundColor: record.spineColor,
                    backgroundImage: 'linear-gradient(90deg, rgba(0,0,0,0.2) 0%, rgba(255,255,255,0.1) 50%, rgba(0,0,0,0.2) 100%)' // Spine lighting effect
                  }}
                 >
                    {/* Spine Text - Rotated */}
                    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                      <span 
                        className="whitespace-nowrap text-[10px] font-bold text-white/90 uppercase tracking-wider origin-center -rotate-90 w-64 text-center select-none drop-shadow-md"
                      >
                        {record.artist} • {record.title}
                      </span>
                    </div>
                 </div>
              </div>
            );
          })}
        </div>
        {/* Wood Shelf Plank */}
        <div className="w-full h-8 bg-[#5D4037] mt-0 rounded-sm shadow-[0_10px_20px_rgba(0,0,0,0.5)] border-t border-[#8D6E63] relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-30"></div>
        </div>
      </div>
    </div>
  );
};

export default ShelfView;