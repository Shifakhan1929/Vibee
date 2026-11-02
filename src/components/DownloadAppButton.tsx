import { Download } from "lucide-react";
import { triggerPwaInstall } from "./AppInstallModal";

export interface DownloadAppButtonProps {
  /** Display variant: 'pill' (icon + text), 'icon' (circular icon button), 'topbar' (styled for navbar) */
  variant?: "pill" | "icon" | "topbar";
  /** Optional custom class name */
  className?: string;
  /** Custom label text (default: "Download App") */
  label?: string;
  /** Custom tooltip title */
  title?: string;
}

export function DownloadAppButton({
  variant = "topbar",
  className = "",
  label = "Download App",
  title = "Install Vibe App (Web & Mobile)",
}: DownloadAppButtonProps) {
  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={triggerPwaInstall}
        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all cursor-pointer bg-white/80 hover:bg-white border border-[#dbe6f7] hover:border-[#0a6cf0]/50 text-[#0b1f4b] hover:text-[#0a6cf0] relative group shadow-sm hover:shadow-md ${className}`}
        title={title}
        aria-label={title}
      >
        <Download className="w-4 h-4 text-[#0a6cf0] group-hover:scale-110 transition-transform" />
        <span className="sr-only">{label}</span>
      </button>
    );
  }

  if (variant === "pill") {
    return (
      <button
        type="button"
        onClick={triggerPwaInstall}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-[#f6faff] border border-[#dbe6f7] hover:border-[#0a6cf0] text-[#0b1f4b] hover:text-[#0a6cf0] text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer group ${className}`}
        title={title}
        aria-label={title}
      >
        <Download className="w-4 h-4 text-[#0a6cf0] group-hover:scale-110 transition-transform" />
        <span>{label}</span>
      </button>
    );
  }

  // "topbar" variant - matches existing navbar buttons
  return (
    <button
      type="button"
      onClick={triggerPwaInstall}
      className={`vibe-download-topbar-btn track topbar-btn ${className}`}
      title={title}
      aria-label={title}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "5px 13px",
        fontSize: "13px",
        fontWeight: "700",
        color: "#0a6cf0",
        backgroundColor: "#f0f7ff",
        border: "1px solid #bfdbfe",
        borderRadius: "16px",
        marginRight: "8px",
        textDecoration: "none",
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
    >
      <Download style={{ width: "14px", height: "14px", color: "#0a6cf0" }} />
      <span>{label}</span>
    </button>
  );
}

