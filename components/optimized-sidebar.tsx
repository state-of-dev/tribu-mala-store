import { memo } from "react"
import { AppSidebar } from "./app-sidebar"

// Memoizamos el sidebar para evitar re-renders innecesarios
export const OptimizedSidebar = memo(AppSidebar)
OptimizedSidebar.displayName = "OptimizedSidebar"