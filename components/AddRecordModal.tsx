import React, { useState, useEffect } from 'react';
import { NewAlbumInput } from '../types';
import { fetchAlbumMetadata } from '../services/geminiService';
import { X, Wand2, Loader2, Save, Disc, Heart } from 'lucide-react';

interface AddRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (album: NewAlbumInput) => void;
  defaultStatus?: 'collection' | 'wishlist';
}

const AddRecordModal: React.FC<AddRecordModalProps> = ({ isOpen, onClose, onSave, defaultStatus = 'collection' }) => {
  const [formData, setFormData] = useState<NewAlbumInput>({
    title: '',
    artist: '',
    genre: '',
    year: '',
    spineColor: '#8B4513',
    status: defaultStatus
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({ ...prev, status: defaultStatus }));
    }
  }, [isOpen, defaultStatus]);

  if (!isOpen) return null;

  const handleMagicFill = async () => {
    if (!formData.title || !formData.artist) {
      alert("Please enter at least an Artist and Album Title for the magic to work!");
      return;
    }

    setIsLoading(true);
    const metadata = await fetchAlbumMetadata(formData.title, formData.artist);
    setIsLoading(false);

    if (metadata) {
      setFormData(prev => ({
        ...prev,
        title: metadata.correctTitle || prev.title,
        artist: metadata.correctArtist || prev.artist,
        genre: metadata.genre,
        year: metadata.year.toString(),
        spineColor: metadata.spineColor
      }));
    } else {
        alert("Could not fetch details. Please fill manually.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    // Reset form
    setFormData({
      title: '',
      artist: '',
      genre: '',
      year: '',
      spineColor: '#8B4513',
      status: 'collection'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#fdf6e3] rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border-4 border-[#5e3f28]">
        
        {/* Header */}
        <div className="bg-[#5e3f28] text-[#FDF6E3] px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold tracking-wide">Add New Record</h2>
          <button onClick={onClose} className="hover:text-[#D2691E] transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Status Selection */}
          <div className="flex bg-[#e3dcd2] p-1 rounded-lg border border-[#d4c5a9]">
             <button
                type="button"
                onClick={() => setFormData({...formData, status: 'collection'})}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-colors ${formData.status === 'collection' ? 'bg-[#D2691E] text-white font-bold shadow-sm' : 'text-[#5e3f28] hover:bg-[#d4c5a9]'}`}
             >
                <Disc size={16} /> Collection
             </button>
             <button
                type="button"
                onClick={() => setFormData({...formData, status: 'wishlist'})}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-colors ${formData.status === 'wishlist' ? 'bg-[#D2691E] text-white font-bold shadow-sm' : 'text-[#5e3f28] hover:bg-[#d4c5a9]'}`}
             >
                <Heart size={16} /> Wishlist
             </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-bold text-[#5e3f28] mb-1">Artist / Band</label>
              <input
                required
                type="text"
                value={formData.artist}
                onChange={(e) => setFormData({...formData, artist: e.target.value})}
                className="w-full px-4 py-2 rounded border-2 border-[#d4c5a9] bg-white text-[#5e3f28] focus:border-[#D2691E] outline-none transition-colors"
                placeholder="e.g. Pink Floyd"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-[#5e3f28] mb-1">Album Title</label>
              <input
                required
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-2 rounded border-2 border-[#d4c5a9] bg-white text-[#5e3f28] focus:border-[#D2691E] outline-none transition-colors"
                placeholder="e.g. The Dark Side of the Moon"
              />
            </div>
          </div>

          {/* Magic Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleMagicFill}
              disabled={isLoading}
              className="flex items-center gap-2 text-sm text-[#D2691E] font-bold hover:text-[#A0522D] disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Wand2 size={16} />}
              {isLoading ? "Consulting the Archivist..." : "Auto-fill Details with AI"}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[#5e3f28] mb-1">Genre</label>
              <input
                required
                type="text"
                value={formData.genre}
                onChange={(e) => setFormData({...formData, genre: e.target.value})}
                className="w-full px-4 py-2 rounded border-2 border-[#d4c5a9] bg-white text-[#5e3f28] focus:border-[#D2691E] outline-none transition-colors"
                placeholder="e.g. Progressive Rock"
              />
            </div>
             <div>
              <label className="block text-sm font-bold text-[#5e3f28] mb-1">Year</label>
              <input
                required
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({...formData, year: e.target.value})}
                className="w-full px-4 py-2 rounded border-2 border-[#d4c5a9] bg-white text-[#5e3f28] focus:border-[#D2691E] outline-none transition-colors"
                placeholder="1973"
              />
            </div>
          </div>

           <div>
              <label className="block text-sm font-bold text-[#5e3f28] mb-1">Spine Color</label>
              <div className="flex items-center gap-3">
                <input
                    type="color"
                    value={formData.spineColor}
                    onChange={(e) => setFormData({...formData, spineColor: e.target.value})}
                    className="h-10 w-20 rounded cursor-pointer border-2 border-[#d4c5a9]"
                />
                <span className="text-xs text-[#8B5E3C]">Pick a color for the shelf view</span>
              </div>
            </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-[#d4c5a9] mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg font-medium text-[#5e3f28] hover:bg-[#e3dcd2] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#D2691E] text-white rounded-lg font-bold hover:bg-[#A0522D] shadow-md flex items-center gap-2"
            >
              <Save size={18} />
              {formData.status === 'collection' ? 'Add to Vault' : 'Add to Wishlist'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRecordModal;