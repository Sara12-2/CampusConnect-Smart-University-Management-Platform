"use client";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Image as ImageIcon, AlertCircle } from "lucide-react";
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
  const inputRef = useRef<HTMLInputElement>(null);

  const isImage = accept.includes("image");

  const handleFile = (f: File | null) => {
    setLocalError("");
    if (!f) return;

    // Validate size
    if (f.size > maxSizeMB * 1024 * 1024) {
      setLocalError(`File size ${maxSizeMB}MB se kam honi chahiye.`);
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

  const shownError = error || localError;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          {label}
        </label>
      )}

      <AnimatePresence mode="wait">
        {!file ? (
          <motion.label
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              "block border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer",
              shownError
                ? "border-red-300 bg-red-50/40"
                : "border-slate-300 hover:border-orange-400 hover:bg-orange-50/40"
            )}
          >
            <input
              ref={inputRef}
              type="file"
              accept={accept}
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            />
            <Upload
              className={cn(
                "mx-auto mb-2 transition-colors",
                shownError ? "text-red-400" : "text-slate-400"
              )}
              size={24}
            />
            <p className="text-sm text-slate-600 font-medium">
              Click to upload
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {isImage ? "JPG, PNG, GIF" : "Any file"} — max {maxSizeMB}MB
            </p>
          </motion.label>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center gap-4 p-4 rounded-xl border-2 border-green-300 bg-green-50/50"
          >
            {previewUrl && isImage ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-16 h-16 rounded-lg object-cover ring-2 ring-white shadow-sm"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-green-500 text-white flex items-center justify-center">
                <ImageIcon size={24} />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">
                {file.name}
              </p>
              <p className="text-xs text-slate-500">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-all shrink-0"
              aria-label="Remove"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {shownError && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1 text-xs text-red-500 mt-1.5"
        >
          <AlertCircle size={12} /> {shownError}
        </motion.p>
      )}
    </div>
  );
}