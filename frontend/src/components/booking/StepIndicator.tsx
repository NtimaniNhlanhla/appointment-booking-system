const STEPS = [
  { id: 1, label: 'Branch' },
  { id: 2, label: 'Date' },
  { id: 3, label: 'Time' },
  { id: 4, label: 'Details' },
  { id: 5, label: 'Confirm' },
];

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3 | 4 | 5;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center w-full py-4">
      {STEPS.map((step, index) => (
        <div key={step.id} className="flex items-center flex-1 last:flex-initial">
          {/* Circle */}
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center
              text-sm font-semibold transition-colors
              ${currentStep > step.id
                ? 'bg-primary text-white'
                : currentStep === step.id
                  ? 'bg-primary text-white ring-4 ring-primary/20'
                  : 'bg-gray-100 text-gray-400'
              }
            `}>
              {currentStep > step.id ? '✓' : step.id}
            </div>
            <span className={`text-xs hidden sm:block ${
              currentStep >= step.id ? 'text-primary font-medium' : 'text-gray-400'
            }`}>
              {step.label}
            </span>
          </div>
          {/* Connector */}
          {index < STEPS.length - 1 && (
            <div className={`flex-1 h-0.5 mx-1 transition-colors ${
              currentStep > step.id ? 'bg-primary' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
}