"use client"

import React, { useState, useCallback, useRef, useEffect } from "react"
import { Window } from "../Window"

interface Photo {
    id: number
    title: string
    url: string
    description: string
    type?: "photography" | "artwork"
}

interface ImageViewerWindowProps {
    windowId: string
    photo: Photo
}

export function ImageViewerWindow({ windowId, photo }: ImageViewerWindowProps) {
    const [zoom, setZoom] = useState(1)
    const [offset, setOffset] = useState({ x: 0, y: 0 })
    const dragging = useRef(false)
    const lastPos = useRef({ x: 0, y: 0 })

    const handleWheel = useCallback((e: React.WheelEvent) => {
        e.preventDefault()
        const delta = -e.deltaY * 0.001
        setZoom(z => Math.max(0.1, Math.min(5, z + delta)))
    }, [])

    const startDrag = (e: React.MouseEvent) => {
        dragging.current = true
        lastPos.current = { x: e.clientX, y: e.clientY }
    }

    const onDrag = (e: React.MouseEvent) => {
        if (!dragging.current) return
        const dx = e.clientX - lastPos.current.x
        const dy = e.clientY - lastPos.current.y
        setOffset(o => ({ x: o.x + dx, y: o.y + dy }))
        lastPos.current = { x: e.clientX, y: e.clientY }
    }

    const endDrag = () => {
        dragging.current = false
    }

    const handleZoomIn = () => setZoom(z => Math.min(5, z + 0.25))
    const handleZoomOut = () => setZoom(z => Math.max(0.1, z - 0.25))
    const handleFitToWindow = () => {
        setZoom(1)
        setOffset({ x: 0, y: 0 })
    }

    return (
        <Window
            id={windowId}
            title={`${photo.title} - Windows Picture and Fax Viewer`}
            icon={photo.type === "artwork" ? "/icons/artwork.ico" : "/icons/pictures.ico"}
            defaultWidth={800}
            defaultHeight={600}
        >
            <div className="image-viewer">
                {/* Toolbar */}
                <div className="viewer-toolbar">
                    <button className="viewer-btn" onClick={handleZoomOut} title="Zoom Out">
                        <span>−</span>
                    </button>
                    <span className="zoom-level">{Math.round(zoom * 100)}%</span>
                    <button className="viewer-btn" onClick={handleZoomIn} title="Zoom In">
                        <span>+</span>
                    </button>
                    <div className="toolbar-separator" />
                    <button className="viewer-btn" onClick={handleFitToWindow} title="Fit to Window">
                        <span>⊡</span>
                    </button>
                    <div className="toolbar-separator" />
                    <button className="viewer-btn" disabled title="Previous">
                        <span>◀</span>
                    </button>
                    <button className="viewer-btn" disabled title="Next">
                        <span>▶</span>
                    </button>
                </div>

                {/* Image Container */}
                <div
                    className="viewer-content"
                    onWheel={handleWheel}
                    onMouseDown={startDrag}
                    onMouseMove={onDrag}
                    onMouseUp={endDrag}
                    onMouseLeave={endDrag}
                >
                    <img
                        src={photo.url}
                        alt={photo.title}
                        draggable={false}
                        style={{
                            transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                            cursor: dragging.current ? "grabbing" : "grab",
                            transition: dragging.current ? "none" : "transform 0.1s ease-out"
                        }}
                    />
                </div>

                {/* Status Bar */}
                <div className="viewer-statusbar">
                    <span>{photo.description}</span>
                </div>
            </div>
        </Window>
    )
}
