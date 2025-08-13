"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
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

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
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

export function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm,
  title, 
  description, 
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "default"
}: ConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

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
          <AlertDialogCancel 
            onClick={onClose}
            className="bg-transparent border-muted text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            className={variant === "destructive" ? "bg-red-600 hover:bg-red-700 text-white font-semibold" : ""}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// Hook para usar los modales
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

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    title: string
    description: string
    confirmText?: string
    cancelText?: string
    variant?: "default" | "destructive"
    onConfirm?: () => void
  }>({
    isOpen: false,
    title: "",
    description: "",
    confirmText: "Confirmar",
    cancelText: "Cancelar",
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

  const showConfirm = (
    title: string,
    description: string,
    onConfirm: () => void,
    confirmText?: string,
    cancelText?: string,
    variant?: "default" | "destructive"
  ) => {
    setConfirmModal({
      isOpen: true,
      title,
      description,
      confirmText: confirmText || "Confirmar",
      cancelText: cancelText || "Cancelar",
      variant: variant || "default",
      onConfirm
    })
  }

  const closeAlert = () => {
    setModal(prev => ({ ...prev, isOpen: false }))
  }

  const closeConfirm = () => {
    setConfirmModal(prev => ({ ...prev, isOpen: false }))
  }

  const AlertModalComponent = () => (
    <>
      <AlertModal
        isOpen={modal.isOpen}
        onClose={closeAlert}
        title={modal.title}
        description={modal.description}
        actionText={modal.actionText}
        variant={modal.variant}
      />
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirm}
        onConfirm={confirmModal.onConfirm || (() => {})}
        title={confirmModal.title}
        description={confirmModal.description}
        confirmText={confirmModal.confirmText}
        cancelText={confirmModal.cancelText}
        variant={confirmModal.variant}
      />
    </>
  )

  return { showAlert, showConfirm, AlertModalComponent }
}