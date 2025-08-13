"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { 
  Upload,
  Loader2,
  X,
  Plus,
  Image as ImageIcon
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ImageManagerProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
}

export function ImageManager({ images, onImagesChange, maxImages = 5 }: ImageManagerProps) {
  const { toast } = useToast()
  const [uploading, setUploading] = useState<number[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [isDragOver, setIsDragOver] = useState(false)

  const handleMultipleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    const imageFiles = fileArray.filter(file => file.type.startsWith('image/'))
    
    if (imageFiles.length === 0) {
      toast({
        title: "Error",
        description: "Solo se permiten archivos de imagen",
        variant: "destructive"
      })
      return
    }

    // Encontrar slots disponibles (incluyendo el principal si está vacío)
    const availableSlots: number[] = []
    
    // Verificar slots existentes
    for (let i = 0; i < images.length; i++) {
      if (!images[i] || images[i].trim() === '') {
        availableSlots.push(i)
      }
    }
    
    // Agregar nuevos slots si es necesario
    const currentLength = images.length
    const slotsNeeded = Math.max(0, imageFiles.length - availableSlots.length)
    const newSlotsToAdd = Math.min(slotsNeeded, maxImages - currentLength)
    
    for (let i = 0; i < newSlotsToAdd; i++) {
      availableSlots.push(currentLength + i)
    }
    
    // Limitar a slots disponibles
    const filesToUpload = imageFiles.slice(0, availableSlots.length)
    
    if (filesToUpload.length < imageFiles.length) {
      toast({
        title: "Advertencia",
        description: `Solo se pueden subir ${filesToUpload.length} de ${imageFiles.length} imágenes. Máximo ${maxImages} imágenes total.`,
        variant: "destructive"
      })
    }

    // Preparar array de imágenes
    const newImages = [...images]
    while (newImages.length < Math.max(images.length, availableSlots[availableSlots.length - 1] + 1)) {
      newImages.push('')
    }
    
    // Subir archivos en paralelo
    const uploadPromises = filesToUpload.map(async (file, fileIndex) => {
      const slotIndex = availableSlots[fileIndex]
      
      try {
        setUploading(prev => [...prev, slotIndex])
        
        // Create preview
        const previewUrl = URL.createObjectURL(file)
        setPreviews(prev => {
          const newPreviews = [...prev]
          newPreviews[slotIndex] = previewUrl
          return newPreviews
        })

        const filename = `products/${Date.now()}-${slotIndex}-${file.name}`
        const response = await fetch(`/api/upload?filename=${filename}`, {
          method: 'POST',
          body: file
        })

        if (!response.ok) {
          throw new Error('Error uploading image')
        }

        const data = await response.json()
        
        if (data.success) {
          newImages[slotIndex] = data.url
          return { success: true, index: slotIndex, url: data.url }
        } else {
          throw new Error(data.error || 'Error uploading image')
        }
      } catch (error) {
        console.error('Upload error:', error)
        
        // Remove preview on error
        setPreviews(prev => {
          const newPreviews = [...prev]
          delete newPreviews[slotIndex]
          return newPreviews
        })
        
        return { success: false, index: slotIndex, error: error instanceof Error ? error.message : 'Error desconocido' }
      } finally {
        setUploading(prev => prev.filter(i => i !== slotIndex))
      }
    })

    const results = await Promise.all(uploadPromises)
    const successful = results.filter(r => r.success).length
    const failed = results.filter(r => !r.success).length

    // Agregar slot vacío adicional si hay espacio y todas las imágenes se subieron
    if (successful > 0 && newImages.length < maxImages && newImages.every(img => img)) {
      newImages.push('')
    }
    
    onImagesChange(newImages)
    
    if (successful > 0) {
      toast({
        title: `${successful} imagen${successful > 1 ? 'es' : ''} subida${successful > 1 ? 's' : ''}`,
        description: failed > 0 ? `${failed} imagen${failed > 1 ? 'es' : ''} falló` : "Imágenes subidas correctamente",
        variant: failed > 0 ? "destructive" : "default"
      })
    }
  }

  const handleFileSelect = async (file: File, index: number) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Solo se permiten archivos de imagen",
        variant: "destructive"
      })
      return
    }

    try {
      setUploading(prev => [...prev, index])
      
      // Create preview
      const previewUrl = URL.createObjectURL(file)
      setPreviews(prev => {
        const newPreviews = [...prev]
        newPreviews[index] = previewUrl
        return newPreviews
      })

      const filename = `products/${Date.now()}-${file.name}`
      const response = await fetch(`/api/upload?filename=${filename}`, {
        method: 'POST',
        body: file
      })

      if (!response.ok) {
        throw new Error('Error uploading image')
      }

      const data = await response.json()
      
      if (data.success) {
        const newImages = [...images]
        newImages[index] = data.url
        
        // Si es la última imagen y no hemos alcanzado el máximo, agregar un slot vacío
        if (index === images.length - 1 && images.length < maxImages) {
          newImages.push('')
        }
        
        onImagesChange(newImages)
        
        toast({
          title: "Imagen subida",
          description: "La imagen se ha subido correctamente",
        })
      } else {
        throw new Error(data.error || 'Error uploading image')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: "Error",
        description: "Error al subir la imagen",
        variant: "destructive"
      })
      
      // Remove preview on error
      setPreviews(prev => {
        const newPreviews = [...prev]
        delete newPreviews[index]
        return newPreviews
      })
    } finally {
      setUploading(prev => prev.filter(i => i !== index))
    }
  }

  const addImageSlot = () => {
    if (images.length >= maxImages) {
      toast({
        title: "Límite alcanzado",
        description: `Máximo ${maxImages} imágenes permitidas`,
        variant: "destructive"
      })
      return
    }
    
    onImagesChange([...images, ''])
  }

  const removeImage = (index: number) => {
    if (index === 0) {
      toast({
        title: "Error",
        description: "La imagen principal no se puede eliminar",
        variant: "destructive"
      })
      return
    }
    
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
    
    // Clean up preview
    setPreviews(prev => {
      const newPreviews = [...prev]
      delete newPreviews[index]
      return newPreviews
    })
  }

  const ImageUploadSlot = ({ index, isRequired = false, showLabel = true }: { index: number, isRequired?: boolean, showLabel?: boolean }) => {
    const currentImage = previews[index] || images[index]
    const isUploading = uploading.includes(index)
    const [slotDragOver, setSlotDragOver] = useState(false)

    const handleSlotDrop = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setSlotDragOver(false)
      
      const files = e.dataTransfer.files
      if (files.length > 0) {
        handleFileSelect(files[0], index)
      }
    }

    const handleSlotDragOver = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setSlotDragOver(true)
    }

    const handleSlotDragLeave = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setSlotDragOver(false)
    }

    return (
      <div className="space-y-2">
        {showLabel && (
          <Label className="text-sm font-medium">
            {index === 0 ? 'Imagen Principal' : `Imagen ${index + 1}`}
            {isRequired && " *"}
          </Label>
        )}
        
        <div
          className={`relative border-2 border-dashed rounded-lg transition-colors cursor-pointer group
            ${slotDragOver 
              ? 'border-primary bg-primary/10' 
              : 'border-muted-foreground/25 hover:border-primary hover:bg-primary/5'
            }`}
          onClick={(e) => {
            e.stopPropagation()
            if (!isUploading) {
              document.getElementById(`file-input-${index}`)?.click()
            }
          }}
          onDrop={handleSlotDrop}
          onDragOver={handleSlotDragOver}
          onDragLeave={handleSlotDragLeave}
        >
          <input
            id={`file-input-${index}`}
            type="file"
            accept="image/*"
            multiple={index === 0}
            className="hidden"
            onChange={(e) => {
              e.stopPropagation()
              const files = e.target.files
              if (files && files.length > 0) {
                if (index === 0) {
                  // Imagen principal: manejar múltiples archivos
                  handleMultipleFiles(files)
                } else {
                  // Slots individuales: manejar un solo archivo
                  handleFileSelect(files[0], index)
                }
              }
              e.target.value = ''
            }}
            disabled={isUploading}
          />
          
          {currentImage ? (
            <div className="relative">
              <div className="aspect-square w-full rounded-lg overflow-hidden bg-muted">
                <img
                  src={currentImage}
                  alt={`Imagen ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = '/placeholder.jpg'
                  }}
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 h-6 w-6 p-0 bg-red-500/10 border-red-500/20 text-red-600 hover:bg-red-500/20 hover:text-red-700"
                onClick={(e) => {
                  e.stopPropagation()
                  
                  if (index === 0) {
                    // Imagen principal: solo limpiar
                    const newImages = [...images]
                    newImages[index] = ''
                    onImagesChange(newImages)
                  } else {
                    // Imagen secundaria: remover slot completo
                    removeImage(index)
                  }
                  
                  // Limpiar preview
                  setPreviews(prev => {
                    const newPreviews = [...prev]
                    delete newPreviews[index]
                    return newPreviews
                  })
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div className="aspect-square flex flex-col items-center justify-center p-4 text-center">
              {isUploading ? (
                <>
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Subiendo...</p>
                </>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-muted-foreground mb-2 group-hover:text-primary transition-colors" />
                  {index === 0 ? (
                    <>
                      <p className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                        Click para subir
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Selecciona imágenes • PNG, JPG, GIF hasta 10MB
                      </p>
                    </>
                  ) : null}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  const handleGlobalDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleMultipleFiles(files)
    }
  }

  const handleGlobalClick = () => {
    if (!isDragOver) {
      document.getElementById('global-multiple-file-input')?.click()
    }
  }

  const handleGlobalDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleGlobalDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    // Solo quitar drag over si salimos del contenedor principal
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false)
    }
  }

  const handleMultipleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleMultipleFiles(files)
    }
    // Reset input
    e.target.value = ''
  }

  return (
    <div 
      className={`space-y-4 relative cursor-pointer ${
        isDragOver ? 'bg-primary/5 border-2 border-dashed border-primary rounded-lg p-4' : ''
      }`}
      onDrop={handleGlobalDrop}
      onDragOver={handleGlobalDragOver}
      onDragLeave={handleGlobalDragLeave}
      onClick={handleGlobalClick}
    >
      {isDragOver && (
        <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary rounded-lg flex items-center justify-center z-10">
          <div className="text-center">
            <Upload className="h-12 w-12 text-primary mx-auto mb-2" />
            <p className="text-lg font-medium text-primary">Suelta las imágenes aquí</p>
            <p className="text-sm text-muted-foreground">Máximo {maxImages} imágenes • También puedes hacer click para seleccionar</p>
          </div>
        </div>
      )}
      
      {/* Input múltiple oculto para el área global */}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Imagen Principal */}
        <div>
          <h3 className="text-sm font-medium mb-3">Imagen Principal *</h3>
          <ImageUploadSlot 
            index={0} 
            isRequired={true}
            showLabel={false}
          />
        </div>
        
        {/* Imágenes Adicionales */}
        <div>
          <h3 className="text-sm font-medium mb-3">Imágenes Adicionales</h3>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((slotNumber) => {
              const img = images[slotNumber]
              const hasImage = img && img.trim() !== ''
              
              return (
                <div key={slotNumber} className="relative aspect-square">
                  {hasImage ? (
                    <>
                      <img 
                        src={img} 
                        alt={`Imagen adicional ${slotNumber}`}
                        className="w-full h-full object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 h-6 w-6 p-0 bg-red-500/10 border-red-500/20 text-red-600 hover:bg-red-500/20 hover:text-red-700"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeImage(slotNumber)
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <div 
                        className="w-full h-full border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center cursor-pointer group hover:border-primary hover:bg-primary/5 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          document.getElementById(`file-input-${slotNumber}`)?.click()
                        }}
                        onDrop={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          const files = e.dataTransfer.files
                          if (files.length > 0) {
                            handleFileSelect(files[0], slotNumber)
                          }
                        }}
                        onDragOver={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                        }}
                        onDragEnter={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                        }}
                      >
                        <div className="text-center text-muted-foreground/50 group-hover:text-primary/70 transition-colors">
                          <ImageIcon className="h-6 w-6 mx-auto mb-1" />
                          <p className="text-xs">{slotNumber}</p>
                        </div>
                      </div>
                      <input
                        id={`file-input-${slotNumber}`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          e.stopPropagation()
                          if (e.target.files?.[0]) {
                            handleFileSelect(e.target.files[0], slotNumber)
                          }
                          // Limpiar el input para permitir seleccionar el mismo archivo de nuevo
                          e.target.value = ''
                        }}
                      />
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground flex justify-between items-center">
        <span>{images.filter(img => img).length} de {maxImages} imágenes • Click en imagen principal para seleccionar múltiples</span>
        {uploading.length > 0 && (
          <span className="text-blue-600">Subiendo {uploading.length} imagen{uploading.length > 1 ? 'es' : ''}...</span>
        )}
      </div>
    </div>
  )
}