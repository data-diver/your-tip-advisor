
import { Coins } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-primary text-primary-foreground p-4 shadow-md">
      <div className="container mx-auto max-w-7xl flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Coins className="text-accent" size={32} />
          <h1 className="text-2xl font-bold tracking-tight">Global Tip Advisor</h1>
        </div>
      </div>
    </header>
  );
};
