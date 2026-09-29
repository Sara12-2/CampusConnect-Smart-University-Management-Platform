"use client";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, X, Image as ImageIcon, AlertCircle, CheckCircle2,
  FileText, CloudUpload, Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  label?: string;
  accept?: string;
  maxSizeMB?: number;
  onFileSelect?: (file: File | null) => void;
  error?: string;
  preview?: boolean;
}

export default function FileUpload({
  label = "Upload File",
  accept = "image/*",
  maxSizeMB = 5,
  onFileSelect,
  error,
  preview = true,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [localError, setLocalError] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isImage = accept.includes("image");

  /* ============================================================
     HANDLERS
     ============================================================ */
  const handleFile = (f: File | null) => {
    setLocalError("");
    if (!f) return;

    // Validate size
    if (f.size > maxSizeMB * 1024 * 1024) {
      setLocalError(`File size must be under ${maxSizeMB}MB.`);
      return;
    }

    setFile(f);
    onFileSelect?.(f);

    if (isImage && preview) {
      const url = URL.createObjectURL(f);
      setPreviewUrl(url);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setPreviewUrl(null);
    setLocalError("");
    onFileSelect?.(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) handleFile(droppedFile);
  };

  const shownError = error || localError;

  /* ============================================================
     RENDER
     ============================================================ */
  return (
    <div className="w-full">
      {/* ============ LABEL ============ */}
      {label && (
        <label className="block text-sm font-bold text-[#0f1d17] mb-2 
          flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-[#E67E22]" />
          {label}
        </label>
      )}

      <AnimatePresence mode="wait">
        {!file ? (
          /* ============================================================
             UPLOAD AREA (empty state)
             ============================================================ */
          <motion.label
            key="upload"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "group relative block border-2 border-dashed rounded-2xl p-6 md:p-8 text-center",
              "cursor-pointer transition-all duration-300 overflow-hidden",
              shownError
                ? "border-[#dc3545]/40 bg-[#fdeaea]/40"
                : dragging
                ? "border-[#E67E22] bg-[#fdf2e3]"
                : "border-[#e2ebe6] hover:border-[#227736]/40 hover:bg-[#f8faf9]"
            )}
          >
            {/* Hidden input */}
            <input
              ref={inputRef}
              type="file"
              accept={accept}
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            />

            {/* Corner accent */}
            <div className="absolute top-0 right-0 w-20 h-20 rounded-bl-full 
              bg-[#227736]/5 opacity-0 group-hover:opacity-100 
              transition-opacity duration-500 pointer-events-none" />

            {/* Animated rings (hover) */}
            {!shownError && (
              <>
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0, 0.15] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
                  className="absolute inset-0 rounded-2xl bg-[#E67E22]/10 
                    pointer-events-none"
                />
              </>
            )}

            <div className="relative">
              {/* ============ ICON BOX ============ */}
              <motion.div
                animate={dragging ? { scale: 1.15, rotate: 5 } : { scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={cn(
                  "mx-auto w-14 h-14 rounded-2xl flex items-center justify-center mb-3",
                  "transition-all duration-300 shadow-md",
                  shownError
                    ? "bg-gradient-to-br from-[#dc3545] to-[#c82333] shadow-[#dc3545]/25"
                    : dragging
                    ? "bg-gradient-to-br from-[#E67E22] to-[#D35400] shadow-[#E67E22]/40"
                    : "bg-gradient-to-br from-[#227736] to-[#28a745] shadow-[#227736]/25 group-hover:shadow-lg group-hover:shadow-[#227736]/30"
                )}
              >
                {dragging ? (
                  <CloudUpload size={24} className="text-white" strokeWidth={2.2} />
                ) : shownError ? (
                  <AlertCircle size={24} className="text-white" strokeWidth={2.2} />
                ) : (
                  <Upload size={24} className="text-white" strokeWidth={2.2} />
                )}
              </motion.div>

              {/* ============ TEXT ============ */}
              <p className={cn(
                "text-sm font-bold mb-1",
                shownError ? "text-[#dc3545]" : "text-[#0f1d17]"
              )}>
                {dragging ? "Drop your file here" : "Click to upload"}
              </p>

              <p className="text-xs text-[#5a6e63] leading-relaxed">
                {isImage ? "JPG, PNG, or GIF" : "Any file type"}
                <span className="mx-1.5 text-[#e2ebe6]">•</span>
                Max {maxSizeMB}MB
              </p>

              <p className="text-[10px] text-[#5a6e63]/60 mt-1 font-medium">
                Or drag and drop
              </p>
            </div>
          </motion.label>
        ) : (
          /* ============================================================
             PREVIEW STATE (file selected)
             ============================================================ */
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex items-center gap-4 p-4 rounded-2xl 
              border-2 border-[#c8e6d1] bg-[#eaf6ee]/50 overflow-hidden"
          >
            {/* Left accent bar */}
            <span className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full 
              bg-gradient-to-b from-[#227736] to-[#28a745]" />

            {/* ============ PREVIEW IMAGE ============ */}
            {previewUrl && isImage ? (
              <motion.img
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                src={previewUrl}
                alt="Preview"
                className="relative w-16 h-16 rounded-xl object-cover 
                  ring-2 ring-white shadow-md shrink-0 ml-1.5"
              />
            ) : (
              <div className="relative w-16 h-16 rounded-xl 
                bg-gradient-to-br from-[#227736] to-[#28a745] 
                text-white flex items-center justify-center 
                shadow-md shadow-[#227736]/25 shrink-0 ml-1.5">
                {isImage ? (
                  <ImageIcon size={24} strokeWidth={2.2} />
                ) : (
                  <FileText size={24} strokeWidth={2.2} />
                )}
              </div>
            )}

            {/* ============ FILE INFO ============ */}
            <div className="relative flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <CheckCircle2
                  size={11}
                  className="text-[#227736] shrink-0"
                  strokeWidth={2.5}
                />
                <span className="text-[10px] font-bold text-[#227736] 
                  uppercase tracking-wider">
                  Ready
                </span>
              </div>
              <p className="text-sm font-bold text-[#0f1d17] truncate">
                {file.name}
              </p>
              <p className="text-xs text-[#5a6e63] mt-0.5">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>

            {/* ============ REMOVE BUTTON ============ */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleRemove}
              className="relative p-2 rounded-xl text-[#dc3545] 
                hover:bg-[#fdeaea] hover:border hover:border-[#f5c2c7]
                transition-all duration-300 shrink-0"
              aria-label="Remove file"
            >
              <X size={16} strokeWidth={2.5} />
            </motion.button>

            {/* Sparkle accent */}
            <motion.div
              animate={{ opacity: [0, 1, 0], scale: [0.8, 1.1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-2 right-2 text-[#E67E22]/40 pointer-events-none"
            >
              <Sparkles size={12} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============ ERROR MESSAGE ============ */}
      <AnimatePresence>
        {shownError && (
          <motion.div
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            className="overflow-hidden"
          >
            <p className="flex items-center gap-1.5 text-xs text-[#dc3545] 
              mt-2 font-medium">
              <AlertCircle size={12} strokeWidth={2.5} />
              {shownError}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}