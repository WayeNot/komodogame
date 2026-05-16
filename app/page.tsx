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
    const PLAYER_SIZE = 80
    const PLAYER_X = 80
    const PIPE_WIDTH = 70
    const GAP = 220
    const GRAVITY = 0.45
    const JUMP = -9

    const main_character = "/characters/komodo.png"

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
        { author: "Eric Skiff", label: "Underclocked", audio: "1.mp3", cover: "1.webp" },
        { author: "Density & Time", label: "MAZE", audio: "2.mp3", cover: "2.webp" },
        { author: "Jeremy Blake", label: "Powerup!", audio: "3.mp3", cover: "3.webp" },
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
        setObstacles([{ id: crypto.randomUUID(), x: SCREEN_WIDTH + 200, topHeight: Math.random() * 250 + 100, passed: false }])

        velocityRef.current = 0
        playRandom()
    }

    useEffect(() => {
        if (!soundMuted) return
    }, [soundMuted])

    const playSound = (sound: string) => {
        const audio = new Audio(`/audio/sound/${sound}.mp3`)
        audio.volume = soundMuted ? 0.0 : 0.4
        audio.play()
    }

    const jump = () => {
        if (!displayGame) return
        velocityRef.current = JUMP
        playSound("jump")
    }

    const endGame = () => {
        playSound("gameOver")

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
                setObstacles(prev => prev.map(o => o.id === obs.id ? { ...o, passed: true } : o))

                setScore(p => {
                    const next = p + 1

                    if (score === bestScore) {
                        playSound("bestScore")
                    } else {
                        playSound("success")
                    }
                    return next
                })
            }
        }
    }, [playerY, obstacles, displayGame])

    return (
        <div className="relative h-screen w-screen bg-black overflow-hidden flex items-center justify-center">
            <div className={`relative overflow-hidden rounded-[20px] w-150 h-225 bg-center bg-cover ${(displayMenu || displayPauseMenu) && "bg-[url('/backgrounds/menu.png')]"} ${(displayGame) && "bg-[url('/backgrounds/game.png')]"} ${(displayGameOver) && "bg-[url('/backgrounds/gameOver.png')]"}`}>
                {displayGame && <Game SCREEN_WIDTH={SCREEN_WIDTH} SCREEN_HEIGHT={SCREEN_HEIGHT} PLAYER_SIZE={PLAYER_SIZE} PLAYER_X={PLAYER_X} PLAYER_Y={playerY} PIPE_WIDTH={PIPE_WIDTH} GAP={GAP} main_character={main_character} obstacles={obstacles} velocityRef={velocityRef} gameLoop={gameLoop} score={score} bestScore={bestScore} jump={jump} endGame={endGame} setDisplayGame={(v) => setDisplayGame(v)} setDisplayPauseMenu={(v) => setDisplayPauseMenu(v)} />}
                {displayMenu && <Menu main_character={main_character} bestScore={bestScore} difficulty={difficulty} setDifficulty={v => setDifficulty(v)} startGame={startGame} />}
                {displayPauseMenu && <PauseMenu setDisplayPauseMenu={v => setDisplayPauseMenu(v)} setDisplayGame={v => setDisplayGame(v)} setDisplayMenu={v => setDisplayMenu(v)} />}
                {displayGameOver && <GameOver setDisplayMenu={v => setDisplayMenu(v)} setDisplayGameOver={v => setDisplayGameOver(v)} startGame={startGame} score={score} bestScore={bestScore} />}
            </div>
            <MusicBar music={current ?? null} muted={soundMuted} toggleMute={() => setSoundMuted(!soundMuted)} skip={skip} />
        </div >
    )
}