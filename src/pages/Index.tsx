
import { useState } from "react";
import { TippingData } from "@/data/types";
import { tippingData } from "@/data/tippingData";
import { exchangeRates } from "@/data/exchangeRates";
import { Header } from "@/components/Header";
import { CountrySelector } from "@/components/CountrySelector";
import { CountryInfoCard } from "@/components/CountryInfoCard";
import { CalculatorCard } from "@/components/CalculatorCard";
import { HomeCurrencySelector } from "@/components/HomeCurrencySelector";
import { ChatInterface } from "@/components/ChatInterface"; // Added ChatInterface import

const Index = () => {
  const [selectedCountry, setSelectedCountry] = useState<TippingData | null>(null);
  const [homeCurrency, setHomeCurrency] = useState('USD');
  const [isChatOpen, setIsChatOpen] = useState(false); // Added state for chat visibility

  const handleSelectCountry = (country: TippingData) => {
    setSelectedCountry(country);
  };
  
  const handleClearCountry = () => {
    setSelectedCountry(null);
  }

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 flex flex-col gap-8">
            <HomeCurrencySelector
              currentCurrency={homeCurrency}
              onCurrencyChange={setHomeCurrency}
            />
            <CountrySelector 
              countries={tippingData} 
              onSelectCountry={handleSelectCountry}
            />
          </div>
          <div className="lg:col-span-2">
            {selectedCountry ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                <CountryInfoCard country={selectedCountry} onClear={handleClearCountry} />
                <CalculatorCard 
                  country={selectedCountry} 
                  homeCurrency={homeCurrency} 
                   exchangeRates={exchangeRates}
                   onOpenChat={() => setIsChatOpen(true)} // Passed chat open handler
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full rounded-lg bg-card/80 backdrop-blur-sm border-2 border-dashed border-border text-muted-foreground p-8">
                <div className="text-center space-y-2">
                  <p className="text-lg font-medium">Welcome to Global Tip Advisor!</p>
                  <p>1. Select your home currency.</p>
                  <p>2. Choose a country you're visiting.</p>
                  <p className="pt-2">You'll see tipping norms and a handy calculator appear here.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
       <ChatInterface
         isOpen={isChatOpen}
         onClose={() => setIsChatOpen(false)}
       />
    </div>
  );
};

export default Index;
