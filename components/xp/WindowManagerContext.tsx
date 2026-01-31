"use client"

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react"

export interface WindowState {
    id: string
    title: string
    icon?: string
    isOpen: boolean
    isMinimized: boolean
    isMaximized: boolean
    position: { x: number; y: number }
    size: { width: number; height: number }
    zIndex: number
    component: string
    props?: Record<string, unknown>
}

interface WindowManagerContextType {
    windows: WindowState[]
    openWindow: (id: string, title: string, component: string, icon?: string, props?: Record<string, unknown>) => void
    closeWindow: (id: string) => void
    minimizeWindow: (id: string) => void
    maximizeWindow: (id: string) => void
    restoreWindow: (id: string) => void
    focusWindow: (id: string) => void
    updateWindowPosition: (id: string, position: { x: number; y: number }) => void
    updateWindowSize: (id: string, size: { width: number; height: number }) => void
    getTopZIndex: () => number
}

const WindowManagerContext = createContext<WindowManagerContextType | undefined>(undefined)

export function useWindowManager() {
    const context = useContext(WindowManagerContext)
    if (!context) {
        throw new Error("useWindowManager must be used within a WindowManagerProvider")
    }
    return context
}

interface WindowManagerProviderProps {
    children: ReactNode
}

export function WindowManagerProvider({ children }: WindowManagerProviderProps) {
    const [windows, setWindows] = useState<WindowState[]>([])
    const [topZIndex, setTopZIndex] = useState(100)

    const getTopZIndex = useCallback(() => topZIndex, [topZIndex])

    const openWindow = useCallback((
        id: string,
        title: string,
        component: string,
        icon?: string,
        props?: Record<string, unknown>
    ) => {
        setWindows(prev => {
            const existing = prev.find(w => w.id === id)
            if (existing) {
                // Window already exists, bring to front and restore if minimized
                const newZIndex = topZIndex + 1
                setTopZIndex(newZIndex)
                return prev.map(w =>
                    w.id === id
                        ? { ...w, isOpen: true, isMinimized: false, zIndex: newZIndex }
                        : w
                )
            }

            // Create new window with random offset to stagger windows
            const offset = prev.length * 30
            const newZIndex = topZIndex + 1
            setTopZIndex(newZIndex)

            return [...prev, {
                id,
                title,
                icon,
                isOpen: true,
                isMinimized: false,
                isMaximized: false,
                position: { x: 100 + offset, y: 50 + offset },
                size: { width: 600, height: 400 },
                zIndex: newZIndex,
                component,
                props
            }]
        })
    }, [topZIndex])

    const closeWindow = useCallback((id: string) => {
        setWindows(prev => prev.map(w =>
            w.id === id ? { ...w, isOpen: false } : w
        ))
    }, [])

    const minimizeWindow = useCallback((id: string) => {
        setWindows(prev => prev.map(w =>
            w.id === id ? { ...w, isMinimized: true } : w
        ))
    }, [])

    const maximizeWindow = useCallback((id: string) => {
        setWindows(prev => prev.map(w =>
            w.id === id ? { ...w, isMaximized: true } : w
        ))
    }, [])

    const restoreWindow = useCallback((id: string) => {
        const newZIndex = topZIndex + 1
        setTopZIndex(newZIndex)
        setWindows(prev => prev.map(w =>
            w.id === id ? { ...w, isMinimized: false, isMaximized: false, zIndex: newZIndex } : w
        ))
    }, [topZIndex])

    const focusWindow = useCallback((id: string) => {
        const newZIndex = topZIndex + 1
        setTopZIndex(newZIndex)
        setWindows(prev => prev.map(w =>
            w.id === id ? { ...w, zIndex: newZIndex } : w
        ))
    }, [topZIndex])

    const updateWindowPosition = useCallback((id: string, position: { x: number; y: number }) => {
        setWindows(prev => prev.map(w =>
            w.id === id ? { ...w, position } : w
        ))
    }, [])

    const updateWindowSize = useCallback((id: string, size: { width: number; height: number }) => {
        setWindows(prev => prev.map(w =>
            w.id === id ? { ...w, size } : w
        ))
    }, [])

    return (
        <WindowManagerContext.Provider value={{
            windows,
            openWindow,
            closeWindow,
            minimizeWindow,
            maximizeWindow,
            restoreWindow,
            focusWindow,
            updateWindowPosition,
            updateWindowSize,
            getTopZIndex
        }}>
            {children}
        </WindowManagerContext.Provider>
    )
}
