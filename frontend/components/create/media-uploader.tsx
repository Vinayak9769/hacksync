"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Video, X, Upload } from "lucide-react"
import { cn } from "@/lib/utils"

interface MediaFile {
  id: string
  type: "image" | "video"
  url: string
  name: string
}

interface MediaUploaderProps {
  files: MediaFile[]
  onFilesChange: (files: MediaFile[]) => void
}

export function MediaUploader({ files, onFilesChange }: MediaUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const droppedFiles = Array.from(e.dataTransfer.files)
      const mediaFiles: MediaFile[] = droppedFiles
        .filter((file) => file.type.startsWith("image/") || file.type.startsWith("video/"))
        .map((file) => ({
          id: Math.random().toString(36).substr(2, 9),
          type: file.type.startsWith("image/") ? "image" : "video",
          url: URL.createObjectURL(file),
          name: file.name,
        }))

      onFilesChange([...files, ...mediaFiles])
    },
    [files, onFilesChange],
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return

      const selectedFiles = Array.from(e.target.files)
      const mediaFiles: MediaFile[] = selectedFiles.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        type: file.type.startsWith("image/") ? "image" : "video",
        url: URL.createObjectURL(file),
        name: file.name,
      }))

      onFilesChange([...files, ...mediaFiles])
    },
    [files, onFilesChange],
  )

  const removeFile = useCallback(
    (id: string) => {
      onFilesChange(files.filter((f) => f.id !== id))
    },
    [files, onFilesChange],
  )

  return (
    <div className="space-y-3">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-border bg-secondary/30",
        )}
      >
        <input
          type="file"
          id="media-upload"
          className="hidden"
          multiple
          accept="image/*,video/*"
          onChange={handleFileSelect}
        />
        <label htmlFor="media-upload" className="cursor-pointer">
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Drag and drop files here, or <span className="text-primary underline">browse</span>
            </p>
            <p className="text-xs text-muted-foreground">Supports images and videos up to 100MB</p>
          </div>
        </label>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {files.map((file) => (
            <Card key={file.id} className="relative group overflow-hidden bg-secondary/50">
              <div className="aspect-square relative">
                {file.type === "image" ? (
                  <img src={file.url || "/placeholder.svg"} alt={file.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-secondary">
                    <Video className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeFile(file.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <div className="p-2">
                <p className="text-xs truncate text-muted-foreground">{file.name}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export type { MediaFile }
