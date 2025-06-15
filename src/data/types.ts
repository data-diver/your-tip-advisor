
import { LucideIcon } from 'lucide-react';

export interface Currency {
  name: string;
  code: string;
  symbol: string;
}

export type TipOptions = number[] | 'round-up' | 'none';

export interface TippingData {
  name: string;
  code: string;
  flag: string;
  currency: Currency;
  culturalNuance: string;
  norms: {
    restaurant: { text: string; icon: LucideIcon };
    bar: { text: string; icon: LucideIcon };
    taxi: { text: string; icon: LucideIcon };
    hotelPorter: { text: string; icon: LucideIcon };
    hotelHousekeeping: { text: string; icon: LucideIcon };
  };
  tipOptions: TipOptions;
}
