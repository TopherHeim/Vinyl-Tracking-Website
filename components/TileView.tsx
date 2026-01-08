
import React, { useState } from 'react';
import { Album } from '../types';
import { Search, Music, Calendar, Plus, Trash2, FolderInput } from 'lucide-react';

interface TileViewProps {
  records: Album[];
  onAddClick: () => void;
  onDelete: (id: string) => void;
  onRecordClick: (album: Album) => void;
  onMoveToCollection?: (album: Album) => void;
  beforeGridContent?: React.ReactNode;
  afterGridContent?: React.ReactNode;
  title?: string;
}

const TileView: React.FC<TileViewProps> = ({ 
  records, 
  onAddClick, 
  onDelete, 
  onRecordClick, 
  onMoveToCollection,
  beforeGridContent,
  afterGridContent,
  title
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecords = records.filter(record =>
    record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen">
      
      {/* Top Bar: Search + Add Button */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative w-full md:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8B5E3C]">
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="Search your vault..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-[#8B5E3C]/30 bg-[#FDF6E3] focus:outline-none focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#8B5E3C]/20 text-[#5e3f28] placeholder-[#8B5E3C]/50 shadow-inner"
          />
        </div>

        <button
          onClick={onAddClick}
          className="w-full md:w-auto bg-[#D2691E] hover:bg-[#A0522D] text-white px-6 py-3 rounded-lg font-bold shadow-md border-2 border-[#5e3f28] transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          Add Record
        </button>
      </div>

      {/* Injected Content Before Grid */}
      {beforeGridContent}

      {/* Section Title */}
      {title && (
          <h2 className="text-2xl font-bold text-[#5e3f28] mb-6 mt-8 border-b-2 border-[#5e3f28]/10 pb-4">
            {title}
          </h2>
      )}

      {/* Grid */}
      {filteredRecords.length === 0 ? (
        <div className="text-center py-10 text-[#8B5E3C]/60 italic">
          {onMoveToCollection ? "Your wishlist is empty." : "No records found."}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRecords.map((record) => (
            <div 
              key={record.id} 
              onClick={() => onRecordClick(record)}
              className="group relative bg-[#e3dcd2] rounded-lg shadow-[4px_4px_0px_0px_rgba(94,63,40,0.8)] border-2 border-[#5e3f28] overflow-hidden hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(94,63,40,0.9)] transition-all duration-200 cursor-pointer"
            >
              <div className="flex h-32">
                <div className="w-1/3 bg-[#d4c5a9] relative flex items-center justify-center border-r-2 border-[#5e3f28] overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black/5 to-transparent opacity-50"></div>
                  <div className="relative w-20 h-20 bg-black rounded-full shadow-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-700">
                    <div className="absolute inset-0 rounded-full border border-[#333] opacity-50"></div>
                    <div className="w-8 h-8 rounded-full" style={{ backgroundColor: record.spineColor }}></div>
                    <div className="w-1 h-1 bg-white rounded-full absolute"></div>
                  </div>
                </div>

                <div className="w-2/3 p-4 flex flex-col justify-center bg-[#fdf6e3]">
                  <h3 className="font-bold text-lg leading-tight text-[#3e2b1c] line-clamp-2 capitalize">{record.title}</h3>
                  <p className="text-[#8B5E3C] font-medium text-sm mt-1 truncate capitalize">{record.artist}</p>
                </div>
              </div>

              <div className="relative z-20 bg-[#dccfb9] px-4 py-2 border-t-2 border-[#5e3f28] flex justify-between items-center text-xs text-[#5e3f28] font-mono">
                 <div className="flex gap-3">
                    <span className="flex items-center gap-1"><Music size={12} /> {record.genre}</span>
                    <span className="flex items-center gap-1"><Calendar size={12} /> {record.year}</span>
                 </div>
                 
                 <div className="flex items-center gap-2">
                    {onMoveToCollection && (
                        <button 
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onMoveToCollection(record);
                            }}
                            className="text-[#D2691E] hover:text-[#5e3f28] transition-colors p-1 rounded-full hover:bg-[#D2691E]/10 z-10 relative cursor-pointer"
                            title="Add to Collection"
                        >
                            <FolderInput size={14} />
                        </button>
                    )}
                    <button 
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onDelete(record.id);
                        }}
                        className="text-[#8B5E3C] hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-100/20 z-10 relative cursor-pointer"
                        title="Remove Record"
                    >
                        <Trash2 size={14} />
                    </button>
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Injected Content After Grid */}
      {afterGridContent}
    </div>
  );
};

export default TileView;
