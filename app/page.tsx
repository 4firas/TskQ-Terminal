"use client"

import React from "react"
import { WindowManagerProvider, useWindowManager } from "@/components/xp/WindowManagerContext"
import { DesktopIcon } from "@/components/xp/DesktopIcon"
import { Taskbar } from "@/components/xp/Taskbar"
import { AboutMeWindow } from "@/components/xp/windows/AboutMeWindow"
import { SocialsWindow } from "@/components/xp/windows/SocialsWindow"
import { ArtworkWindow } from "@/components/xp/windows/ArtworkWindow"
import { ImageViewerWindow } from "@/components/xp/windows/ImageViewerWindow"
import { TerminalWindow } from "@/components/xp/windows/TerminalWindow"

// Desktop icon configuration
const desktopIcons = [
  {
    id: "about",
    title: "About Me",
    icon: "/icons/mycomputer.ico",
    windowTitle: "About Me - Notepad",
    component: "about",
    position: { x: 20, y: 20 }
  },
  {
    id: "socials",
    title: "Socials",
    icon: "/icons/internet.ico",
    windowTitle: "Socials",
    component: "socials",
    position: { x: 20, y: 110 }
  },
  {
    id: "pictures",
    title: "Pictures",
    icon: "/icons/pictures.ico",
    windowTitle: "My Pictures",
    component: "pictures",
    position: { x: 20, y: 200 }
  },
  {
    id: "artwork",
    title: "Artwork",
    icon: "/icons/artwork.ico",
    windowTitle: "Artwork",
    component: "artwork",
    position: { x: 20, y: 290 }
  },
  {
    id: "terminal",
    title: "Command Prompt",
    icon: "/icons/terminal.ico",
    windowTitle: "Command Prompt",
    component: "terminal",
    position: { x: 20, y: 380 }
  },
  {
    id: "recyclebin",
    title: "Recycle Bin",
    icon: "/icons/recyclebin.ico",
    windowTitle: "Recycle Bin",
    component: "recyclebin",
    position: { x: 20, y: 470 }
  }
]

function WindowRenderer() {
  const { windows } = useWindowManager()

  return (
    <>
      {windows.map(window => {
        if (!window.isOpen) return null

        switch (window.component) {
          case "about":
            return <AboutMeWindow key={window.id} />
          case "socials":
            return <SocialsWindow key={window.id} />
          case "pictures":
            return <ArtworkWindow key={window.id} mode="pictures" />
          case "artwork":
            return <ArtworkWindow key={window.id} mode="artwork" />
          case "terminal":
            return <TerminalWindow key={window.id} />
          case "imageviewer":
            return (
              <ImageViewerWindow
                key={window.id}
                windowId={window.id}
                photo={window.props?.photo as { id: number; title: string; url: string; description: string }}
              />
            )
          default:
            return null
        }
      })}
    </>
  )
}

function Desktop() {
  const [selectionBox, setSelectionBox] = React.useState<{ start: { x: number; y: number }; current: { x: number; y: number } } | null>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only start selection if clicking directly on the desktop or icons container
    if ((e.target as HTMLElement).classList.contains("desktop-icons-container") ||
      (e.target as HTMLElement).classList.contains("desktop-background") ||
      (e.target as HTMLElement).classList.contains("xp-desktop")) {
      setSelectionBox({
        start: { x: e.clientX, y: e.clientY },
        current: { x: e.clientX, y: e.clientY }
      })
    }
  }

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (selectionBox) {
        setSelectionBox(prev => prev ? { ...prev, current: { x: e.clientX, y: e.clientY } } : null)
      }
    }

    const handleMouseUp = () => {
      if (selectionBox) {
        setSelectionBox(null)
      }
    }

    if (selectionBox) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [selectionBox])

  const getSelectionStyle = () => {
    if (!selectionBox) return {}

    const left = Math.min(selectionBox.start.x, selectionBox.current.x)
    const top = Math.min(selectionBox.start.y, selectionBox.current.y)
    const width = Math.abs(selectionBox.current.x - selectionBox.start.x)
    const height = Math.abs(selectionBox.current.y - selectionBox.start.y)

    return {
      left,
      top,
      width,
      height
    }
  }
  return (
    <div
      className="xp-desktop"
      onMouseDown={handleMouseDown}
    >
      {/* Desktop Background with Bliss */}
      <div className="desktop-background" />

      {/* Desktop Icons */}
      <div className="desktop-icons-container">
        {desktopIcons.map(icon => (
          <DesktopIcon
            key={icon.id}
            id={icon.id}
            title={icon.title}
            icon={icon.icon}
            windowTitle={icon.windowTitle}
            component={icon.component}
            defaultPosition={icon.position}
          />
        ))}
      </div>

      {/* Selection Rectangle */}
      {selectionBox && (
        <div className="selection-rectangle" style={getSelectionStyle()} />
      )}

      {/* Windows Container */}
      <div className="windows-container">
        <WindowRenderer />
      </div>

      {/* Taskbar */}
      <Taskbar />
    </div>
  )
}

export default function Home() {
  return (
    <WindowManagerProvider>
      <Desktop />
    </WindowManagerProvider>
  )
}
