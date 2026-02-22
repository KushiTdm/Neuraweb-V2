
// FICHIER 17 : components/hotel-form/index.tsx
// Composant orchestrateur principal
// ============================================================
'use client';

import { HotelFormProvider, useHotelForm, type Lang } from './HotelFormProvider';
import { ProgressBar } from './ProgressBar';
import { PriceWidget } from './PriceWidget';
import { SuccessScreen } from './SuccessScreen';
import { Step1General } from './steps/Step1General';
import { Step2Rooms } from './steps/Step2Rooms';
import { Step3Services } from './steps/Step3Services';
import { Step4Booking } from './steps/Step4Booking';
import { Step5Content } from './steps/Step5Content';
import { Step6Goals } from './steps/Step6Goals';

const STEPS = [Step1General, Step2Rooms, Step3Services, Step4Booking, Step5Content, Step6Goals];

function HotelFormInner() {
  const { step, submitted } = useHotelForm();
  const StepComponent = STEPS[step];

  if (submitted) return <SuccessScreen />;

  return (
    <>
      <ProgressBar />
      <StepComponent />
      <PriceWidget />
    </>
  );
}

export function HotelForm({ lang = 'fr' }: { lang?: Lang }) {
  return (
    <HotelFormProvider lang={lang}>
      <HotelFormInner />
    </HotelFormProvider>
  );
}
