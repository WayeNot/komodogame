"use client"

import { useEffect, useRef, useState } from "react"
import Menu from "@/components/Menu";
import { Difficulty, Obstacle } from "@/lib/types";
import Game from "@/components/Game";
import PauseMenu from "@/components/PauseMenu";
import GameOver from "@/components/GameOver";
import MusicBar from "@/components/MusicBar";
import { useMusic } from "@/components/hooks/useAudio";

export default function Home() {
    const SCREEN_WIDTH = 600
    const SCREEN_HEIGHT = 900
    const PLAYER_SIZE = 100
    const PLAYER_X = 100
    const PIPE_WIDTH = 70
    const GAP = 220
    const GRAVITY = 0.45
    const JUMP = -9

    const [displayMenu, setDisplayMenu] = useState(true)
    const [displayGame, setDisplayGame] = useState(false)
    const [displayPauseMenu, setDisplayPauseMenu] = useState(false)
    const [displayGameOver, setDisplayGameOver] = useState(false)
    const [score, setScore] = useState(0)
    const [bestScore, setBestScore] = useState(0)
    const [playerY, setPlayerY] = useState(300)
    const velocityRef = useRef(0)
    const [obstacles, setObstacles] = useState<Obstacle[]>([])
    const [soundMuted, setSoundMuted] = useState(false)
    const [difficulty, setDifficulty] = useState<Difficulty | string>("Facile")

    const gameLoop = useRef<NodeJS.Timeout | null>(null)
    const scoreRef = useRef(0)

    useEffect(() => {
        const saved = localStorage.getItem("komodo_best")
        saved && setBestScore(Number(saved))
    }, [])

    useEffect(() => {
        scoreRef.current = score
    }, [score])

    const musics = [
        { author: "Eric Skiff", label: "Underclocked", audio: "1.mp4", cover: "https://imgs.search.brave.com/lhfq0tPM4kAm4SIrpqWu7T1xCEy6A3arayMDG9uGOKE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pMS5z/bmRjZG4uY29tL2Fy/dHdvcmtzLTAwMDAx/OTU5MzY0NS1jaXdv/amctdDEwODB4MTA4/MC5qcGc" },
        { author: "Density & Time", label: "MAZE", audio: "2.mp4", cover: "https://imgs.search.brave.com/sNsHQH8fvVak7ruMcVbAJULXUL7WYW0Kf4wKUEYCSNU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zb3Vy/Y2UuYm9vbXBsYXlt/dXNpYy5jb20vZ3Jv/dXAxMC9NMDAvMDQv/MTAvY2U4MGIxN2Fm/ZjE4NGNiNTk4NDQx/MzEzNzYyOTQ5Yzdf/MzIwXzMyMC5qcGc" },
        { author: "Jeremy Blake", label: "Powerup!", audio: "3.mp4", cover: "https://imgs.search.brave.com/-awO8gSP7bhndsZoDJr1EWgQKGwGSvDgwMjZb28e8q8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pMS5z/bmRjZG4uY29tL2Fy/dHdvcmtzLXlEajBM/WE03MmYwTWpjMzEt/MVdzc3l3LXQxMDgw/eDEwODAuanBn" },
    ]

    const { current, playRandom, skip } = useMusic(musics, soundMuted)

    const startGame = () => {
        gameLoop.current && clearInterval(gameLoop.current)

        setDisplayMenu(false)
        setDisplayPauseMenu(false)
        setDisplayGame(true)
        setDisplayGameOver(false)
        setScore(0)
        setPlayerY(300)
        setObstacles([{ id: String(Date.now()), x: SCREEN_WIDTH + 200, topHeight: Math.random() * 250 + 100, passed: false }])

        velocityRef.current = 0
        playRandom()
    }

    useEffect(() => {
        if (!soundMuted) return
    }, [soundMuted])

    const playJumpSound = () => {
        const audio = new Audio("/audio/jump.mp3")
        audio.volume = soundMuted ? 0.0 : 0.4
        audio.play()
    }

    const playGameOverSound = () => {
        const audio = new Audio("/audio/gameOver.mp3")
        audio.volume = soundMuted ? 0.0 : 0.4
        audio.play()
    }

    const playSuccessSound = () => {
        const audio = new Audio("/audio/success.mp3")
        audio.volume = soundMuted ? 0.0 : 0.4
        audio.play()
    }

    const jump = () => {
        if (!displayGame) return
        velocityRef.current = JUMP
        playJumpSound()
    }

    const endGame = () => {
        playGameOverSound()

        gameLoop.current && clearInterval(gameLoop.current)
        setDisplayGame(false)
        setDisplayGameOver(true)

        if (score > bestScore) {
            setBestScore(score)
            localStorage.setItem(
                "komodo_best",
                score.toString()
            )
        }
    }

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.code === "Space") {
                e.preventDefault()
                jump()
            }
        }

        window.addEventListener("keydown", handleKey)
        return () => window.removeEventListener("keydown", handleKey)
    }, [displayGame])

    useEffect(() => {
        if (!displayGame) return

        const difficultyMultiplier = { Facile: 1, Intermédiaire: 1.25, Difficile: 1.5 }[difficulty]

        gameLoop.current = setInterval(() => {
            velocityRef.current = Math.min(velocityRef.current + GRAVITY, 12)

            setPlayerY((prev) => prev + velocityRef.current)

            const speed = (4 + Math.min(scoreRef.current * 0.08, 3)) * (difficultyMultiplier || 1)

            const spacing = Math.max(170, 240 - scoreRef.current * 1.5)

            setObstacles((prev) => {
                let updated = prev.map((obs) => ({ ...obs, x: obs.x - speed })).filter((obs) => obs.x > -PIPE_WIDTH - 100)

                const lastPipe = updated[updated.length - 1]

                if (!lastPipe || lastPipe.x < SCREEN_WIDTH - spacing) {
                    updated.push({
                        id: crypto.randomUUID(),
                        x: SCREEN_WIDTH + 80,
                        topHeight: Math.random() * 320 + 60,
                        passed: false
                    })
                }

                return updated
            })

        }, 16)

        return () => {
            gameLoop.current && clearInterval(gameLoop.current)
        }

    }, [displayGame, difficulty])

    useEffect(() => {
        if (!displayGame) return

        const playerTop = playerY
        const playerBottom = playerY + PLAYER_SIZE
        const playerLeft = PLAYER_X + 8
        const playerRight = PLAYER_X + PLAYER_SIZE - 8

        if (playerTop <= 0 || playerBottom >= SCREEN_HEIGHT) {
            endGame()
            return
        }

        for (const obs of obstacles) {
            const pipeLeft = obs.x + 6
            const pipeRight = obs.x + PIPE_WIDTH - 6

            const gapTop = obs.topHeight
            const gapBottom = obs.topHeight + GAP

            const hitX = playerRight > pipeLeft && playerLeft < pipeRight
            const hitTop = playerTop + 10 < gapTop
            const hitBottom = playerBottom - 10 > gapBottom

            if (hitX && (hitTop || hitBottom)) {
                endGame()
                return
            }

            if (!obs.passed && obs.x + PIPE_WIDTH < PLAYER_X) {
                obs.passed = true

                setScore((p) => p + 1)
                playSuccessSound()
            }
        }
    }, [playerY, obstacles, displayGame])

    return (
        <div className="relative h-screen w-screen bg-black overflow-hidden flex items-center justify-center">
            <div className={`relative overflow-hidden rounded-[20px] w-150 h-225 bg-center bg-cover bg-[url("https://freedesignfile.com/upload/2018/02/Underwater-world-game-background-vector-01.jpg")]`}>
                {displayGame && <Game SCREEN_WIDTH={SCREEN_WIDTH} SCREEN_HEIGHT={SCREEN_HEIGHT} PLAYER_SIZE={PLAYER_SIZE} PLAYER_X={PLAYER_X} PLAYER_Y={playerY} PIPE_WIDTH={PIPE_WIDTH} GAP={GAP} obstacles={obstacles} velocityRef={velocityRef} gameLoop={gameLoop} score={score} jump={jump} endGame={endGame} setDisplayGame={(v) => setDisplayGame(v)} setDisplayPauseMenu={(v) => setDisplayPauseMenu(v)} />}
                {displayMenu && <Menu bestScore={bestScore} difficulty={difficulty} setDifficulty={v => setDifficulty(v)} startGame={startGame} />}
                {displayPauseMenu && <PauseMenu setDisplayPauseMenu={v => setDisplayPauseMenu(v)} setDisplayGame={v => setDisplayGame(v)} setDisplayMenu={v => setDisplayMenu(v)} />}
                {displayGameOver && <GameOver setDisplayMenu={v => setDisplayMenu(v)} setDisplayGameOver={v => setDisplayGameOver(v)} startGame={startGame} score={score} bestScore={bestScore} />}
            </div>
            <MusicBar music={current ?? null} muted={soundMuted} toggleMute={() => setSoundMuted(!soundMuted)} skip={skip} />
        </div >
    )
}