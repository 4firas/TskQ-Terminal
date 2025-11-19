"use client"

import { useState, useEffect, useRef, type KeyboardEvent } from "react"
import { useRouter } from "next/navigation"
import type React from "react"

interface TerminalProps {
  showArtwork: boolean
  setShowArtwork: (show: boolean) => void
}

interface CommandOutput {
  id: number
  type: "command" | "response" | "matrix"
  content: string | JSX.Element
}

export function Terminal({ showArtwork, setShowArtwork }: TerminalProps) {
  const [input, setInput] = useState("")
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [commandOutputs, setCommandOutputs] = useState<CommandOutput[]>([
    {
      id: 0,
      type: "response",
      content: "Welcome to the terminal. Type 'help' or '?' for available commands.",
    },
  ])
  const [terminalId, setTerminalId] = useState(1)
  const [isTerminating, setIsTerminating] = useState(false)
  const [matrixActive, setMatrixActive] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Sound effects
  const typingSound = useRef<HTMLAudioElement | null>(null)
  const enterSound = useRef<HTMLAudioElement | null>(null)
  const errorSound = useRef<HTMLAudioElement | null>(null)
  const terminateSound = useRef<HTMLAudioElement | null>(null)
  const glitchSound = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Initialize audio elements
    typingSound.current = new Audio("/typing.wav")
    typingSound.current.volume = 0.2

    enterSound.current = new Audio("/enter.wav")
    enterSound.current.volume = 0.3

    errorSound.current = new Audio("/error.mp3")
    errorSound.current.volume = 0.3

    terminateSound.current = new Audio("/terminate.wav")
    terminateSound.current.volume = 0.5

    glitchSound.current = new Audio("/glitch.wav")
    glitchSound.current.volume = 0.4

    // Focus the input on mount
    if (inputRef.current) {
      inputRef.current.focus()
    }

    // Add click event listener to focus input when clicking on terminal
    const handleTerminalClick = () => {
      if (inputRef.current && !isTerminating) {
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
  }, [isTerminating])

  // Scroll to bottom when outputs change
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [commandOutputs])

  const playTypingSound = () => {
    if (typingSound.current) {
      typingSound.current.currentTime = 0
      typingSound.current.play().catch((err) => console.error("Error playing sound:", err))
    }
  }

  const playEnterSound = () => {
    if (enterSound.current) {
      enterSound.current.currentTime = 0
      enterSound.current.play().catch((err) => console.error("Error playing sound:", err))
    }
  }

  const playErrorSound = () => {
    if (errorSound.current) {
      errorSound.current.currentTime = 0
      errorSound.current.play().catch((err) => console.error("Error playing sound:", err))
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
    playTypingSound()
  }

  const processCommand = (command: string) => {
    // Add command to history
    setCommandHistory((prev) => [...prev, command])
    setHistoryIndex(-1)

    // Add command to output
    setCommandOutputs((prev) => [
      ...prev,
      {
        id: terminalId,
        type: "command",
        content: `user@terminal:~$ ${command}`,
      },
    ])

    setTerminalId((prev) => prev + 1)

    // Process command
    const cmd = command.trim().toLowerCase()

    if (cmd === "" || cmd === " ") {
      return
    }

    if (cmd === "help" || cmd === "?") {
      playEnterSound()
      setCommandOutputs((prev) => [
        ...prev,
        {
          id: terminalId + 1,
          type: "response",
          content: (
            <div className="py-2">
              <p className="mb-1">Available commands:</p>
              <p className="pl-4 mb-1">
                <span className="terminal-green">help</span> or <span className="terminal-green">?</span> - Display this
                help message
              </p>
              <p className="pl-4 mb-1">
                <span className="terminal-green">clear</span> - Clear the terminal
              </p>
              <p className="pl-4 mb-1">
                <span className="terminal-green">show_artwork</span> - Display artwork gallery
              </p>
              <p className="pl-4 mb-1">
                <span className="terminal-green">hide_artwork</span> - Hide artwork gallery
              </p>
              <p className="pl-4 mb-1">
                <span className="terminal-green">about</span> - Display information about me
              </p>
              <p className="pl-4 mb-1">
                <span className="terminal-green">social</span> - Display social media links
              </p>
              <p className="pl-4 mb-1">
                <span className="terminal-green">terminate</span> - Terminate the system (easter egg)
              </p>
            </div>
          ),
        },
      ])
      setTerminalId((prev) => prev + 2)
    } else if (cmd === "clear") {
      playEnterSound()
      setCommandOutputs([])
    } else if (cmd === "show_artwork") {
      playEnterSound()
      setShowArtwork(true)
      setCommandOutputs((prev) => [
        ...prev,
        {
          id: terminalId + 1,
          type: "response",
          content: "Displaying artwork gallery...",
        },
      ])
      setTerminalId((prev) => prev + 2)
    } else if (cmd === "hide_artwork") {
      playEnterSound()
      setShowArtwork(false)
      setCommandOutputs((prev) => [
        ...prev,
        {
          id: terminalId + 1,
          type: "response",
          content: "Hiding artwork gallery...",
        },
      ])
      setTerminalId((prev) => prev + 2)
    } else if (cmd === "about") {
      playEnterSound()
      setCommandOutputs((prev) => [
        ...prev,
        {
          id: terminalId + 1,
          type: "response",
          content: (
            <div className="py-2">
              <p className="mb-1">About Me:</p>
              <p className="pl-4 mb-1">
                I'm a digital artist and developer passionate about creating immersive experiences.
              </p>
              <p className="pl-4 mb-1">
                My work spans across various mediums including digital art, web development, and interactive
                installations.
              </p>
            </div>
          ),
        },
      ])
      setTerminalId((prev) => prev + 2)
    } else if (cmd === "social") {
      playEnterSound()
      setCommandOutputs((prev) => [
        ...prev,
        {
          id: terminalId + 1,
          type: "response",
          content: (
            <div className="py-2">
              <p className="mb-1">Social Media Links:</p>
              <p className="pl-4 mb-1">
                <span className="terminal-green">GitHub:</span>{" "}
                <a
                  href="https://github.com/tskq"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  github.com/tskq
                </a>
              </p>
              <p className="pl-4 mb-1">
                <span className="terminal-green">Instagram:</span>{" "}
                <a
                  href="https://www.instagram.com/firas.log"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  instagram.com/tskilca
                </a>
              </p>
              <p className="pl-4 mb-1">
                <span className="terminal-green">Guns.lol:</span>{" "}
                <a
                  href="https://guns.lol/tskq"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  https://guns.lol/tskq
                </a>
              </p>
              <p className="pl-4 mb-1">
                <span className="terminal-green">YouTube:</span>{" "}
                <a
                  href="https://youtube.com/@tskku"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  youtube.com/@tskku
                </a>
              </p>
            </div>
          ),
        },
      ])
      setTerminalId((prev) => prev + 2)
    } else if (cmd === "terminate") {
      if (terminateSound.current) {
        terminateSound.current.play().catch((err) => console.error("Error playing sound:", err))
      }

      setIsTerminating(true)

      // Add termination sequence
      setCommandOutputs((prev) => [
        ...prev,
        {
          id: terminalId + 1,
          type: "error",
          content: "WARNING: System termination initiated...",
        },
      ])

      // Simulate system glitch
      setTimeout(() => {
        if (glitchSound.current) {
          glitchSound.current.play().catch((err) => console.error("Error playing sound:", err))
        }

        setCommandOutputs((prev) => [
          ...prev,
          {
            id: terminalId + 2,
            type: "error",
            content: "CRITICAL ERROR: System failure imminent...",
          },
        ])

        // Add more error messages
        setTimeout(() => {
          setCommandOutputs((prev) => [
            ...prev,
            {
              id: terminalId + 3,
              type: "error",
              content: "Initiating emergency protocols...",
            },
          ])

          setTimeout(() => {
            setCommandOutputs((prev) => [
              ...prev,
              {
                id: terminalId + 4,
                type: "error",
                content: "SYSTEM COMPROMISED. INITIATING MATRIX PROTOCOL...",
              },
            ])

            // Start Matrix effect
            setTimeout(() => {
              setMatrixActive(true)

              // Reset after Matrix effect
              setTimeout(() => {
                window.location.reload()
              }, 5000)
            }, 1500)
          }, 1000)
        }, 1000)
      }, 1000)

      setTerminalId((prev) => prev + 5)
    } else {
      playErrorSound()
      setCommandOutputs((prev) => [
        ...prev,
        {
          id: terminalId + 1,
          type: "error",
          content: `Command not found: ${command}. Type 'help' for available commands.`,
        },
      ])
      setTerminalId((prev) => prev + 2)
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
      // Simple tab completion
      const commands = ["help", "clear", "show_artwork", "hide_artwork", "about", "social", "terminate"]
      const matchingCommands = commands.filter((cmd) => cmd.startsWith(input.toLowerCase()))

      if (matchingCommands.length === 1) {
        setInput(matchingCommands[0])
      }
    }
  }

  return (
    <div
      ref={terminalRef}
      className={`terminal-window w-full h-96 overflow-y-auto p-4 bg-black border border-green-500 font-mono text-sm ${isTerminating ? "glitch" : ""}`}
    >
      {matrixActive && <MatrixEffect />}

      {commandOutputs.map((output) => (
        <div
          key={output.id}
          className={`mb-1 ${output.type === "error" ? "text-red-500" : output.type === "command" ? "terminal-green" : "terminal-white"}`}
        >
          {output.content}
        </div>
      ))}

      {!isTerminating && (
        <div className="flex items-center mt-2">
          <span className="terminal-green mr-2">user@terminal:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-white caret-green-500"
            autoFocus
            aria-label="Terminal input"
          />
        </div>
      )}

      {/* Hidden audio elements */}
      <audio src="/typing.wav" preload="auto" id="typingSound" />
      <audio src="/enter.wav" preload="auto" id="enterSound" />
      <audio src="/error.mp3" preload="auto" id="errorSound" />
      <audio src="/terminate.wav" preload="auto" id="terminateSound" />
      <audio src="/glitch.wav" preload="auto" id="glitchSound" />
    </div>
  )
}

// Matrix effect component
function MatrixEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const fontSize = 16
    const columns = Math.floor(canvas.width / fontSize)

    const drops: number[] = []
    for (let i = 0; i < columns; i++) {
      drops[i] = 1
    }

    const matrix = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}".split("")

    function draw() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = "#00ff00"
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const text = matrix[Math.floor(Math.random() * matrix.length)]
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }

        drops[i]++
      }
    }

    const interval = setInterval(draw, 33)

    return () => clearInterval(interval)
  }, [])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-50" />
}
