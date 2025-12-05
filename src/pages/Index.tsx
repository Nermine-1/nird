import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { ChatArea } from '@/components/ChatArea';
import { DualViewPanel } from '@/components/DualViewPanel';
import { SettingsDialog } from '@/components/SettingsDialog';
import { VisualizationsPanel } from '@/components/VisualizationsPanel';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { useChatStore } from '@/store/chatStore';

const Index = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [visualizationsOpen, setVisualizationsOpen] = useState(false);
  const { isAuthenticated } = useChatStore();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Sidebar */}
      <Sidebar onOpenSettings={() => setSettingsOpen(true)} />

      {/* Main Chat Area */}
      <ChatArea onOpenVisualizations={() => setVisualizationsOpen(true)} />

      {/* Dual View Panel - Only for authenticated users */}
      {isAuthenticated && <DualViewPanel />}

      {/* Settings Dialog */}
      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
      />

      {/* Visualizations Panel - Only for authenticated users */}
      {isAuthenticated && (
        <VisualizationsPanel
          open={visualizationsOpen}
          onClose={() => setVisualizationsOpen(false)}
        />
      )}
    </div>
  );
};

export default Index;
