"use client"

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, Loader2, X, ImageIcon } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ImageUploadProps {
  label: string
  value: string
  onChange: (url: string) => void
  placeholder?: string
  required?: boolean
}

export function ImageUpload({ 
  label, 
  value, 
  onChange, 
  placeholder = "Seleccionar imagen...",
  required = false 
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const uploadFile = async (file: File) => {
    if (!file) return

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Solo se permiten archivos de imagen",
        variant: "destructive"
      })
      return
    }

    // Validar tamaño (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "La imagen no puede ser mayor a 5MB",
        variant: "destructive"
      })
      return
    }

    try {
      setIsUploading(true)

      // Crear nombre único para el archivo
      const timestamp = Date.now()
      const extension = file.name.split('.').pop()
      const filename = `product-${timestamp}.${extension}`

      const response = await fetch(`/api/upload?filename=${filename}`, {
        method: 'POST',
        body: file,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al subir imagen')
      }

      const data = await response.json()
      onChange(data.url)
      
      toast({
        title: "Imagen subida",
        description: "La imagen se ha subido exitosamente",
      })
    } catch (error) {
      console.error('Error uploading image:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Error al subir imagen',
        variant: "destructive"
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      uploadFile(file)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0])
    }
  }

  const handleUrlChange = (url: string) => {
    if (!url) {
      onChange('')
      return
    }

    // Validar que la URL termine en .jpg, .jpeg o .png
    const validExtensions = ['.jpg', '.jpeg', '.png']
    const isValidUrl = validExtensions.some(ext => 
      url.toLowerCase().endsWith(ext)
    )

    if (!isValidUrl && url.trim() !== '') {
      toast({
        title: "URL no válida",
        description: "La URL debe terminar en .jpg, .jpeg o .png",
        variant: "destructive"
      })
      return
    }

    onChange(url)
  }

  const clearImage = () => {
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label} {required && <span className="text-destructive">*</span>}</Label>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Upload Area */}
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer
            ${dragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25 hover:border-primary/50'}
            ${isUploading ? 'pointer-events-none opacity-50' : ''}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />
          
          <div className="flex flex-col items-center justify-center text-center">
            {isUploading ? (
              <>
                <Loader2 className="h-8 w-8 animate-spin mb-2" />
                <p className="text-sm text-muted-foreground">Subiendo imagen...</p>
              </>
            ) : (
              <>
                <ImageIcon className="h-8 w-8 mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">Subir imagen</p>
                <p className="text-xs text-muted-foreground">
                  Arrastra aquí o haz clic para seleccionar
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG hasta 5MB
                </p>
              </>
            )}
          </div>
        </div>

        {/* Preview Area */}
        <div className="space-y-2">
          {value && (
            <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/placeholder.jpg'
                }}
              />
              <button
                type="button"
                onClick={clearImage}
                className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          
          <div>
            <Label htmlFor={`url-${label}`} className="text-sm">O pegar URL de imagen</Label>
            <div className="flex gap-2">
              <Input
                id={`url-${label}`}
                value={value}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://ejemplo.com/imagen.jpg"
                disabled={isUploading}
              />
              {value && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearImage}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Solo URLs que terminen en .jpg, .jpeg o .png
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}