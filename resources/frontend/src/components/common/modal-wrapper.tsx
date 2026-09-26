import {
  forwardRef,
  useState,
  useEffect,
  type ReactNode,
  type MouseEvent,
  useImperativeHandle,
} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

type ModalWrapperProps = {
  title?: string;
  onHide?: () => void;
  width?: string;
  children: ReactNode;
};

export type ModalWrapperRef = {
  open: () => void;
  close: () => void;
};

export const ModalWrapper = forwardRef<ModalWrapperRef, ModalWrapperProps>(
  ({ title, onHide, width = "max-w-md", children }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
      return () => setMounted(false);
    }, []);

    useImperativeHandle(ref, () => ({
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }));

    const handleClose = () => {
      setIsOpen(false);
      if (onHide) onHide();
    };

    const handlePropagation = (e: MouseEvent) => {
      e.stopPropagation();
    };

    if (!mounted) return null;

    const portalTarget = document.getElementById("modal");
    if (!portalTarget) return null;

    return createPortal(
      <AnimatePresence>
        {isOpen && (
          <motion.div
            style={{ zIndex: 9999 }}
            className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-xs"
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}>
            <motion.div
              className={`bg-white dark:bg-gray-800 p-2 md:p-4 shadow-sm rounded-lg w-full relative ${width}`}
              onClick={handlePropagation}
              initial={{ opacity: 0, scale: 0.9, y: -30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -30 }}
              transition={{ duration: 0.25 }}>
              <div className="flex justify-between items-center mb-2 md:mb-4">
                <h2 className="text-base md:text-xl font-semibold text-foreground dark:text-gray-200 line-clamp-1">
                  {title}
                </h2>
                <button
                  onClick={handleClose}
                  className="text-muted-foreground dark:text-gray-300 hover:text-foreground dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200 w-8 h-8 cursor-pointer flex items-center justify-center">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div
                className="bg-background dark:bg-gray-800 h-auto overflow-y-auto"
                style={{ maxHeight: "80vh" }}>
                {children}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      portalTarget
    );
  }
);

ModalWrapper.displayName = "ModalWrapper";
