"use client"

import { cn } from "@/lib/utils"

interface SmoothSkeletonProps {
  className?: string
  variant?: 'default' | 'card' | 'text' | 'badge' | 'button'
  lines?: number
}

export function SmoothSkeleton({ 
  className, 
  variant = 'default',
  lines = 1 
}: SmoothSkeletonProps) {
  const baseClasses = "bg-gradient-to-r from-muted/50 to-muted/30 rounded animate-fade-in"
  
  const variants = {
    default: "h-4 bg-muted/40",
    card: "h-20 bg-muted/30 rounded-lg",
    text: "h-3 bg-muted/40 rounded-sm",
    badge: "h-5 w-16 bg-muted/40 rounded-full",
    button: "h-8 w-20 bg-muted/40 rounded-md"
  }

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div 
            key={i}
            className={cn(
              baseClasses,
              variants[variant],
              i === lines - 1 ? "w-3/4" : "w-full",
              className
            )} 
          />
        ))}
      </div>
    )
  }

  return (
    <div 
      className={cn(
        baseClasses,
        variants[variant],
        className
      )} 
    />
  )
}

interface OrderSkeletonProps {
  count?: number
}

export function OrderSkeleton({ count = 3 }: OrderSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-4 border rounded-lg bg-card">
          <div className="flex items-center justify-between">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-4">
                <SmoothSkeleton variant="badge" />
                <SmoothSkeleton variant="badge" />
                <SmoothSkeleton className="h-3 w-24" />
              </div>
              <SmoothSkeleton variant="text" lines={2} />
              <div className="flex items-center gap-4">
                <SmoothSkeleton className="h-3 w-32" />
                <SmoothSkeleton className="h-3 w-20" />
                <SmoothSkeleton className="h-3 w-16" />
              </div>
            </div>
            <div className="text-right space-y-2">
              <SmoothSkeleton className="h-6 w-20" />
              <SmoothSkeleton variant="button" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}