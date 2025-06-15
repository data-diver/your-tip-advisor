import { useState, useMemo } from 'react';
import { TippingData } from '@/data/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface SuggestTipDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  country: TippingData;
  onSuggestTip: (details: { percentage: number; quality: ServiceQuality | ''; serviceCharge: 'Yes' | 'No' | '' }) => void;
}

type Step = 'serviceType' | 'serviceQuality' | 'serviceCharge' | 'suggestion';
type ServiceQuality = 'Excellent' | 'Good' | 'Average' | 'Poor';

export const SuggestTipDialog = ({ isOpen, onOpenChange, country, onSuggestTip }: SuggestTipDialogProps) => {
  const [step, setStep] = useState<Step>('serviceType');
  const [serviceType, setServiceType] = useState<string>('');
  const [serviceQuality, setServiceQuality] = useState<ServiceQuality | ''>('');
  const [serviceChargeIncluded, setServiceChargeIncluded] = useState<'Yes' | 'No' | ''>('');

  const serviceTypes = useMemo(() => Object.keys(country.norms), [country]);

  const reset = () => {
    setStep('serviceType');
    setServiceType('');
    setServiceQuality('');
    setServiceChargeIncluded('');
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      setTimeout(reset, 300); // Reset after close animation
    }
    onOpenChange(open);
  };

  const suggestedTip = useMemo(() => {
    if (!serviceQuality) return 0;

    let baseTip = 0;
    if (Array.isArray(country.tipOptions)) {
      baseTip = country.tipOptions.length > 0
        ? country.tipOptions[Math.floor(country.tipOptions.length / 2)]
        : 15; // Fallback
    } else if (country.tipOptions === 'round-up') {
      baseTip = 10;
    }

    let tip = baseTip;
    switch (serviceQuality) {
      case 'Excellent': tip += 5; break;
      case 'Average': tip -= 5; break;
      case 'Poor': tip = 0; break;
      case 'Good':
      default: break;
    }

    if (serviceChargeIncluded === 'Yes') {
      if (serviceQuality === 'Excellent' || serviceQuality === 'Good') {
        tip = Math.min(tip, 5);
      } else {
        tip = 0;
      }
    }

    return Math.max(0, Math.round(tip));
  }, [serviceQuality, serviceChargeIncluded, country.tipOptions]);

  const handleAccept = () => {
    onSuggestTip({
      percentage: suggestedTip,
      quality: serviceQuality,
      serviceCharge: serviceChargeIncluded,
    });
    handleClose(false);
  };

  const renderStep = () => {
    switch (step) {
      case 'serviceType':
        return (
          <div className="space-y-4 py-4">
            <Label className="font-medium text-base">What type of service is this for?</Label>
            <RadioGroup value={serviceType} onValueChange={(val: string) => setServiceType(val)} className="gap-2">
              {serviceTypes.map(type => (
                <div key={type} className="flex items-center space-x-2">
                  <RadioGroupItem value={type} id={`type-${type}`} />
                  <Label htmlFor={`type-${type}`} className="capitalize font-normal">{type.replace(/([A-Z])/g, ' $1').trim()}</Label>
                </div>
              ))}
            </RadioGroup>
            <DialogFooter className="mt-6">
              <Button onClick={() => handleClose(false)} variant="ghost">Cancel</Button>
              <Button onClick={() => setStep('serviceQuality')} disabled={!serviceType}>Next</Button>
            </DialogFooter>
          </div>
        );
      case 'serviceQuality':
        return (
          <div className="space-y-4 py-4">
            <Label className="font-medium text-base">How was the service quality?</Label>
            <RadioGroup value={serviceQuality} onValueChange={(val: any) => setServiceQuality(val)} className="gap-2">
              {(['Excellent', 'Good', 'Average', 'Poor'] as ServiceQuality[]).map(q => (
                <div key={q} className="flex items-center space-x-2">
                  <RadioGroupItem value={q} id={`quality-${q}`} />
                  <Label htmlFor={`quality-${q}`} className="font-normal">{q}</Label>
                </div>
              ))}
            </RadioGroup>
            <DialogFooter className="mt-6">
              <Button onClick={() => setStep('serviceType')} variant="outline">Back</Button>
              <Button onClick={() => setStep('serviceCharge')} disabled={!serviceQuality}>Next</Button>
            </DialogFooter>
          </div>
        );
      case 'serviceCharge':
        return (
          <div className="space-y-4 py-4">
            <Label className="font-medium text-base">Was a service charge already included?</Label>
            <RadioGroup value={serviceChargeIncluded} onValueChange={(val: any) => setServiceChargeIncluded(val)} className="gap-2">
              {(['Yes', 'No'] as const).map(val => (
                <div key={val} className="flex items-center space-x-2">
                  <RadioGroupItem value={val} id={`charge-${val}`} />
                  <Label htmlFor={`charge-${val}`} className="font-normal">{val}</Label>
                </div>
              ))}
            </RadioGroup>
            <DialogFooter className="mt-6">
              <Button onClick={() => setStep('serviceQuality')} variant="outline">Back</Button>
              <Button onClick={() => setStep('suggestion')} disabled={!serviceChargeIncluded}>Get Suggestion</Button>
            </DialogFooter>
          </div>
        );
      case 'suggestion':
        return (
          <div className="space-y-4 py-4 text-center">
            <p className="text-muted-foreground">Based on your answers, we suggest a tip of:</p>
            <p className="text-5xl font-bold tracking-tight">{suggestedTip}%</p>
            <DialogFooter className="mt-6">
              <Button onClick={() => setStep('serviceCharge')} variant="outline">Go Back</Button>
              <Button onClick={handleAccept}>Accept & Apply</Button>
            </DialogFooter>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tip Suggester</DialogTitle>
          <DialogDescription>
            Let's find the perfect tip for this situation.
          </DialogDescription>
        </DialogHeader>
        {renderStep()}
      </DialogContent>
    </Dialog>
  );
};
