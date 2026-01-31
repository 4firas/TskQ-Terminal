"use client"

import React, { ReactNode, useRef, useState, useEffect } from "react"
import Draggable from "react-draggable"
import { useWindowManager } from "./WindowManagerContext"

interface WindowProps {
    id: string
    title: string
    icon?: string
    children: ReactNode
    defaultWidth?: number
    defaultHeight?: number
    minWidth?: number
    minHeight?: number
    resizable?: boolean
}

export function Window({
    id,
    title,
    icon,
    children,
    defaultWidth = 600,
    defaultHeight = 400,
    minWidth = 300,
    minHeight = 200,
    resizable = true
}: WindowProps) {
    const { windows, closeWindow, minimizeWindow, maximizeWindow, restoreWindow, focusWindow, updateWindowPosition } = useWindowManager()
    const windowState = windows.find(w => w.id === id)
    const nodeRef = useRef<HTMLDivElement>(null)
    const [size, setSize] = useState({ width: defaultWidth, height: defaultHeight })
    const [isResizing, setIsResizing] = useState(false)

    useEffect(() => {
        if (windowState?.size) {
            setSize(windowState.size)
        }
    }, [windowState?.size])

    if (!windowState || !windowState.isOpen || windowState.isMinimized) {
        return null
    }

    const handleDragStop = (_e: unknown, data: { x: number; y: number }) => {
        updateWindowPosition(id, { x: data.x, y: data.y })
    }

    const handleMouseDown = () => {
        focusWindow(id)
    }

    const handleResize = (e: React.MouseEvent) => {
        e.preventDefault()
        setIsResizing(true)

        const startX = e.clientX
        const startY = e.clientY
        const startWidth = size.width
        const startHeight = size.height

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const newWidth = Math.max(minWidth, startWidth + (moveEvent.clientX - startX))
            const newHeight = Math.max(minHeight, startHeight + (moveEvent.clientY - startY))
            setSize({ width: newWidth, height: newHeight })
        }

        const handleMouseUp = () => {
            setIsResizing(false)
            document.removeEventListener("mousemove", handleMouseMove)
            document.removeEventListener("mouseup", handleMouseUp)
        }

        document.addEventListener("mousemove", handleMouseMove)
        document.addEventListener("mouseup", handleMouseUp)
    }

    const isMaximized = windowState.isMaximized

    return (
        <Draggable
            nodeRef={nodeRef}
            handle=".window-title-bar"
            position={isMaximized ? { x: 0, y: 0 } : windowState.position}
            onStop={handleDragStop}
            disabled={isMaximized}
            bounds="parent"
        >
            <div
                ref={nodeRef}
                className="window xp-window"
                style={{
                    position: "absolute",
                    zIndex: windowState.zIndex,
                    width: isMaximized ? "100%" : size.width,
                    height: isMaximized ? "calc(100% - 30px)" : size.height,
                    display: "flex",
                    flexDirection: "column"
                }}
                onMouseDown={handleMouseDown}
            >
                {/* Title Bar */}
                <div className="title-bar window-title-bar">
                    <div className="title-bar-text">
                        {icon && <img src={icon} alt="" className="window-icon" style={{ width: 16, height: 16, marginRight: 4 }} />}
                        {title}
                    </div>
                    <div className="title-bar-controls">
                        <button
                            aria-label="Minimize"
                            onClick={(e) => { e.stopPropagation(); minimizeWindow(id) }}
                        />
                        <button
                            aria-label={isMaximized ? "Restore" : "Maximize"}
                            onClick={(e) => { e.stopPropagation(); isMaximized ? restoreWindow(id) : maximizeWindow(id) }}
                        />
                        <button
                            aria-label="Close"
                            onClick={(e) => { e.stopPropagation(); closeWindow(id) }}
                        />
                    </div>
                </div>

                {/* Window Body */}
                <div className="window-body" style={{
                    flex: 1,
                    overflow: "auto",
                    display: "flex",
                    flexDirection: "column"
                }}>
                    {children}
                </div>

                {/* Resize Handle */}
                {resizable && !isMaximized && (
                    <div
                        className="resize-handle"
                        style={{
                            position: "absolute",
                            right: 0,
                            bottom: 0,
                            width: 16,
                            height: 16,
                            cursor: "url('/cursors/nwse-resize.cur'), nwse-resize",
                            background: "transparent"
                        }}
                        onMouseDown={handleResize}
                    />
                )}
            </div>
        </Draggable>
    )
}
