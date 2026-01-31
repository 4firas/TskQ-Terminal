"use client"

import React, { useState, useEffect, useRef, type KeyboardEvent } from "react"
import { Window } from "../Window"

interface CommandOutput {
    id: number
    type: "command" | "response" | "error"
    content: string | JSX.Element
}

export function TerminalWindow() {
    const [input, setInput] = useState("")
    const [commandHistory, setCommandHistory] = useState<string[]>([])
    const [historyIndex, setHistoryIndex] = useState(-1)
    const [commandOutputs, setCommandOutputs] = useState<CommandOutput[]>([
        {
            id: 0,
            type: "response",
            content: "Microsoft Windows XP [Version 5.1.2600]\n(C) Copyright 1985-2001 Microsoft Corp.\n\nType 'help' for available commands.",
        },
    ])
    const [terminalId, setTerminalId] = useState(1)

    const inputRef = useRef<HTMLInputElement>(null)
    const terminalRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
        }

        const handleTerminalClick = () => {
            if (inputRef.current) {
                inputRef.current.focus()
            }
        }

        if (terminalRef.current) {
            terminalRef.current.addEventListener("click", handleTerminalClick)
        }

        return () => {
            if (terminalRef.current) {
                terminalRef.current.removeEventListener("click", handleTerminalClick)
            }
        }
    }, [])

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight
        }
    }, [commandOutputs])

    const processCommand = (command: string) => {
        setCommandHistory(prev => [...prev, command])
        setHistoryIndex(-1)

        setCommandOutputs(prev => [
            ...prev,
            {
                id: terminalId,
                type: "command",
                content: `C:\\Users\\tskq> ${command}`,
            },
        ])

        setTerminalId(prev => prev + 1)

        const cmd = command.trim().toLowerCase()

        if (cmd === "" || cmd === " ") {
            return
        }

        if (cmd === "help" || cmd === "?") {
            setCommandOutputs(prev => [
                ...prev,
                {
                    id: terminalId + 1,
                    type: "response",
                    content: `
Available commands:
  help, ?     - Display this help message
  clear, cls  - Clear the terminal
  about       - Display information about me
  social      - Display social media links
  dir         - List directory contents
  echo [msg]  - Echo a message
  date        - Display current date
  time        - Display current time
  ver         - Display version information
          `.trim(),
                },
            ])
            setTerminalId(prev => prev + 2)
        } else if (cmd === "clear" || cmd === "cls") {
            setCommandOutputs([])
        } else if (cmd === "about") {
            setCommandOutputs(prev => [
                ...prev,
                {
                    id: terminalId + 1,
                    type: "response",
                    content: `
═══════════════════════════════════════════
                  ABOUT ME
═══════════════════════════════════════════

Hey! I'm tskq (also known as tsk or tskku).

I'm a 16-year-old ILCA 4 sailor with a passion
for photography, videography, and cinematography.

Camera: Canon EOS M6

═══════════════════════════════════════════
          `.trim(),
                },
            ])
            setTerminalId(prev => prev + 2)
        } else if (cmd === "social") {
            setCommandOutputs(prev => [
                ...prev,
                {
                    id: terminalId + 1,
                    type: "response",
                    content: `
Social Media Links:
  Bluesky   : https://bsky.app/profile/tskq.bsky.social
  Instagram : https://instagram.com/firas.log
  Guns.lol  : https://guns.lol/tskq
  YouTube   : https://youtube.com/@tskku
  GitHub    : https://github.com/tskq
          `.trim(),
                },
            ])
            setTerminalId(prev => prev + 2)
        } else if (cmd === "dir") {
            setCommandOutputs(prev => [
                ...prev,
                {
                    id: terminalId + 1,
                    type: "response",
                    content: `
 Volume in drive C is TSKQ
 Directory of C:\\Users\\tskq

01/31/2026  04:30 PM    <DIR>          .
01/31/2026  04:30 PM    <DIR>          ..
01/31/2026  04:30 PM    <DIR>          My Documents
01/31/2026  04:30 PM    <DIR>          My Pictures
01/31/2026  04:30 PM             1,337 about.txt
01/31/2026  04:30 PM    <DIR>          Socials
               1 File(s)          1,337 bytes
               5 Dir(s)  420,690,000 bytes free
          `.trim(),
                },
            ])
            setTerminalId(prev => prev + 2)
        } else if (cmd.startsWith("echo ")) {
            const message = command.substring(5)
            setCommandOutputs(prev => [
                ...prev,
                {
                    id: terminalId + 1,
                    type: "response",
                    content: message,
                },
            ])
            setTerminalId(prev => prev + 2)
        } else if (cmd === "date") {
            setCommandOutputs(prev => [
                ...prev,
                {
                    id: terminalId + 1,
                    type: "response",
                    content: `The current date is: ${new Date().toLocaleDateString()}`,
                },
            ])
            setTerminalId(prev => prev + 2)
        } else if (cmd === "time") {
            setCommandOutputs(prev => [
                ...prev,
                {
                    id: terminalId + 1,
                    type: "response",
                    content: `The current time is: ${new Date().toLocaleTimeString()}`,
                },
            ])
            setTerminalId(prev => prev + 2)
        } else if (cmd === "ver") {
            setCommandOutputs(prev => [
                ...prev,
                {
                    id: terminalId + 1,
                    type: "response",
                    content: `Microsoft Windows XP [Version 5.1.2600]`,
                },
            ])
            setTerminalId(prev => prev + 2)
        } else {
            setCommandOutputs(prev => [
                ...prev,
                {
                    id: terminalId + 1,
                    type: "error",
                    content: `'${command}' is not recognized as an internal or external command,\noperable program or batch file.`,
                },
            ])
            setTerminalId(prev => prev + 2)
        }

        setInput("")
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            processCommand(input)
        } else if (e.key === "ArrowUp") {
            e.preventDefault()
            if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
                const newIndex = historyIndex + 1
                setHistoryIndex(newIndex)
                setInput(commandHistory[commandHistory.length - 1 - newIndex])
            }
        } else if (e.key === "ArrowDown") {
            e.preventDefault()
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1
                setHistoryIndex(newIndex)
                setInput(commandHistory[commandHistory.length - 1 - newIndex])
            } else if (historyIndex === 0) {
                setHistoryIndex(-1)
                setInput("")
            }
        } else if (e.key === "Tab") {
            e.preventDefault()
            const commands = ["help", "clear", "cls", "about", "social", "dir", "echo", "date", "time", "ver"]
            const matchingCommands = commands.filter(cmd => cmd.startsWith(input.toLowerCase()))
            if (matchingCommands.length === 1) {
                setInput(matchingCommands[0])
            }
        }
    }

    return (
        <Window
            id="terminal"
            title="Command Prompt"
            icon="/icons/terminal.ico"
            defaultWidth={680}
            defaultHeight={400}
        >
            <div ref={terminalRef} className="cmd-terminal">
                {commandOutputs.map(output => (
                    <div
                        key={output.id}
                        className={`cmd-line ${output.type === "error" ? "cmd-error" : ""}`}
                    >
                        <pre>{output.content}</pre>
                    </div>
                ))}

                <div className="cmd-input-line">
                    <span className="cmd-prompt">C:\Users\tskq&gt;</span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="cmd-input"
                        autoFocus
                        aria-label="Command input"
                    />
                </div>
            </div>
        </Window>
    )
}
