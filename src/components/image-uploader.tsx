import { ChangeEvent, useMemo, useState } from 'react'
import { FileImage, Upload } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface ImageUploaderProps {
  onFileSelected: (file: File) => void
  initialImageUrl?: string | null
}

export function ImageUploader({
  onFileSelected,
  initialImageUrl,
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(initialImageUrl || null)

  function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.target

    if (!files || files.length === 0) {
      return
    }

    const file = files[0]
    onFileSelected(file)

    const previewUrl = URL.createObjectURL(file)
    setPreview(previewUrl)
  }

  const previewContent = useMemo(() => {
    if (preview) {
      return (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="h-48 w-full rounded-md object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => setPreview(null)}
            className="absolute right-2 top-2"
          >
            Remover
          </Button>
        </div>
      )
    }
    return (
      <div className="flex aspect-video cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed text-sm text-muted-foreground hover:bg-primary/5">
        <FileImage className="h-4 w-4" />
        <span>Selecione uma imagem</span>
      </div>
    )
  }, [preview])

  return (
    <div className="space-y-2">
      <Label htmlFor="image">Imagem</Label>
      <label htmlFor="image-upload" className="relative">
        {previewContent}
      </label>
      <input
        type="file"
        id="image-upload"
        className="sr-only"
        accept="image/png, image/jpeg, image/jpg"
        onChange={handleFileSelected}
      />
    </div>
  )
}
