"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Slider } from "@/components/ui/slider"
import { Camera, Upload, ZoomIn, RotateCw, X } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface AvatarUploadProps {
  currentAvatar?: string
  initials: string
  onUpload: (file: File) => Promise<void>
}

export function AvatarUpload({ currentAvatar, initials, onUpload }: AvatarUploadProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [zoom, setZoom] = useState([1])
  const [rotation, setRotation] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB")
      return
    }

    setSelectedFile(file)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    setZoom([1])
    setRotation(0)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }, [handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    try {
      await onUpload(selectedFile)
      toast.success("Avatar updated successfully!")
      handleClose()
    } catch {
      toast.error("Failed to upload avatar")
    } finally {
      setIsUploading(false)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setSelectedFile(null)
    setPreviewUrl(null)
    setZoom([1])
    setRotation(0)
  }

  const rotateImage = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  return (
    <>
      {/* Avatar with Edit Button */}
      <div className="relative group">
        <Avatar className="h-24 w-24 border-2 border-[#27272A]">
          <AvatarImage src={currentAvatar} />
          <AvatarFallback className="bg-[#27272A] text-teal text-2xl">
            {initials}
          </AvatarFallback>
        </Avatar>
        <button
          onClick={() => setIsOpen(true)}
          className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Camera className="h-6 w-6 text-white" />
        </button>
      </div>

      {/* Upload Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-[#18181B] border-[#27272A] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#FAFAFA]">Update Profile Photo</DialogTitle>
            <DialogDescription className="text-[#A1A1AA]">
              Upload a new avatar image. Supports JPG, PNG, GIF up to 5MB.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {!previewUrl ? (
              /* Drop Zone */
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                  isDragging
                    ? "border-teal bg-teal/5"
                    : "border-[#27272A] hover:border-[#3F3F46]"
                )}
              >
                <Upload className="h-10 w-10 text-[#71717A] mx-auto mb-4" />
                <p className="text-[#FAFAFA] font-medium mb-1">
                  Drag and drop your image here
                </p>
                <p className="text-sm text-[#71717A]">or click to browse</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleInputChange}
                  className="hidden"
                />
              </div>
            ) : (
              /* Preview & Edit */
              <div className="space-y-4">
                {/* Image Preview */}
                <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden bg-[#0A0A0B] border border-[#27272A]">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    style={{
                      transform: `scale(${zoom[0]}) rotate(${rotation}deg)`,
                      transformOrigin: "center",
                    }}
                  />
                  <button
                    onClick={() => {
                      setSelectedFile(null)
                      setPreviewUrl(null)
                    }}
                    className="absolute top-2 right-2 p-1 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                </div>

                {/* Controls */}
                <div className="space-y-4">
                  {/* Zoom */}
                  <div className="flex items-center gap-4">
                    <ZoomIn className="h-4 w-4 text-[#71717A]" />
                    <Slider
                      value={zoom}
                      onValueChange={setZoom}
                      min={1}
                      max={3}
                      step={0.1}
                      className="flex-1"
                    />
                    <span className="text-sm text-[#71717A] w-12 text-right">
                      {(zoom[0] * 100).toFixed(0)}%
                    </span>
                  </div>

                  {/* Rotate */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={rotateImage}
                    className="w-full border-[#27272A] text-[#A1A1AA]"
                  >
                    <RotateCw className="mr-2 h-4 w-4" />
                    Rotate 90°
                  </Button>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              className="border-[#27272A] text-[#A1A1AA]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="bg-teal hover:bg-teal/90 text-[#09090B]"
            >
              {isUploading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-[#09090B] border-t-transparent" />
                  Uploading...
                </>
              ) : (
                "Save Photo"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
