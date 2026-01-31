"use client"

import React, { useRef, useState } from "react"
import Draggable from "react-draggable"
import { useWindowManager } from "./WindowManagerContext"

interface DesktopIconProps {
    id: string
    title: string
    icon: string
    windowTitle: string
    component: string
    defaultPosition?: { x: number; y: number }
}

export function DesktopIcon({
    id,
    title,
    icon,
    windowTitle,
    component,
    defaultPosition = { x: 20, y: 20 }
}: DesktopIconProps) {
    const { openWindow } = useWindowManager()
    const nodeRef = useRef<HTMLDivElement>(null)
    const [selected, setSelected] = useState(false)
    const [position, setPosition] = useState(defaultPosition)
    const clickTimeout = useRef<NodeJS.Timeout | null>(null)
    const clickCount = useRef(0)

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        setSelected(true)

        clickCount.current++

        if (clickCount.current === 1) {
            clickTimeout.current = setTimeout(() => {
                clickCount.current = 0
            }, 300)
        } else if (clickCount.current === 2) {
            // Double click - open window
            if (clickTimeout.current) {
                clearTimeout(clickTimeout.current)
            }
            clickCount.current = 0
            openWindow(id, windowTitle, component, icon)
        }
    }

    const handleDragStop = (_e: unknown, data: { x: number; y: number }) => {
        setPosition({ x: data.x, y: data.y })
    }

    const handleDesktopClick = () => {
        setSelected(false)
    }

    // Listen for clicks outside
    React.useEffect(() => {
        const handleGlobalClick = (e: MouseEvent) => {
            if (nodeRef.current && !nodeRef.current.contains(e.target as Node)) {
                setSelected(false)
            }
        }
        document.addEventListener("click", handleGlobalClick)
        return () => document.removeEventListener("click", handleGlobalClick)
    }, [])

    return (
        <Draggable
            nodeRef={nodeRef}
            position={position}
            onStop={handleDragStop}
            bounds="parent"
            grid={[75, 75]}
        >
            <div
                ref={nodeRef}
                className={`desktop-icon ${selected ? "selected" : ""}`}
                onClick={handleClick}
            >
                <div className="desktop-icon-image">
                    <img src={icon} alt={title} draggable={false} />
                </div>
                <span className="desktop-icon-label">{title}</span>
            </div>
        </Draggable>
    )
}
