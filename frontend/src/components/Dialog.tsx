"use client";

import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface MessageProps {
  messageHeading: string;
  messageType: "success" | "error" | "warn";
  messageContent: string;
  onClose: () => void;
  autoClose?: boolean; // optional auto close
  autoCloseDelay?: number; // delay in ms
}

const MessageBox = ({
  messageHeading,
  messageType,
  messageContent,
  onClose,
  autoClose = false,
  autoCloseDelay = 4000,
}: MessageProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const styles = {
    success: {
      container: "bg-green-100 border border-green-400 text-green-800",
      icon: (
        <FaCheckCircle className="w-5 h-5 text-green-600" aria-hidden="true" />
      ),
    },
    error: {
      container: "bg-red-100 border border-red-400 text-red-800",
      icon: (
        <FaTimesCircle className="w-5 h-5 text-red-600" aria-hidden="true" />
      ),
    },
    warn: {
      container: "bg-yellow-100 border border-yellow-400 text-yellow-800",
      icon: (
        <FaExclamationTriangle
          className="w-5 h-5 text-yellow-600"
          aria-hidden="true"
        />
      ),
    },
  };

  // Focus trap & restore previous focus
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement;
    closeButtonRef.current?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
      // Simple focus trap (Tab and Shift+Tab)
      if (e.key === "Tab") {
        if (!dialogRef.current) return;
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [onClose]);

  // Auto close effect
  useEffect(() => {
    if (!autoClose) return;
    const timer = setTimeout(onClose, autoCloseDelay);
    return () => clearTimeout(timer);
  }, [autoClose, autoCloseDelay, onClose]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-60 backdrop-blur-sm z-50"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="dialog-heading"
      aria-describedby="dialog-content"
    >
      <motion.div
        ref={dialogRef}
        tabIndex={-1}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className={`max-w-md w-full p-5 rounded-lg shadow-xl flex flex-col gap-3 ${styles[messageType].container}`}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {styles[messageType].icon}
            <h3 id="dialog-heading" className="text-lg font-semibold">
              {messageHeading}
            </h3>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="text-gray-600 hover:text-black transition-colors text-lg cursor-pointer"
            title="Close"
            type="button"
            aria-label="Close dialog"
          >
            ✖
          </button>
        </div>
        <div
          id="dialog-content"
          className="text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: messageContent }}
        />
      </motion.div>
    </div>
  );
};

interface DialogContextType {
  success: (heading: string, content: string, autoClose?: boolean) => void;
  error: (heading: string, content: string, autoClose?: boolean) => void;
  warn: (heading: string, content: string, autoClose?: boolean) => void;
}

const DialogContext = createContext<DialogContextType | null>(null);

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) throw new Error("useDialog must be used within DialogProvider");
  return context;
};

const DialogProvider = ({ children }: { children: ReactNode }) => {
  const [dialog, setDialog] = useState<Omit<MessageProps, "onClose"> | null>(
    null
  );

  // Prevent background scroll while dialog is open
  useEffect(() => {
    if (dialog) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [dialog]);

  const showDialog = useCallback(
    (
      type: MessageProps["messageType"],
      heading: string,
      content: string,
      autoClose = false
    ) => {
      setDialog({
        messageType: type,
        messageHeading: heading,
        messageContent: content,
        autoClose,
      });
    },
    []
  );

  const closeDialog = () => setDialog(null);

  const contextValue: DialogContextType = {
    success: (heading, content, autoClose = true) =>
      showDialog("success", heading, content, autoClose),
    error: (heading, content, autoClose = false) =>
      showDialog("error", heading, content, autoClose),
    warn: (heading, content, autoClose = false) =>
      showDialog("warn", heading, content, autoClose),
  };

  return (
    <DialogContext.Provider value={contextValue}>
      {children}
      <AnimatePresence>
        {dialog && <MessageBox {...dialog} onClose={closeDialog} />}
      </AnimatePresence>
    </DialogContext.Provider>
  );
};

export default DialogProvider;
