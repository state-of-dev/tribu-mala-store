"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface AlertModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
  actionText?: string
  variant?: "default" | "destructive"
}

export function AlertModal({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  actionText = "Aceptar",
  variant = "default"
}: AlertModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction 
            onClick={onClose}
            className={variant === "destructive" ? "bg-red-600 hover:bg-red-700" : ""}
          >
            {actionText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// Hook para usar el modal
export function useAlertModal() {
  const [modal, setModal] = useState<{
    isOpen: boolean
    title: string
    description: string
    actionText?: string
    variant?: "default" | "destructive"
  }>({
    isOpen: false,
    title: "",
    description: "",
    actionText: "Aceptar",
    variant: "default"
  })

  const showAlert = (
    title: string, 
    description: string, 
    actionText?: string,
    variant?: "default" | "destructive"
  ) => {
    setModal({
      isOpen: true,
      title,
      description,
      actionText: actionText || "Aceptar",
      variant: variant || "default"
    })
  }

  const closeAlert = () => {
    setModal(prev => ({ ...prev, isOpen: false }))
  }

  const AlertModalComponent = () => (
    <AlertModal
      isOpen={modal.isOpen}
      onClose={closeAlert}
      title={modal.title}
      description={modal.description}
      actionText={modal.actionText}
      variant={modal.variant}
    />
  )

  return { showAlert, AlertModalComponent }
}