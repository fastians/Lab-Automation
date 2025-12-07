import { X, CheckCircle, Info, AlertTriangle } from "lucide-react";
import { useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "info" | "warning";
  onClose: () => void;
  duration?: number;
}

export const Toast = ({ message, type = "info", onClose, duration = 4000 }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const icons = {
    success: CheckCircle,
    info: Info,
    warning: AlertTriangle,
  };

  const colors = {
    success: "from-green-500/20 to-green-600/10 border-green-500/30",
    info: "from-blue-500/20 to-blue-600/10 border-blue-500/30",
    warning: "from-yellow-500/20 to-yellow-600/10 border-yellow-500/30",
  };

  const iconColors = {
    success: "text-green-400",
    info: "text-blue-400",
    warning: "text-yellow-400",
  };

  const Icon = icons[type];

  return (
    <div
      className={`fixed top-6 right-6 z-50 bg-gradient-to-br ${colors[type]} backdrop-blur-lg border rounded-xl p-4 shadow-2xl animate-slide-in-right min-w-[320px] max-w-md`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${iconColors[type]} flex-shrink-0 mt-0.5`} />
        <p className="text-sm text-slate-200 flex-1 leading-relaxed">{message}</p>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
