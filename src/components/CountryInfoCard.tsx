
import { TippingData } from '@/data/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Lightbulb, X } from 'lucide-react';
import { Button } from './ui/button';

interface CountryInfoCardProps {
  country: TippingData;
  onClear: () => void;
}

const normTitles: { [key: string]: string } = {
  restaurant: 'Restaurant (Sit-down)',
  bar: 'Bar/Cafe',
  taxi: 'Taxi/Rideshare',
  hotelPorter: 'Hotel Porter',
  hotelHousekeeping: 'Hotel Housekeeping',
};

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
        <div className="bg-accent/20 border-l-4 border-accent p-4 rounded-md">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="h-5 w-5 flex-shrink-0 text-accent" />
            <h4 className="font-semibold text-card-foreground">Cultural Insight</h4>
          </div>
          <p className="text-card-foreground/90">{country.culturalNuance}</p>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Tipping Guidelines</h4>
          <ul className="space-y-4">
            {Object.entries(country.norms).map(([key, norm]) => (
              <li key={key} className="flex items-start gap-4">
                <div className="flex-shrink-0 h-10 w-10 bg-muted rounded-full flex items-center justify-center">
                  <norm.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-card-foreground">
                    {normTitles[key as keyof typeof normTitles] ||
                      key
                        .replace(/([A-Z])/g, ' $1')
                        .replace(/^./, (str) => str.toUpperCase())}
                  </p>
                  <p className="text-sm text-muted-foreground">{norm.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
