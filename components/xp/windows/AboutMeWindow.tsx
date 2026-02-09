"use client"

import React from "react"
import { Window } from "../Window"

export function AboutMeWindow() {
    return (
        <Window
            id="about"
            title="About Me - Notepad"
            icon="/icons/notepad.ico"
            defaultWidth={500}
            defaultHeight={400}
        >
            <div className="notepad-content">
                {/* Notepad Menu Bar */}
                <div className="notepad-menubar">
                    <span className="menu-item">File</span>
                    <span className="menu-item">Edit</span>
                    <span className="menu-item">Format</span>
                    <span className="menu-item">View</span>
                    <span className="menu-item">Help</span>
                </div>

                {/* Text Content */}
                <div className="notepad-text">
                    {`═══════════════════════════════════════════
                  ABOUT ME
═══════════════════════════════════════════

Hey! I'm fir4s (also known as tsk).

I'm a 17-year-old ILCA 4 sailor and I also like
photography and cinematography. ^-^

───────────────────────────────────────────
                 MY GEAR
───────────────────────────────────────────

📷 Camera: Canon EOS M6
🎬 I love making my videos look like
"memories".

───────────────────────────────────────────
               WHAT I DO
───────────────────────────────────────────

• Photography - Urban architecture,
street photography, nature, and
cultural scenes
• Videography & Editing (mainly coloring and VFX)
• Web Development (with the help of AI -.-)
• Sailing (ILCA 4 class)

───────────────────────────────────────────

Thanks for visiting my little corner of 
the internet! Feel free to explore around.

                               - tskq ♡

═══════════════════════════════════════════`}
                </div>
            </div>
        </Window>
    )
}
