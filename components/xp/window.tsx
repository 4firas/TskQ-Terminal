"use client"

import { useState, useRef, useEffect, type ReactNode } from "react"

interface WindowProps {
  id: string
  title: string
  icon?: ReactNode
  children: ReactNode
  initialPosition?: { x: number; y: number }
  initialSize?: { width: number; height: number }
  onClose: () => void
  onFocus: () => void
  zIndex: number
  isMinimized: boolean
  onMinimize: () => void
  onRestore: () => void
}

export function XPWindow({
  id,
  title,
  icon,
  children,
  initialPosition = { x: 100, y: 100 },
  initialSize = { width: 500, height: 400 },
  onClose,
  onFocus,
  zIndex,
  isMinimized,
  onMinimize,
  onRestore,
}: WindowProps) {
  const [position, setPosition] = useState(initialPosition)
  const [size, setSize] = useState(initialSize)
  const [isMaximized, setIsMaximized] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [prevState, setPrevState] = useState({ position: initialPosition, size: initialSize })
  
  const windowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !isMaximized) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: Math.max(0, e.clientY - dragOffset.y),
        })
      }
      if (isResizing && !isMaximized) {
        const rect = windowRef.current?.getBoundingClientRect()
        if (rect) {
          setSize({
            width: Math.max(300, e.clientX - rect.left),
            height: Math.max(200, e.clientY - rect.top),
          })
        }
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
    }

    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, isResizing, dragOffset, isMaximized])

  const handleTitleBarMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return
    onFocus()
    setIsDragging(true)
    const rect = windowRef.current?.getBoundingClientRect()
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  const handleMaximize = () => {
    if (isMaximized) {
      setPosition(prevState.position)
      setSize(prevState.size)
      setIsMaximized(false)
    } else {
      setPrevState({ position, size })
      setPosition({ x: 0, y: 0 })
      setSize({ width: window.innerWidth, height: window.innerHeight - 40 })
      setIsMaximized(true)
    }
  }

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    onFocus()
    setIsResizing(true)
  }

  if (isMinimized) return null

  return (
    <div
      ref={windowRef}
      className="xp-window absolute flex flex-col"
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex,
      }}
      onMouseDown={onFocus}
    >
      {/* Title Bar */}
      <div
        className="xp-title-bar flex items-center justify-between px-2 py-1 cursor-move select-none"
        onMouseDown={handleTitleBarMouseDown}
        onDoubleClick={handleMaximize}
      >
        <div className="flex items-center gap-2">
          {icon && <span className="w-4 h-4">{icon}</span>}
          <span className="text-white text-sm font-bold truncate">{title}</span>
        </div>
        <div className="flex gap-1">
          <button
            className="xp-btn-minimize w-5 h-5 flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation()
              onMinimize()
            }}
          >
            <span className="text-xs font-bold">_</span>
          </button>
          <button
            className="xp-btn-maximize w-5 h-5 flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation()
              handleMaximize()
            }}
          >
            <span className="text-xs">{isMaximized ? "❐" : "□"}</span>
          </button>
          <button
            className="xp-btn-close w-5 h-5 flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
          >
            <span className="text-xs font-bold">×</span>
          </button>
        </div>
      </div>

      {/* Menu Bar */}
      <div className="xp-menu-bar flex items-center gap-4 px-2 py-1 text-xs">
        <span className="hover:bg-[#316ac5] hover:text-white px-1 cursor-pointer">File</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1 cursor-pointer">Edit</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1 cursor-pointer">View</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1 cursor-pointer">Help</span>
      </div>

      {/* Window Content */}
      <div className="xp-window-content flex-1 overflow-auto">
        {children}
      </div>

      {/* Resize Handle */}
      {!isMaximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
          onMouseDown={handleResizeMouseDown}
        />
      )}
    </div>
  )
}
