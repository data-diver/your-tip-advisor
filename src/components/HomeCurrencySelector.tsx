
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { supportedCurrencies } from '@/data/exchangeRates';

interface HomeCurrencySelectorProps {
  currentCurrency: string;
  onCurrencyChange: (currency: string) => void;
}

export const HomeCurrencySelector = ({ currentCurrency, onCurrencyChange }: HomeCurrencySelectorProps) => {
  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle className="text-xl">Your Home Currency</CardTitle>
      </CardHeader>
      <CardContent>
        <Select value={currentCurrency} onValueChange={onCurrencyChange}>
          <SelectTrigger id="home-currency">
            <SelectValue placeholder="Select your home currency" />
          </SelectTrigger>
          <SelectContent>
            {supportedCurrencies.map(currency => (
              <SelectItem key={currency.code} value={currency.code}>
                {currency.code} - {currency.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-2">This is used for converting the total bill amount.</p>
      </CardContent>
    </Card>
  );
};
