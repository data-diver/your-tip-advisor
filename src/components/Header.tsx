
import { Settings, Coins } from 'lucide-react';
import { Button } from './ui/button';

interface HeaderProps {
  onSettingsClick: () => void;
}

export const Header = ({ onSettingsClick }: HeaderProps) => {
  return (
    <header className="bg-primary text-primary-foreground p-4 shadow-md">
      <div className="container mx-auto max-w-5xl flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Coins className="text-accent" size={32} />
          <h1 className="text-2xl font-bold tracking-tight">Global Tip Advisor</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={onSettingsClick} aria-label="Settings">
          <Settings className="h-6 w-6" />
        </Button>
      </div>
    </header>
  );
};
