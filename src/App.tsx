import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Home } from './components/Home';
import { CreateThread } from './components/CreateThread';
import { ViewThreads } from './components/ViewThreads';
import { ThreadDetails } from './components/ThreadDetails';
import { ManagePresets } from './components/ManagePresets';
import { ViewMembers } from './components/ViewMembers';
import { Thread } from './types';
import { saveThreads, loadThreads } from './utils/storage';

type View = 'home' | 'create' | 'view' | 'modify' | 'details' | 'presets' | 'members';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [editingThread, setEditingThread] = useState<Thread | null>(null);

  useEffect(() => {
    setThreads(loadThreads());
  }, []);

  const handleSaveThread = (thread: Thread) => {
    const updatedThreads = editingThread 
      ? threads.map(t => t.id === editingThread.id ? thread : t)
      : [...threads, thread];
    
    setThreads(updatedThreads);
    saveThreads(updatedThreads);
    setEditingThread(null);
    setCurrentView('view');
    
    // Show success message
    alert(editingThread ? 'Thread updated successfully!' : 'Thread created successfully!');
  };

  const handleViewChange = (view: View) => {
    setCurrentView(view);
    setSelectedThread(null);
    setEditingThread(null);
  };

  const handleSelectThread = (thread: Thread) => {
    setSelectedThread(thread);
    setCurrentView('details');
  };

  const handleEditThread = (thread: Thread) => {
    setEditingThread(thread);
    setCurrentView('create');
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Home />;
      case 'create':
        return (
          <CreateThread 
            onSaveThread={handleSaveThread}
            existingThread={editingThread || undefined}
          />
        );
      case 'view':
        return <ViewThreads threads={threads} onSelectThread={handleSelectThread} onThreadsUpdated={setThreads} />;
      case 'modify':
        return (
          <ViewThreads 
            threads={threads} 
            onSelectThread={(thread) => handleEditThread(thread)} 
            onThreadsUpdated={setThreads}
          />
        );
      case 'details':
        return selectedThread ? (
          <ThreadDetails 
            thread={selectedThread}
            onBack={() => setCurrentView('view')}
            onEdit={() => handleEditThread(selectedThread)}
          />
        ) : null;
      case 'presets':
        return <ManagePresets />;
      case 'members':
        return <ViewMembers />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentView={currentView} onViewChange={handleViewChange} />
      {renderView()}
    </div>
  );
}

export default App;
