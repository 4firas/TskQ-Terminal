"use client"

import React, { useState, useEffect } from "react"
import { useWindowManager } from "./WindowManagerContext"
import { StartMenu } from "./StartMenu"

interface DiscordPresenceData {
    discord_user: {
        username: string
        avatar: string
        id: string
    }
    discord_status: "online" | "idle" | "dnd" | "offline"
    activities: Array<{
        type: number
        name: string
        state?: string
    }>
}

interface TaskbarProps {
    userId?: string
}

export function Taskbar({ userId = "1002839537644482611" }: TaskbarProps) {
    const { windows, focusWindow, restoreWindow, minimizeWindow } = useWindowManager()
    const [startMenuOpen, setStartMenuOpen] = useState(false)
    const [currentTime, setCurrentTime] = useState("")
    const [presenceData, setPresenceData] = useState<DiscordPresenceData | null>(null)

    // Clock
    useEffect(() => {
        const tick = () => {
            const now = new Date()
            const hours = now.getHours()
            const minutes = now.getMinutes()
            const ampm = hours >= 12 ? "PM" : "AM"
            const displayHours = hours % 12 || 12
            const displayMinutes = minutes.toString().padStart(2, "0")
            setCurrentTime(`${displayHours}:${displayMinutes} ${ampm}`)
        }
        tick()
        const id = setInterval(tick, 1000)
        return () => clearInterval(id)
    }, [])

    // Fetch Discord presence
    useEffect(() => {
        const fetchPresence = async () => {
            try {
                const res = await fetch(`https://api.lanyard.rest/v1/users/${userId}`)
                if (res.ok) {
                    const json = await res.json()
                    if (json.success) {
                        setPresenceData(json.data)
                    }
                }
            } catch (err) {
                console.error("Failed to fetch Discord presence:", err)
            }
        }
        fetchPresence()
        const interval = setInterval(fetchPresence, 30000)
        return () => clearInterval(interval)
    }, [userId])

    const openWindows = windows.filter(w => w.isOpen)

    const handleTaskbarClick = (windowId: string) => {
        const window = windows.find(w => w.id === windowId)
        if (window) {
            if (window.isMinimized) {
                restoreWindow(windowId)
            } else {
                // Check if it's the topmost window
                const maxZ = Math.max(...windows.filter(w => w.isOpen && !w.isMinimized).map(w => w.zIndex))
                if (window.zIndex === maxZ) {
                    minimizeWindow(windowId)
                } else {
                    focusWindow(windowId)
                }
            }
        }
    }

    return (
        <>
            {/* Start Menu */}
            {startMenuOpen && (
                <StartMenu
                    onClose={() => setStartMenuOpen(false)}
                    presenceData={presenceData}
                />
            )}

            {/* Taskbar */}
            <div className="xp-taskbar">
                {/* Start Button */}
                <button
                    className="xp-start-button"
                    onClick={() => setStartMenuOpen(!startMenuOpen)}
                >
                    <img
                        src="/icons/windows.ico"
                        alt="Windows"
                        className="start-logo"
                    />
                    <span>start</span>
                </button>

                {/* Quick Launch Separator */}
                <div className="taskbar-separator" />

                {/* Window Tabs */}
                <div className="taskbar-windows">
                    {openWindows.map(window => (
                        <button
                            key={window.id}
                            className={`taskbar-window-button ${!window.isMinimized ? "active" : ""}`}
                            onClick={() => handleTaskbarClick(window.id)}
                        >
                            {window.icon && (
                                <img src={window.icon} alt="" className="taskbar-window-icon" />
                            )}
                            <span className="taskbar-window-title">{window.title}</span>
                        </button>
                    ))}
                </div>

                {/* System Tray */}
                <div className="system-tray">
                    {/* Volume Icon */}
                    <div className="tray-icon" title="Volume">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="white">
                            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                        </svg>
                    </div>

                    {/* Clock */}
                    <div className="tray-clock">
                        {currentTime}
                    </div>
                </div>
            </div>
        </>
    )
}
