import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'
import { UploadCloud } from 'lucide-react'
import { useRef, useState } from 'react'
import type { DragEvent, ChangeEvent } from 'react'

interface ImageUploadProps {
  label?: string
  error?: string
  value?: string
  onChange: (url: string) => void
  onRemove: () => void
  onFileChange?: (file: File) => void
  previewAlt?: string
  required?: boolean
}

export function ImageUpload({
  label,
  error,
  value,
  required,
  onChange,
  onRemove,
  onFileChange,
  previewAlt = 'Preview',
}: ImageUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return

    const reader = new FileReader()

    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : ''
      onChange(dataUrl)
    }

    reader.onerror = () => {
      console.error('Failed to read image file for preview')
    }

    reader.readAsDataURL(file)

    // Optional real file callback
    onFileChange?.(file)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragActive(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragActive(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragActive(false)

    const file = e.dataTransfer.files?.[0]

    if (file) {
      handleFile(file)
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file) {
      handleFile(file)
    }
  }

  const handleRemove = () => {
    onRemove()

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && (
            <span className="ml-1 text-red-500">
              *
            </span>
          )}
        </label>
      )}

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all min-h-[160px]',
          isDragActive
            ? 'border-orange-500 bg-orange-500/5 dark:border-orange-400 dark:bg-orange-400/5'
            : 'border-gray-300 bg-white hover:border-orange-500/50 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-orange-400/50',
          error && 'border-red-500 hover:border-red-500/80 dark:border-red-500'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {value ? (
          <div className="relative group w-full max-w-[200px] h-[150px] overflow-hidden rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
            <img
              src={value}
              alt={previewAlt}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity gap-2">
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemove()
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <UploadCloud className="h-10 w-10 text-gray-400 dark:text-gray-500" />

            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Click to upload or drag & drop
              </p>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                PNG, JPG, or WEBP up to 5MB
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}