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
    <div className="group relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-lg hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-0.5">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative flex items-center justify-between mb-5">
        <div>
          <h3 className="text-xl font-bold text-slate-100 mb-1">{run.templateName}</h3>
          <p className="text-sm text-slate-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            Running on {run.deviceName}
          </p>
          {run.initiatedBy && (
            <p className="text-xs text-slate-500 mt-1.5">Initiated by: <span className="text-slate-400">{run.initiatedBy}</span></p>
          )}
        </div>
        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg ${getStatusTextColor(run.status)}`}>
          {run.status}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-slate-400">Progress</span>
          <span className="text-sm font-bold text-blue-400">{run.progress}%</span>
        </div>
        <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 transition-all duration-500 shadow-lg shadow-blue-500/30"
            style={{ width: `${run.progress}%` }}
          />
        </div>
      </div>

      {/* Current Step Display */}
      {(run.status === "running" || run.status === "paused") && currentStep && (
        <div className="mb-5 p-4 bg-gradient-to-r from-blue-900/40 to-cyan-900/20 border border-blue-700/30 rounded-xl backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-3">
            {run.status === "running" ? (
              <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
            ) : (
              <Circle className="w-5 h-5 text-yellow-400 fill-yellow-400/20" />
            )}
            <span className="text-sm font-bold text-blue-300">
              {run.status === "running" ? "Executing" : "Paused at"} Step {run.currentStep}
            </span>
          </div>
          <div className="text-sm text-slate-200">
            <span className="font-mono text-blue-400 font-semibold">{currentStep.source}</span>
            <span className="mx-2 text-slate-500">→</span>
            <span className="font-mono text-green-400 font-semibold">{currentStep.destination}</span>
            <span className="ml-2 text-slate-400">({currentStep.volume}µL)</span>
            {currentStep.mixCycles && (
              <span className="ml-2 text-slate-400">• Mix: {currentStep.mixCycles}x</span>
            )}
          </div>
        </div>
      )}

      {/* Steps List */}
      <div className="mb-5">
        <div className="text-sm font-bold mb-4 text-slate-300 flex items-center gap-2">
          <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
          Protocol Steps
        </div>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
          {run.steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < run.currentStep || (stepNumber === run.currentStep && run.status === "completed");
            const isCurrent = stepNumber === run.currentStep && (run.status === "running" || run.status === "paused");

            return (
              <div
                key={step.id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  isCurrent
                    ? "bg-gradient-to-r from-blue-900/40 to-cyan-900/20 border border-blue-700/40 shadow-md shadow-blue-500/10"
                    : isCompleted
                    ? "bg-green-900/20 border border-green-700/30"
                    : "bg-slate-900/50 border border-slate-700/30 hover:border-slate-600/50"
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
              className="px-4 py-2 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 rounded-lg text-xs font-bold transition-all shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/30 hover:-translate-y-0.5"
            >
              Pause
            </button>
          )}
          {run.status === "paused" && onResume && (
            <button
              onClick={() => onResume(run.id)}
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg text-xs font-bold transition-all shadow-lg shadow-green-500/20 hover:shadow-green-500/30 hover:-translate-y-0.5"
            >
              Resume
            </button>
          )}
          {(run.status === "cancelled" || run.status === "completed") && onRestart && (
            <button
              onClick={() => onRestart(run.id)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg text-xs font-bold transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:-translate-y-0.5"
            >
              Run Again
            </button>
          )}
          {(run.status === "running" || run.status === "paused") && onCancel && (
            <button
              onClick={() => onCancel(run.id)}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 rounded-lg text-xs font-bold transition-all shadow-lg shadow-red-500/20 hover:shadow-red-500/30 hover:-translate-y-0.5"
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

