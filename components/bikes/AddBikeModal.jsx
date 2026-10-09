"use client";

import { useEffect } from "react";
import AddBikeForm from "./AddBikeForm";

export default function AddBikeModal({ isOpen, onClose, onBikeAdded }) {
  // Prevent page background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSuccess = (newBike) => {
    if (onBikeAdded) {
      onBikeAdded(newBike);
    }
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden">
      
      {/* 1. Backdrop Overlay */}
      <div 
        className="fixed inset-0 bg-slate-900/75 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 2. Centered Modal Window */}
      <div className="relative w-full max-w-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
        <AddBikeForm 
          onBikeAdded={handleSuccess} 
          onClose={onClose} 
        />
      </div>

    </div>
  );
}
