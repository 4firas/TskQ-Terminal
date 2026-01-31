"use client"

import React from "react"
import { Window } from "../Window"

const socialLinks = [
    {
        id: "bsky",
        name: "Bluesky",
        url: "https://bsky.app/profile/tskq.bsky.social",
        icon: "/icons/bluesky.svg"
    },
    {
        id: "instagram",
        name: "Instagram",
        url: "https://instagram.com/firas.log",
        icon: "/icons/instagram.png"
    },
    {
        id: "gunslol",
        name: "Guns.lol",
        url: "https://guns.lol/tskq",
        icon: "/icons/guns.lol.png"
    },
    {
        id: "youtube",
        name: "YouTube",
        url: "https://youtube.com/@tskku",
        icon: "/icons/youtube.svg"
    },
    {
        id: "github",
        name: "GitHub",
        url: "https://github.com/tskq",
        icon: "/icons/github.png"
    }
]

export function SocialsWindow() {
    const handleDoubleClick = (url: string) => {
        window.open(url, "_blank", "noopener,noreferrer")
    }

    return (
        <Window
            id="socials"
            title="Socials"
            icon="/icons/internet.ico"
            defaultWidth={450}
            defaultHeight={350}
        >
            <div className="explorer-window">
                {/* Explorer Toolbar */}
                <div className="explorer-toolbar">
                    <div className="toolbar-buttons">
                        <button className="toolbar-btn" disabled>Back</button>
                        <button className="toolbar-btn" disabled>Forward</button>
                        <button className="toolbar-btn" disabled>Up</button>
                    </div>
                    <div className="address-bar">
                        <span className="address-label">Address</span>
                        <div className="address-input">
                            <img src="/icons/folder.ico" alt="" className="address-icon" />
                            <span>C:\Users\tskq\Socials</span>
                        </div>
                    </div>
                </div>

                {/* File View */}
                <div className="explorer-content">
                    <div className="file-grid">
                        {socialLinks.map(link => (
                            <div
                                key={link.id}
                                className="file-item"
                                onDoubleClick={() => handleDoubleClick(link.url)}
                                title={`Open ${link.name}`}
                            >
                                <div className="file-icon">
                                    <img src={link.icon} alt={link.name} />
                                    <div className="shortcut-arrow">➔</div>
                                </div>
                                <span className="file-name">{link.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Status Bar */}
                <div className="explorer-statusbar">
                    <span>{socialLinks.length} objects</span>
                </div>
            </div>
        </Window>
    )
}
