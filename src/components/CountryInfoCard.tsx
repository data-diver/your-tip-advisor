
import { TippingData } from '@/data/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Info, X } from 'lucide-react';
import { Button } from './ui/button';

interface CountryInfoCardProps {
  country: TippingData;
  onClear: () => void;
}

export const CountryInfoCard = ({ country, onClear }: CountryInfoCardProps) => {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex-row items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-4xl">{country.flag}</span>
          <CardTitle className="text-3xl font-bold">{country.name}</CardTitle>
        </div>
        <Button variant="ghost" size="icon" onClick={onClear} aria-label="Close">
          <X className="h-6 w-6" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-muted/30 border-l-4 border-accent p-4 rounded-r-md">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 mt-1 flex-shrink-0 text-accent" />
            <p className="text-card-foreground">{country.culturalNuance}</p>
          </div>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-3">Common Norms</h4>
          <ul className="space-y-3">
            {Object.values(country.norms).map((norm, index) => (
              <li key={index} className="flex items-center gap-4">
                <norm.icon className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                <span className="font-medium text-card-foreground">{norm.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
