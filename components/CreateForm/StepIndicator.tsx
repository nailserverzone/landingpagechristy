'use client';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export function StepIndicator({ currentStep, totalSteps, stepLabels }: StepIndicatorProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        {stepLabels.map((label, i) => {
          const step = i + 1;
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;
          return (
            <div key={label} className="flex flex-col items-center flex-1">
              <div className="flex items-center w-full">
                {i > 0 && (
                  <div
                    className={`flex-1 h-0.5 transition-colors ${
                      isCompleted || isCurrent ? 'bg-[#1E2D5A]' : 'bg-gray-200'
                    }`}
                  />
                )}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all flex-shrink-0 ${
                    isCompleted
                      ? 'bg-[#1E2D5A] text-white'
                      : isCurrent
                      ? 'bg-[#1E2D5A] text-white ring-4 ring-[#1E2D5A]/20'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {isCompleted ? '✓' : step}
                </div>
                {i < totalSteps - 1 && (
                  <div
                    className={`flex-1 h-0.5 transition-colors ${
                      isCompleted ? 'bg-[#1E2D5A]' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
              <span
                className={`mt-1 text-xs text-center hidden sm:block transition-colors ${
                  isCurrent ? 'text-[#1E2D5A] font-semibold' : 'text-gray-400'
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
