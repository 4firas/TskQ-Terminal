"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { XPWindow } from "./window"
import { XPTaskbar } from "./taskbar"
import { XPStartMenu } from "./start-menu"
import { DesktopIcon } from "./desktop-icon"
import { Camera, Globe, Info, User, FolderOpen, Instagram, Youtube, Terminal as TerminalIcon, Trash2 } from "lucide-react"

// Photo data
interface Photo {
  id: number
  title: string
  url: string
  description: string
}

const photoData: Photo[] = [
  {
    id: 1,
    title: "Urban Colors",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tskq.bsky.social%20%5B2025-11-14T10%CB%9036%CB%9041.058Z%5D%203m5licgdmls2s%2001-k0YlTbnbKGVEUpevZlbGX71glZSp7a.jpg",
    description: "Colorful apartment building against a clear blue sky",
  },
  {
    id: 2,
    title: "Yellow & Teal",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tskq.bsky.social%20%5B2025-11-14T10%CB%9036%CB%9041.058Z%5D%203m5licgdmls2s%2002-IKzJ6vLHR1GbcXaNPRTTzX1yVoIbyA.jpg",
    description: "Building facade with contrasting yellow and teal panels",
  },
  {
    id: 3,
    title: "Modernist Architecture",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tskq.bsky.social%20%5B2025-11-14T10%CB%9036%CB%9041.058Z%5D%203m5licgdmls2s%2003-bc5x6yrs67LNMilcCLo1D9hEW5tCnh.jpg",
    description: "Yellow and white buildings with weathered blue fence",
  },
  {
    id: 4,
    title: "Mirror in the Garden",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tskq.bsky.social%20%5B2025-11-14T10%CB%9039%CB%9005.355Z%5D%203m5ligrgo6s2c%2001-88QNFfhUGgGxDIyu1C3szdwN3EFFIo.jpg",
    description: "Convex mirror reflection among lush green vegetation",
  },
  {
    id: 5,
    title: "Palm Trees",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tskq.bsky.social%20%5B2025-11-14T10%CB%9039%CB%9005.355Z%5D%203m5ligrgo6s2c%2002-m68tVCwlHQ3vcFaoTX0Mjrci0eMFdT.jpg",
    description: "Palm trees swaying against a clear blue sky",
  },
  {
    id: 6,
    title: "Parking Lot Exit",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tskq.bsky.social%20%5B2025-11-14T10%CB%9039%CB%9005.355Z%5D%203m5ligrgo6s2c%2003-sLZ2564WL4SQls45f389TegUqvMKmq.jpg",
    description: "Covered parking area with sunlight at the exit",
  },
  {
    id: 7,
    title: "Walrus Board",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tskq.bsky.social%20%5B2025-08-17T10%CB%9057%CB%9009.607Z%5D%203lwlpxgnxas2d%2002-mx4te9CQt4Lu25NKbz0RVpzaCJAibN.jpg",
    description: "Corkboard with walrus photos and handwritten notes",
  },
  {
    id: 8,
    title: "Palm Pathway",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tskq.bsky.social%20%5B2025-11-29T19%CB%9011%CB%9050.232Z%5D%203m6s43s6ozk2b%2002-JqjWer4frRidrwQoDKVQTrkNNYmznF.jpg",
    description: "Traditional pathway lined with palm trees and festive flags",
  },
  {
    id: 9,
    title: "Mountain Vista",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tskq.bsky.social%20%5B2025-11-29T19%CB%9011%CB%9050.232Z%5D%203m6s43s6ozk2b%2003-6ol5nJM0p0fMsSjmFOm1M6trwdWEtd.jpg",
    description: "Mountains rising above palm tree canopy at golden hour",
  },
  {
    id: 10,
    title: "Traditional Crafts",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tskq.bsky.social%20%5B2025-11-29T19%CB%9011%CB%9050.232Z%5D%203m6s43s6ozk2b%2001-OEgh3jYNcOTVm02wv0lVbXXZhr9KGI.jpg",
    description: "Woven baskets and pottery hanging on a tree with flags",
  },
  {
    id: 11,
    title: "Red Room",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tskq.bsky.social%20%5B2025-08-17T10%CB%9055%CB%9055.808Z%5D%203lwlpvr3d3k2d%2001-QoGTClRCRkdallxDMVebeZCFVeV4q8.jpg",
    description: "Abstract installation with red light and black shapes",
  },
  {
    id: 12,
    title: "Striped Poles",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tskq.bsky.social%20%5B2025-06-13T19%CB%9004%CB%9046.947Z%5D%203lrj4vugxos2a%2001-lJjgHPaalZ4OA5dkPcHwvXUWdAdgGc.jpg",
    description: "Red and white barrier poles at night",
  },
  {
    id: 13,
    title: "Aquarium",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tskq.bsky.social%20%5B2025-08-17T10%CB%9055%CB%9040.804Z%5D%203lwlpva6ndc2d%2001-7orp9E8qHEG0oYf7T9XmLKO516nQkD.jpg",
    description: "Silhouette watching through a window",
  },
]

// XP Terminal Component
function XPTerminalContent() {
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<{ type: "input" | "output"; text: string }[]>([
    { type: "output", text: "Microsoft Windows XP [Version 5.1.2600]" },
    { type: "output", text: "(C) Copyright 1985-2001 Microsoft Corp." },
    { type: "output", text: "" },
    { type: "output", text: "Welcome to TskQ's Terminal! Type 'help' for commands." },
    { type: "output", text: "" },
  ])
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  const processCommand = (cmd: string) => {
    const command = cmd.trim().toLowerCase()
    let output: string[] = []

    switch (command) {
      case "help":
        output = [
          "Available commands:",
          "  help     - Show this help message",
          "  about    - About TskQ",
          "  social   - Show social media links",
          "  photos   - Open My Pictures",
          "  clear    - Clear the terminal",
          "  dir      - List directory contents",
          "  ver      - Show Windows version",
        ]
        break
      case "about":
        output = [
          "=================================",
          "         TskQ - About Me",
          "=================================",
          "",
          "I'm a photographer and developer passionate about",
          "capturing moments and creating experiences.",
          "",
          "Camera: Canon EOS M6",
          "Focus: Urban architecture, nature, cultural scenes",
        ]
        break
      case "social":
        output = [
          "Social Media Links:",
          "  Bluesky   - https://bsky.app/profile/tskq.bsky.social",
          "  Instagram - https://instagram.com/firas.log",
          "  YouTube   - https://youtube.com/@tskku",
          "  Guns.lol  - https://guns.lol/tskq",
        ]
        break
      case "clear":
        setHistory([])
        return
      case "dir":
        output = [
          " Volume in drive C has no label.",
          " Volume Serial Number is 1337-TSKQ",
          "",
          " Directory of C:\\Users\\TskQ\\Desktop",
          "",
          "01/31/2026  10:00 AM    <DIR>          .",
          "01/31/2026  10:00 AM    <DIR>          ..",
          "01/31/2026  10:00 AM    <DIR>          My Pictures",
          "01/31/2026  10:00 AM    <DIR>          My Documents",
          "               0 File(s)              0 bytes",
          "               4 Dir(s)  999,999,999 bytes free",
        ]
        break
      case "ver":
        output = ["Microsoft Windows XP [Version 5.1.2600]"]
        break
      case "":
        return
      default:
        output = [`'${cmd}' is not recognized as an internal or external command,`, "operable program or batch file."]
    }

    setHistory((prev) => [
      ...prev,
      { type: "input", text: `C:\\Users\\TskQ>${cmd}` },
      ...output.map((line) => ({ type: "output" as const, text: line })),
      { type: "output", text: "" },
    ])
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      processCommand(input)
      setInput("")
    }
  }

  return (
    <div
      ref={terminalRef}
      className="xp-terminal h-full cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      {history.map((line, i) => (
        <div key={i} className="whitespace-pre font-mono text-sm">
          {line.text}
        </div>
      ))}
      <div className="flex font-mono text-sm">
        <span>C:\Users\TskQ&gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none outline-none text-[#c0c0c0] ml-1"
          autoFocus
        />
      </div>
    </div>
  )
}

// Social links
const socialLinks = [
  { name: "Bluesky", url: "https://bsky.app/profile/tskq.bsky.social", icon: <Camera className="w-8 h-8 text-[#316ac5]" /> },
  { name: "Instagram", url: "https://instagram.com/firas.log", icon: <Instagram className="w-8 h-8 text-[#e1306c]" /> },
  { name: "YouTube", url: "https://youtube.com/@tskku", icon: <Youtube className="w-8 h-8 text-[#ff0000]" /> },
  { name: "Guns.lol", url: "https://guns.lol/tskq", icon: <Globe className="w-8 h-8 text-[#316ac5]" /> },
]

interface WindowState {
  id: string
  title: string
  isOpen: boolean
  isMinimized: boolean
  zIndex: number
}

export function XPDesktop() {
  const [startMenuOpen, setStartMenuOpen] = useState(false)
  const [windows, setWindows] = useState<WindowState[]>([])
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null)
  const [highestZ, setHighestZ] = useState(100)
  const [selectionBox, setSelectionBox] = useState<{ start: { x: number; y: number }; end: { x: number; y: number } } | null>(null)
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)

  const desktopRef = useRef<HTMLDivElement>(null)

  // Desktop icons configuration
  const desktopIcons = [
    { id: "photos", label: "My Pictures", icon: <Camera className="w-10 h-10 text-[#f9d71c]" />, position: { x: 20, y: 20 } },
    { id: "socials", label: "Internet Explorer", icon: <Globe className="w-10 h-10 text-[#0078d7]" />, position: { x: 20, y: 110 } },
    { id: "about", label: "About Me", icon: <Info className="w-10 h-10 text-[#316ac5]" />, position: { x: 20, y: 200 } },
    { id: "terminal", label: "Command Prompt", icon: <TerminalIcon className="w-10 h-10 text-[#c0c0c0]" />, position: { x: 20, y: 290 } },
    { id: "recycle", label: "Recycle Bin", icon: <Trash2 className="w-10 h-10 text-[#808080]" />, position: { x: 20, y: 380 } },
  ]

  const openWindow = useCallback((windowId: string) => {
    setWindows((prev) => {
      const existing = prev.find((w) => w.id === windowId)
      if (existing) {
        return prev.map((w) =>
          w.id === windowId
            ? { ...w, isMinimized: false, zIndex: highestZ + 1 }
            : w
        )
      }
      const titles: Record<string, string> = {
        photos: "My Pictures",
        socials: "Internet Explorer",
        about: "About Me",
        terminal: "Command Prompt",
        recycle: "Recycle Bin",
      }
      return [...prev, { id: windowId, title: titles[windowId] || windowId, isOpen: true, isMinimized: false, zIndex: highestZ + 1 }]
    })
    setHighestZ((z) => z + 1)
  }, [highestZ])

  const closeWindow = useCallback((windowId: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== windowId))
  }, [])

  const minimizeWindow = useCallback((windowId: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === windowId ? { ...w, isMinimized: true } : w))
    )
  }, [])

  const focusWindow = useCallback((windowId: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === windowId ? { ...w, zIndex: highestZ + 1 } : w
      )
    )
    setHighestZ((z) => z + 1)
  }, [highestZ])

  const handleTaskbarItemClick = useCallback((windowId: string) => {
    const win = windows.find((w) => w.id === windowId)
    if (win?.isMinimized) {
      setWindows((prev) =>
        prev.map((w) =>
          w.id === windowId ? { ...w, isMinimized: false, zIndex: highestZ + 1 } : w
        )
      )
      setHighestZ((z) => z + 1)
    } else {
      focusWindow(windowId)
    }
  }, [windows, highestZ, focusWindow])

  // Selection box handling
  const handleDesktopMouseDown = (e: React.MouseEvent) => {
    if (e.target === desktopRef.current) {
      setSelectedIcon(null)
      setStartMenuOpen(false)
      const rect = desktopRef.current.getBoundingClientRect()
      setSelectionBox({
        start: { x: e.clientX - rect.left, y: e.clientY - rect.top },
        end: { x: e.clientX - rect.left, y: e.clientY - rect.top },
      })
      setIsSelecting(true)
    }
  }

  const handleDesktopMouseMove = (e: React.MouseEvent) => {
    if (isSelecting && selectionBox && desktopRef.current) {
      const rect = desktopRef.current.getBoundingClientRect()
      setSelectionBox({
        ...selectionBox,
        end: { x: e.clientX - rect.left, y: e.clientY - rect.top },
      })
    }
  }

  const handleDesktopMouseUp = () => {
    setIsSelecting(false)
    setSelectionBox(null)
  }

  // Render window content
  const renderWindowContent = (windowId: string) => {
    switch (windowId) {
      case "photos":
        return (
          <div className="p-4">
            {selectedPhoto ? (
              <div className="flex flex-col">
                <button
                  className="mb-2 text-sm text-[#316ac5] hover:underline self-start"
                  onClick={() => setSelectedPhoto(null)}
                >
                  ← Back to gallery
                </button>
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.title}
                  className="max-w-full max-h-[400px] object-contain mx-auto"
                />
                <h3 className="mt-2 font-bold">{selectedPhoto.title}</h3>
                <p className="text-sm text-gray-600">{selectedPhoto.description}</p>
              </div>
            ) : (
              <>
                <div className="text-xs text-gray-500 mb-2">Shot with Canon EOS M6</div>
                <div className="grid grid-cols-4 gap-2">
                  {photoData.map((photo) => (
                    <div
                      key={photo.id}
                      className="flex flex-col items-center p-2 hover:bg-[#316ac5]/20 cursor-pointer rounded"
                      onDoubleClick={() => setSelectedPhoto(photo)}
                    >
                      <img
                        src={photo.url}
                        alt={photo.title}
                        className="w-16 h-16 object-cover border border-gray-300"
                      />
                      <span className="text-xs mt-1 text-center truncate w-full">{photo.title}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )
      case "socials":
        return (
          <div className="p-4">
            <div className="xp-ie-toolbar flex items-center gap-2 mb-4 p-2 bg-[#f1efe2] border border-gray-300 rounded">
              <span className="text-xs">Address:</span>
              <div className="flex-1 bg-white border border-gray-400 px-2 py-1 text-xs">
                https://tskq.dev/socials
              </div>
            </div>
            <h2 className="text-lg font-bold mb-4">My Social Links</h2>
            <div className="grid grid-cols-2 gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 border border-gray-300 rounded hover:bg-[#316ac5]/10 transition"
                >
                  {link.icon}
                  <span className="font-medium">{link.name}</span>
                </a>
              ))}
            </div>
          </div>
        )
      case "about":
        return (
          <div className="p-4">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-[#316ac5] rounded-lg flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold">TskQ</h2>
                <p className="text-sm text-gray-600">Photographer & Developer</p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <p>
                I'm a photographer and developer passionate about capturing moments and creating experiences.
              </p>
              <p>
                I shoot with my Canon EOS M6. My work spans urban architecture, nature, and cultural scenes.
              </p>
              <div className="border-t pt-3 mt-4">
                <p className="text-xs text-gray-500">
                  Windows XP Theme by TskQ
                </p>
              </div>
            </div>
          </div>
        )
      case "terminal":
        return <XPTerminalContent />
      case "recycle":
        return (
          <div className="p-4 text-center">
            <Trash2 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-sm text-gray-600">The Recycle Bin is empty.</p>
          </div>
        )
      default:
        return <div className="p-4">Window content</div>
    }
  }

  const getWindowIcon = (windowId: string) => {
    switch (windowId) {
      case "photos":
        return <Camera className="w-4 h-4" />
      case "socials":
        return <Globe className="w-4 h-4" />
      case "about":
        return <Info className="w-4 h-4" />
      case "terminal":
        return <TerminalIcon className="w-4 h-4" />
      case "recycle":
        return <Trash2 className="w-4 h-4" />
      default:
        return <FolderOpen className="w-4 h-4" />
    }
  }

  return (
    <div
      ref={desktopRef}
      className="xp-desktop w-full h-screen overflow-hidden relative select-none"
      onMouseDown={handleDesktopMouseDown}
      onMouseMove={handleDesktopMouseMove}
      onMouseUp={handleDesktopMouseUp}
    >
      {/* Desktop Icons */}
      {desktopIcons.map((icon) => (
        <DesktopIcon
          key={icon.id}
          {...icon}
          isSelected={selectedIcon === icon.id}
          onSelect={() => setSelectedIcon(icon.id)}
          onDoubleClick={() => openWindow(icon.id)}
        />
      ))}

      {/* Selection Box */}
      {selectionBox && isSelecting && (
        <div
          className="xp-selection-box absolute pointer-events-none"
          style={{
            left: Math.min(selectionBox.start.x, selectionBox.end.x),
            top: Math.min(selectionBox.start.y, selectionBox.end.y),
            width: Math.abs(selectionBox.end.x - selectionBox.start.x),
            height: Math.abs(selectionBox.end.y - selectionBox.start.y),
          }}
        />
      )}

      {/* Windows */}
      {windows.map((win) => (
        <XPWindow
          key={win.id}
          id={win.id}
          title={win.title}
          icon={getWindowIcon(win.id)}
          initialPosition={{ x: 150 + windows.indexOf(win) * 30, y: 80 + windows.indexOf(win) * 30 }}
          initialSize={win.id === "photos" ? { width: 600, height: 500 } : { width: 500, height: 400 }}
          onClose={() => closeWindow(win.id)}
          onFocus={() => focusWindow(win.id)}
          zIndex={win.zIndex}
          isMinimized={win.isMinimized}
          onMinimize={() => minimizeWindow(win.id)}
          onRestore={() => handleTaskbarItemClick(win.id)}
        >
          {renderWindowContent(win.id)}
        </XPWindow>
      ))}

      {/* Start Menu */}
      {startMenuOpen && (
        <XPStartMenu
          onClose={() => setStartMenuOpen(false)}
          onOpenWindow={openWindow}
          userName="TskQ"
        />
      )}

      {/* Taskbar */}
      <XPTaskbar
        items={windows.map((w) => ({
          id: w.id,
          title: w.title,
          icon: getWindowIcon(w.id),
          isMinimized: w.isMinimized,
        }))}
        onStartClick={() => setStartMenuOpen(!startMenuOpen)}
        onItemClick={handleTaskbarItemClick}
        startMenuOpen={startMenuOpen}
      />
    </div>
  )
}
