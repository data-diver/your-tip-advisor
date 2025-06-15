
import { useState } from 'react';
import { TippingData } from '@/data/types';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Search } from 'lucide-react';

interface CountrySelectorProps {
  countries: TippingData[];
  onSelectCountry: (country: TippingData) => void;
}

export const CountrySelector = ({ countries, onSelectCountry }: CountrySelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="w-full max-w-lg mx-auto bg-card/80 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-semibold">Find Tipping Info</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for a country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 text-base py-6 rounded-md"
          />
        </div>
        <div className="max-h-60 overflow-y-auto pr-2">
          <ul className="space-y-2">
            {filteredCountries.map(country => (
              <li key={country.code}>
                <button
                  onClick={() => onSelectCountry(country)}
                  className="w-full text-left p-3 rounded-md hover:bg-primary/10 transition-colors flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-muted-foreground w-8 text-left text-lg">{country.code}</span>
                    <span className="font-medium">{country.name}</span>
                  </div>
                  <span className="font-medium text-muted-foreground">{country.currency.symbol}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
