import { useState, useEffect, useCallback } from "react";
import { Download, CheckCircle, Share, PlusSquare, Smartphone, X, Monitor, Sparkles } from "lucide-react";

declare global {
  interface Window {
    __vibe_deferred_prompt?: any;
  }
}

/**
 * Dispatch an event to trigger the PWA download / install flow
 * from any button across the app.
 */
export function triggerPwaInstall() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("vibe:trigger_pwa_install"));
  }
}

export function AppInstallModal() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [showDesktopModal, setShowDesktopModal] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    // 1. Service Worker Registration
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      if (
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"
      ) {
        // Clean unregister stale local workers during development if any
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const reg of registrations) {
            reg.unregister();
          }
        });
      } else {
        window.addEventListener("load", () => {
          navigator.serviceWorker
            .register("/sw.js")
            .then((reg) => {
              console.log("[PWA] ServiceWorker registered with scope:", reg.scope);
            })
            .catch((err) => {
              console.warn("[PWA] ServiceWorker registration failed:", err);
            });
        });
      }
    }

    // 2. Check if already installed
    if (typeof window !== "undefined") {
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true;
      setIsStandalone(standalone);

      // 3. Detect iOS Safari
      const isApple =
        /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      setIsIOS(isApple);

      // 4. Check for pre-existing deferred prompt
      if (window.__vibe_deferred_prompt) {
        setDeferredPrompt(window.__vibe_deferred_prompt);
      }
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      window.__vibe_deferred_prompt = e;
      setDeferredPrompt(e);
    };

    const handlePromptReady = () => {
      if (window.__vibe_deferred_prompt) {
        setDeferredPrompt(window.__vibe_deferred_prompt);
      }
    };

    const handleAppInstalled = () => {
      setIsStandalone(true);
      setDeferredPrompt(null);
      window.__vibe_deferred_prompt = null;
      setToastMessage("Vibe was installed successfully!");
      setTimeout(() => setToastMessage(null), 3500);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("vibe:deferred_prompt_ready", handlePromptReady);
    window.addEventListener("appinstalled", handleAppInstalled);
    window.addEventListener("vibe:app_installed", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("vibe:deferred_prompt_ready", handlePromptReady);
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("vibe:app_installed", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = useCallback(async () => {
    // Check if already installed
    if (
      (typeof window !== "undefined" &&
        (window.matchMedia("(display-mode: standalone)").matches ||
          (window.navigator as any).standalone === true)) ||
      isStandalone
    ) {
      setToastMessage("Vibe is already installed on your device!");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    // Check if native install prompt is available (Chrome, Edge, Android)
    const prompt = window.__vibe_deferred_prompt || deferredPrompt;
    if (prompt) {
      try {
        await prompt.prompt();
        const choice = await prompt.userChoice;
        if (choice && choice.outcome === "accepted") {
          console.log("[PWA] User accepted the install prompt");
        }
      } catch (err) {
        console.warn("[PWA] Install prompt error:", err);
      }
      setDeferredPrompt(null);
      window.__vibe_deferred_prompt = null;
      return;
    }

    // If iOS Safari
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    // Desktop or other mobile fallback (e.g. prompt already dismissed or not supported)
    setShowDesktopModal(true);
  }, [deferredPrompt, isIOS, isStandalone]);

  useEffect(() => {
    const handleTrigger = () => {
      handleInstallClick();
    };

    window.addEventListener("vibe:trigger_pwa_install", handleTrigger);
    return () => {
      window.removeEventListener("vibe:trigger_pwa_install", handleTrigger);
    };
  }, [handleInstallClick]);

  return (
    <>
      {/* 1. Sleek Floating Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[99999] bg-[#0b1f4b] text-white border border-[#0a6cf0]/40 text-xs sm:text-sm font-semibold px-5 py-3 rounded-full shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <CheckCircle className="w-4 h-4 text-[#00e0ff] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 2. iOS Installation Sheet Modal */}
      {showIOSModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[99999] bg-black/70 backdrop-blur-md flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowIOSModal(false)}
        >
          <div
            className="w-full max-w-sm bg-white dark:bg-[#0b1f4b] border border-[#dbe6f7] dark:border-[#1e2d4d] rounded-3xl p-6 text-slate-800 dark:text-white shadow-2xl space-y-5 animate-in slide-in-from-bottom-6 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0b1f4b] to-[#0a6cf0] flex items-center justify-center font-black text-white text-base shadow-md shadow-[#0a6cf0]/30">
                  V
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#0b1f4b] dark:text-white">
                    Install Vibe on iPhone / iPad
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Add to your Home Screen in 3 seconds
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowIOSModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Steps */}
            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-3 bg-[#f6faff] dark:bg-white/5 p-3 rounded-2xl border border-[#dbe6f7] dark:border-white/5">
                <div className="w-8 h-8 rounded-xl bg-[#0a6cf0]/15 text-[#0a6cf0] flex items-center justify-center shrink-0">
                  <Share className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#0b1f4b] dark:text-white">Step 1:</span>{" "}
                  Tap the <span className="font-semibold text-[#0a6cf0]">Share</span> button in Safari at the bottom of your screen.
                </div>
              </div>

              <div className="flex items-center gap-3 bg-[#f6faff] dark:bg-white/5 p-3 rounded-2xl border border-[#dbe6f7] dark:border-white/5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <PlusSquare className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#0b1f4b] dark:text-white">Step 2:</span>{" "}
                  Scroll down the options and tap{" "}
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    &ldquo;Add to Home Screen&rdquo;
                  </span>.
                </div>
              </div>

              <div className="flex items-center gap-3 bg-[#f6faff] dark:bg-white/5 p-3 rounded-2xl border border-[#dbe6f7] dark:border-white/5">
                <div className="w-8 h-8 rounded-xl bg-[#0b1f4b]/15 dark:bg-[#00e0ff]/20 text-[#0b1f4b] dark:text-[#00e0ff] flex items-center justify-center shrink-0">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#0b1f4b] dark:text-white">Step 3:</span>{" "}
                  Tap <span className="font-semibold text-[#0b1f4b] dark:text-white">&ldquo;Add&rdquo;</span> at the top right to launch Vibe as a standalone app!
                </div>
              </div>
            </div>

            {/* Dismiss Button */}
            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0b1f4b] to-[#0a6cf0] hover:from-[#081738] hover:to-[#085ac9] text-white text-xs font-bold transition shadow-md shadow-[#0a6cf0]/20 cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* 3. Desktop / Browser Fallback Modal */}
      {showDesktopModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[99999] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowDesktopModal(false)}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-[#0b1f4b] border border-[#dbe6f7] dark:border-[#1e2d4d] rounded-3xl p-6 text-slate-800 dark:text-white shadow-2xl space-y-5 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0b1f4b] to-[#0a6cf0] flex items-center justify-center font-black text-white text-base shadow-md shadow-[#0a6cf0]/30">
                  <Download className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#0b1f4b] dark:text-white">
                    Download & Install Vibe App
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Install for fast offline access & instant updates
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDesktopModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Benefits & Instructions */}
            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="bg-[#f6faff] dark:bg-white/5 p-4 rounded-2xl border border-[#dbe6f7] dark:border-white/5 space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <Monitor className="w-4 h-4 text-[#0a6cf0] mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-[#0b1f4b] dark:text-white">Install via Browser:</span>
                    <p className="mt-0.5 text-slate-500 dark:text-slate-400">
                      Look for the <span className="font-semibold text-[#0a6cf0]">Install App</span> icon (⊕ or ⤓) in your browser address bar, or open the browser menu (⋮) and select <span className="font-semibold text-[#0a6cf0]">&ldquo;Install Vibe&rdquo;</span>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div className="bg-[#f6faff] dark:bg-white/5 p-3 rounded-xl border border-[#dbe6f7] dark:border-white/5 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#00e0ff] shrink-0" />
                  <span className="text-[11.5px] font-medium text-slate-700 dark:text-slate-300">
                    Zero download wait
                  </span>
                </div>
                <div className="bg-[#f6faff] dark:bg-white/5 p-3 rounded-xl border border-[#dbe6f7] dark:border-white/5 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-[#0a6cf0] shrink-0" />
                  <span className="text-[11.5px] font-medium text-slate-700 dark:text-slate-300">
                    Full-screen experience
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDesktopModal(false)}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#0b1f4b] to-[#0a6cf0] hover:from-[#081738] hover:to-[#085ac9] text-white text-xs font-bold transition shadow-md shadow-[#0a6cf0]/20 cursor-pointer"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

