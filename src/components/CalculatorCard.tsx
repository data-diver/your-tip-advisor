import { useState, useMemo, useEffect } from 'react';
import { TippingData } from '@/data/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { exchangeRates, supportedCurrencies } from '@/data/exchangeRates';
import { HelpCircle } from 'lucide-react';
import { SuggestTipDialog } from './SuggestTipDialog';

interface CalculatorCardProps {
  country: TippingData;
  homeCurrency: string;
  exchangeRates: { [key: string]: { [key: string]: number } };
}

export const CalculatorCard = ({ country, homeCurrency, exchangeRates }: CalculatorCardProps) => {
  const [billAmount, setBillAmount] = useState('');
  const [tipOption, setTipOption] = useState<number | 'custom' | 'round-up' | 'none'>('none');
  const [customTip, setCustomTip] = useState('');
  const [isSuggestDialogOpen, setIsSuggestDialogOpen] = useState(false);

  useEffect(() => {
    setBillAmount('');
    setCustomTip('');
    if (Array.isArray(country.tipOptions)) {
      setTipOption(country.tipOptions[1] || country.tipOptions[0]);
    } else {
      setTipOption(country.tipOptions);
    }
  }, [country]);

  const handleSuggestTip = (suggestedPercentage: number) => {
    setTipOption('custom');
    setCustomTip(suggestedPercentage.toString());
    setIsSuggestDialogOpen(false);
  };

  const { tipAmount, totalBill, totalInHomeCurrency } = useMemo(() => {
    const bill = parseFloat(billAmount) || 0;
    let tip = 0;

    if (tipOption === 'round-up') {
      tip = Math.ceil(bill) - bill;
    } else if (tipOption === 'custom') {
      tip = (bill * (parseFloat(customTip) || 0)) / 100;
    } else if (typeof tipOption === 'number') {
      tip = (bill * tipOption) / 100;
    }

    const total = bill + tip;
    const rate = exchangeRates[country.currency.code]?.[homeCurrency] || 1;
    const convertedTotal = total * rate;

    return {
      tipAmount: tip,
      totalBill: total,
      totalInHomeCurrency: convertedTotal,
    };
  }, [billAmount, tipOption, customTip, country, homeCurrency, exchangeRates]);

  const homeCurrencySymbol = useMemo(() => {
    return supportedCurrencies.find(c => c.code === homeCurrency)?.symbol || '$';
  }, [homeCurrency]);

  const formatCurrency = (amount: number, currencyCode: string, symbol: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      currencyDisplay: 'symbol',
    }).format(amount).replace(currencyCode, symbol).trim();
  };

  return (
    <>
      <Card className="bg-card/80 backdrop-blur-sm border-border sticky top-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label htmlFor="bill" className="text-sm font-medium text-muted-foreground">Bill Amount</label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-card-foreground text-lg">{country.currency.symbol}</span>
              </div>
              <Input
                id="bill"
                type="number"
                placeholder="0.00"
                value={billAmount}
                onChange={(e) => setBillAmount(e.target.value)}
                className="pl-8 text-2xl font-semibold h-14"
              />
            </div>
          </div>

          {country.tipOptions !== 'none' && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Tip</label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                {Array.isArray(country.tipOptions) && country.tipOptions.map(opt => (
                  <Button key={opt} variant={tipOption === opt ? 'default' : 'secondary'} onClick={() => setTipOption(opt)}>
                    {opt}%
                  </Button>
                ))}
                 {country.tipOptions === 'round-up' && (
                   <Button className="col-span-3" variant={tipOption === 'round-up' ? 'default' : 'secondary'} onClick={() => setTipOption('round-up')}>
                    Round Up Bill
                  </Button>
                 )}
                <Button variant={tipOption === 'custom' ? 'default' : 'secondary'} onClick={() => setTipOption('custom')}>
                  Custom
                </Button>
              </div>
              {tipOption === 'custom' && (
                <div className="relative mt-2">
                   <Input type="number" placeholder="Enter %" value={customTip} onChange={e => setCustomTip(e.target.value)} className="pr-8"/>
                   <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-muted-foreground">%</span>
                   </div>
                </div>
              )}
              <Button variant="outline" className="w-full mt-4" onClick={() => setIsSuggestDialogOpen(true)}>
                <HelpCircle />
                Suggest a Tip
              </Button>
            </div>
          )}

          <div className="space-y-4 pt-4 border-t border-border">
              {country.tipOptions === 'none' && <p className="text-center font-semibold text-lg">No tip is necessary.</p>}
              
              {country.tipOptions !== 'none' && (
                  <div className="flex justify-between items-center text-lg">
                      <span className="text-muted-foreground">Tip Amount</span>
                      <span className="font-semibold">{formatCurrency(tipAmount, country.currency.code, country.currency.symbol)}</span>
                  </div>
              )}
              <div className="flex justify-between items-center text-2xl font-bold text-accent">
                  <span className="">Total Bill</span>
                  <span className="">{formatCurrency(totalBill, country.currency.code, country.currency.symbol)}</span>
              </div>
              <p className="text-right text-muted-foreground text-sm">
                ≈ {formatCurrency(totalInHomeCurrency, homeCurrency, homeCurrencySymbol)}
              </p>
          </div>
        </CardContent>
      </Card>
      <SuggestTipDialog
        isOpen={isSuggestDialogOpen}
        onOpenChange={setIsSuggestDialogOpen}
        country={country}
        onSuggestTip={handleSuggestTip}
      />
    </>
  );
};
