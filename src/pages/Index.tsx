
import { useState } from "react";
import { TippingData } from "@/data/types";
import { tippingData } from "@/data/tippingData";
import { exchangeRates } from "@/data/exchangeRates";
import { Header } from "@/components/Header";
import { CountrySelector } from "@/components/CountrySelector";
import { CountryInfoCard } from "@/components/CountryInfoCard";
import { CalculatorCard } from "@/components/CalculatorCard";
import { SettingsSheet } from "@/components/SettingsSheet";

const Index = () => {
  const [selectedCountry, setSelectedCountry] = useState<TippingData | null>(null);
  const [homeCurrency, setHomeCurrency] = useState('USD');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleSelectCountry = (country: TippingData) => {
    setSelectedCountry(country);
  };
  
  const handleClearCountry = () => {
    setSelectedCountry(null);
  }

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <Header onSettingsClick={() => setIsSettingsOpen(true)} />
      <main className="container mx-auto max-w-5xl px-4 py-8">
        {!selectedCountry ? (
          <CountrySelector 
            countries={tippingData} 
            onSelectCountry={handleSelectCountry}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 animate-fade-in">
            <CountryInfoCard country={selectedCountry} onClear={handleClearCountry} />
            <CalculatorCard 
              country={selectedCountry} 
              homeCurrency={homeCurrency} 
              exchangeRates={exchangeRates} 
            />
          </div>
        )}
      </main>
      <SettingsSheet 
        isOpen={isSettingsOpen} 
        onOpenChange={setIsSettingsOpen}
        currentCurrency={homeCurrency}
        onCurrencyChange={setHomeCurrency}
      />
    </div>
  );
};

export default Index;
