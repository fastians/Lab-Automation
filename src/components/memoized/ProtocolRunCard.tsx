import { memo } from "react";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import type { ProtocolRun } from "../../types";
import { getStatusTextColor } from "../../utils/styleUtils";

interface ProtocolRunCardProps {
  run: ProtocolRun;
  onPause?: (runId: string) => void;
  onResume?: (runId: string) => void;
  onCancel?: (runId: string) => void;
  onRestart?: (runId: string) => void;
}

export const ProtocolRunCard = memo(({ run, onPause, onResume, onCancel, onRestart }: ProtocolRunCardProps) => {
  const currentStepIndex = run.currentStep - 1; // Convert to 0-based index
  const currentStep = run.steps[currentStepIndex];

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">{run.templateName}</h3>
          <p className="text-sm text-slate-400">Running on {run.deviceName}</p>
          {run.initiatedBy && (
            <p className="text-xs text-slate-500 mt-1">Initiated by: {run.initiatedBy}</p>
          )}
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusTextColor(run.status)}`}>
          {run.status}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-400">Progress</span>
          <span className="text-sm font-semibold">{run.progress}%</span>
        </div>
        <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${run.progress}%` }}
          />
        </div>
      </div>

      {/* Current Step Display */}
      {(run.status === "running" || run.status === "paused") && currentStep && (
        <div className="mb-4 p-3 bg-blue-900/30 border border-blue-700/50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            {run.status === "running" ? (
              <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
            ) : (
              <Circle className="w-4 h-4 text-yellow-400" />
            )}
            <span className="text-sm font-semibold text-blue-400">
              {run.status === "running" ? "Executing" : "Paused at"} Step {run.currentStep}
            </span>
          </div>
          <div className="text-sm text-slate-300">
            <span className="font-mono text-blue-400">{currentStep.source}</span>
            <span className="mx-2">→</span>
            <span className="font-mono text-blue-400">{currentStep.destination}</span>
            <span className="ml-2 text-slate-400">({currentStep.volume}µL)</span>
            {currentStep.mixCycles && (
              <span className="ml-2 text-slate-400">• Mix: {currentStep.mixCycles}x</span>
            )}
          </div>
        </div>
      )}

      {/* Steps List */}
      <div className="mb-4">
        <div className="text-sm font-semibold mb-3 text-slate-300">Protocol Steps</div>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {run.steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < run.currentStep || (stepNumber === run.currentStep && run.status === "completed");
            const isCurrent = stepNumber === run.currentStep && (run.status === "running" || run.status === "paused");

            return (
              <div
                key={step.id}
                className={`flex items-center gap-3 p-2 rounded ${
                  isCurrent
                    ? "bg-blue-900/30 border border-blue-700/50"
                    : isCompleted
                    ? "bg-green-900/20 border border-green-700/30"
                    : "bg-slate-900/50 border border-slate-700/50"
                }`}
              >
                <div className="flex-shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : isCurrent ? (
                    <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm">
                    <span className="font-semibold text-slate-300">Step {stepNumber}:</span>{" "}
                    <span className="font-mono text-slate-400">{step.source}</span>
                    <span className="mx-1 text-slate-500">→</span>
                    <span className="font-mono text-slate-400">{step.destination}</span>
                    <span className="ml-2 text-slate-500">({step.volume}µL)</span>
                  </div>
                  {step.mixCycles && (
                    <div className="text-xs text-slate-500 mt-1">Mix cycles: {step.mixCycles}</div>
                  )}
                </div>
                {isCurrent && (
                  <span className="text-xs px-2 py-1 bg-blue-600 rounded text-white font-semibold">
                    Executing
                  </span>
                )}
                {isCompleted && (
                  <span className="text-xs px-2 py-1 bg-green-600 rounded text-white font-semibold">
                    Done
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-400">
          Step {run.currentStep} of {run.totalSteps}
        </div>
        <div className="flex gap-2">
          {run.status === "running" && onPause && (
            <button
              onClick={() => onPause(run.id)}
              className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded text-xs font-semibold transition"
            >
              Pause
            </button>
          )}
          {run.status === "paused" && onResume && (
            <button
              onClick={() => onResume(run.id)}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-xs font-semibold transition"
            >
              Resume
            </button>
          )}
          {(run.status === "cancelled" || run.status === "completed") && onRestart && (
            <button
              onClick={() => onRestart(run.id)}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs font-semibold transition"
            >
              Run Again
            </button>
          )}
          {(run.status === "running" || run.status === "paused") && onCancel && (
            <button
              onClick={() => onCancel(run.id)}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-xs font-semibold transition"
            >
              Stop
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

ProtocolRunCard.displayName = "ProtocolRunCard";

