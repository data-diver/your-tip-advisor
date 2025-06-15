
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from './ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { supportedCurrencies } from '@/data/exchangeRates';

interface SettingsSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  currentCurrency: string;
  onCurrencyChange: (currency: string) => void;
}

export const SettingsSheet = ({
  isOpen,
  onOpenChange,
  currentCurrency,
  onCurrencyChange,
}: SettingsSheetProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Adjust your preferences for the app.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <div className="space-y-2">
            <label htmlFor="home-currency" className="text-sm font-medium">Home Currency</label>
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
            <p className="text-xs text-muted-foreground">This is used for converting the total bill amount.</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
