import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; // 👈 Import Supabase
import Header from './components/Header';
import TileView from './components/TileView';
import StatsView from './components/StatsView';
import AddRecordModal from './components/AddRecordModal';
import NowPlayingModal from './components/NowPlayingModal';
import DiscoveryCrate from './components/DiscoveryCrate';
import { Tab, Album, NewAlbumInput } from './types';
import { INITIAL_RECORDS } from './constants';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.TILES);
  const [records, setRecords] = useState<Album[]>([]); // Start empty, let Supabase fill it
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [playingRecord, setPlayingRecord] = useState<Album | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. LOAD DATA FROM SUPABASE ON STARTUP
  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setIsLoading(true);
    
    // We select all columns. Note: Supabase returns snake_case (spine_color), 
    // but your app uses camelCase (spineColor). We handle this below.
    const { data, error } = await supabase
      .from('albums')
      .select('*')
      .order('added_at', { ascending: false });

    if (error) {
      console.error('Error fetching data:', error);
    } else if (data && data.length > 0) {
      // TRANSFORM DATA: Database (snake_case) -> App (camelCase)
      const formattedData: Album[] = data.map((item: any) => ({
        id: item.id,
        title: item.title,
        artist: item.artist,
        genre: item.genre,
        year: item.year,
        spineColor: item.spine_color, // 👈 Mapping happens here
        addedAt: item.added_at,
        status: item.status
      }));
      setRecords(formattedData);
    } else {
      // 2. OPTIONAL: If Database is empty, upload INITIAL_RECORDS
      console.log("Database empty. Seeding initial records...");
      await seedInitialData();
    }
    setIsLoading(false);
  };

  const seedInitialData = async () => {
    // Prepare initial records for DB (convert keys to snake_case)
    const recordsToUpload = INITIAL_RECORDS.map(r => ({
      title: r.title,
      artist: r.artist,
      genre: r.genre,
      year: r.year,
      spine_color: r.spineColor,
      status: 'collection',
      added_at: new Date().toISOString()
    }));

    const { data, error } = await supabase.from('albums').insert(recordsToUpload).select();
    
    if (!error && data) {
      // Reload the page logic to fetch them back cleanly
      fetchRecords(); 
    }
  };

  // 3. ADD NEW RECORD (To Database)
  const handleAddRecord = async (input: NewAlbumInput) => {
    // Check for duplicates in local state first (saves an API call)
    const isDuplicate = records.some(r => 
      r.artist.toLowerCase().trim() === input.artist.toLowerCase().trim() && 
      r.title.toLowerCase().trim() === input.title.toLowerCase().trim()
    );

    if (isDuplicate) {
      alert(`"${input.title}" by ${input.artist} is already in your vault!`);
      return;
    }

    // Prepare for DB
    const newRecordPayload = {
      title: input.title,
      artist: input.artist,
      genre: input.genre,
      year: parseInt(input.year) || new Date().getFullYear(),
      spine_color: input.spineColor, // Map to DB column name
      status: input.status,
      added_at: new Date().toISOString()
    };

    // Insert into Supabase
    const { data, error } = await supabase
      .from('albums')
      .insert([newRecordPayload])
      .select(); // .select() returns the new row with the real ID

    if (error) {
      alert("Error saving to database: " + error.message);
    } else if (data) {
      // Convert back to App format (camelCase)
      const savedRecord: Album = {
        id: data[0].id,
        title: data[0].title,
        artist: data[0].artist,
        genre: data[0].genre,
        year: data[0].year,
        spineColor: data[0].spine_color,
        addedAt: data[0].added_at,
        status: data[0].status
      };
      // Update UI immediately
      setRecords(prev => [savedRecord, ...prev]);
    }
  };

  // 4. DELETE RECORD (From Database)
  const handleDeleteRecord = async (id: string) => {
    if (window.confirm("Are you sure you want to remove this record permanently?")) {
      // Delete from DB
      const { error } = await supabase.from('albums').delete().eq('id', id);

      if (error) {
        alert("Failed to delete.");
      } else {
        // Remove from UI
        setRecords(prev => prev.filter(record => record.id !== id));
      }
    }
  };

  // 5. MOVE TO COLLECTION (Update Database)
  const handleMoveToCollection = async (album: Album) => {
    const { error } = await supabase
      .from('albums')
      .update({ status: 'collection' })
      .eq('id', album.id);

    if (error) {
      alert("Failed to update status.");
    } else {
      // Update UI
      setRecords(prev => prev.map(r => 
        r.id === album.id ? { ...r, status: 'collection' } : r
      ));
    }
  };

  const collectionRecords = records.filter(r => r.status === 'collection' || !r.status);
  const wishlistRecords = records.filter(r => r.status === 'wishlist');

  return (
    <div className="min-h-screen bg-[#d6cbb8] flex flex-col">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
      
      <main className="flex-grow">
        {isLoading ? (
           <div className="flex h-64 items-center justify-center text-[#5e3f28]">
             <p className="animate-pulse font-bold text-xl">Opening Vault...</p>
           </div>
        ) : (
          <>
            {activeTab === Tab.TILES && (
              <TileView 
                records={collectionRecords} 
                onAddClick={() => setIsModalOpen(true)}
                onDelete={handleDeleteRecord}
                onRecordClick={setPlayingRecord}
                title="Your Collection"
              />
            )}

            {activeTab === Tab.WISHLIST && (
              <TileView 
                records={wishlistRecords} 
                onAddClick={() => setIsModalOpen(true)}
                onDelete={handleDeleteRecord}
                onRecordClick={setPlayingRecord}
                onMoveToCollection={handleMoveToCollection}
                title="Your Wishlist"
                afterGridContent={
                  <DiscoveryCrate 
                    ownedAlbums={collectionRecords} 
                    onAddToWishlist={handleAddRecord} 
                  />
                }
              />
            )}

            {activeTab === Tab.STATS && <StatsView records={collectionRecords} />}
          </>
        )}
      </main>

      <AddRecordModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddRecord}
        defaultStatus={activeTab === Tab.WISHLIST ? 'wishlist' : 'collection'}
      />

      <NowPlayingModal
        album={playingRecord}
        onClose={() => setPlayingRecord(null)}
      />
    </div>
  );
};