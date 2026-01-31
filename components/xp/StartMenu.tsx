"use client"

import React from "react"
import { useWindowManager } from "./WindowManagerContext"

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

interface StartMenuProps {
    onClose: () => void
    presenceData: DiscordPresenceData | null
}

export function StartMenu({ onClose, presenceData }: StartMenuProps) {
    const { openWindow } = useWindowManager()

    const handleOpenWindow = (id: string, title: string, component: string, icon?: string) => {
        openWindow(id, title, component, icon)
        onClose()
    }

    const statusColor = {
        online: "#43b581",
        idle: "#faa61a",
        dnd: "#f04747",
        offline: "#747f8d"
    }

    const customStatus = presenceData?.activities.find(a => a.type === 4 && a.state)

    return (
        <>
            {/* Overlay to close menu */}
            <div
                className="start-menu-overlay"
                onClick={onClose}
            />

            {/* Start Menu Panel */}
            <div className="xp-start-menu">
                {/* User Header */}
                <div className="start-menu-header">
                    <div className="start-menu-avatar">
                        {presenceData?.discord_user?.avatar ? (
                            <img
                                src={`https://cdn.discordapp.com/avatars/${presenceData.discord_user.id}/${presenceData.discord_user.avatar}.png?size=64`}
                                alt="User Avatar"
                            />
                        ) : (
                            <div className="default-avatar">👤</div>
                        )}
                        {presenceData && (
                            <div
                                className="status-indicator"
                                style={{ backgroundColor: statusColor[presenceData.discord_status] }}
                            />
                        )}
                    </div>
                    <div className="start-menu-user-info">
                        <span className="start-menu-username">tskq</span>
                        {customStatus && (
                            <span className="start-menu-status">{customStatus.state}</span>
                        )}
                    </div>
                </div>

                {/* Menu Content */}
                <div className="start-menu-content">
                    {/* Left Column - Pinned/Frequent */}
                    <div className="start-menu-left">
                        <div className="start-menu-section">
                            <button
                                className="start-menu-item"
                                onClick={() => handleOpenWindow("about", "About Me - Notepad", "about", "/icons/notepad.ico")}
                            >
                                <img src="/icons/notepad.ico" alt="" className="menu-icon" />
                                <span>About Me</span>
                            </button>

                            <button
                                className="start-menu-item"
                                onClick={() => handleOpenWindow("socials", "Socials", "socials", "/icons/internet.ico")}
                            >
                                <img src="/icons/internet.ico" alt="" className="menu-icon" />
                                <span>My Socials</span>
                            </button>

                            <button
                                className="start-menu-item"
                                onClick={() => handleOpenWindow("artwork", "Artwork", "artwork", "/icons/artwork.ico")}
                            >
                                <img src="/icons/artwork.ico" alt="" className="menu-icon" />
                                <span>Artwork Gallery</span>
                            </button>

                            <button
                                className="start-menu-item"
                                onClick={() => handleOpenWindow("terminal", "Command Prompt", "terminal", "/icons/terminal.ico")}
                            >
                                <img src="/icons/terminal.ico" alt="" className="menu-icon" />
                                <span>Command Prompt</span>
                            </button>
                        </div>

                        <div className="start-menu-separator" />

                        <div className="start-menu-section">
                            <span className="section-title">All Programs</span>
                        </div>
                    </div>

                    {/* Right Column - Places */}
                    <div className="start-menu-right">
                        <button
                            className="start-menu-item place-item"
                            onClick={() => handleOpenWindow("about", "About Me - Notepad", "about", "/icons/mycomputer.ico")}
                        >
                            <img src="/icons/mycomputer.ico" alt="" className="menu-icon" />
                            <span>My Computer</span>
                        </button>

                        <button
                            className="start-menu-item place-item"
                            onClick={() => handleOpenWindow("socials", "Socials", "socials", "/icons/mydocuments.ico")}
                        >
                            <img src="/icons/mydocuments.ico" alt="" className="menu-icon" />
                            <span>My Documents</span>
                        </button>

                        <button
                            className="start-menu-item place-item"
                            onClick={() => handleOpenWindow("pictures", "My Pictures", "pictures", "/icons/pictures.ico")}
                        >
                            <img src="/icons/pictures.ico" alt="" className="menu-icon" />
                            <span>My Pictures</span>
                        </button>

                        <div className="start-menu-separator" />

                        <a
                            href="https://github.com/tskq"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="start-menu-item place-item"
                        >
                            <img src="/icons/github.png" alt="" className="menu-icon" />
                            <span>GitHub</span>
                        </a>
                    </div>
                </div>

                {/* Footer */}
                <div className="start-menu-footer">
                    <button className="footer-button">
                        <span>Log Off</span>
                    </button>
                    <button className="footer-button">
                        <span>Turn Off Computer</span>
                    </button>
                </div>
            </div>
        </>
    )
}
