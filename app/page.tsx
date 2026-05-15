"use client"

import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { FaGamepad, FaHamburger } from "react-icons/fa"
import { IoSettings } from "react-icons/io5"
import { TbLogout2 } from "react-icons/tb"
import { VscUnmute, VscMute } from "react-icons/vsc";
import { MdSkipNext } from "react-icons/md";

type Obstacle = {
    id: number
    x: number
    topHeight: number
    passed: boolean
}

export default function Home() {
    const GAME_WIDTH = 420
    const GAME_HEIGHT = 800
    const PLAYER_SIZE = 70
    const PLAYER_X = 70
    const PIPE_WIDTH = 70
    const GAP = 220
    const GRAVITY = 0.45
    const JUMP = -9

    const [displayMenu, setDisplayMenu] = useState(true)
    const [displayGame, setDisplayGame] = useState(false)
    const [displayBurger, setDisplayBurger] = useState(false)
    const [displaySettings, setDisplaySettings] = useState(false)
    const [displayGameOver, setDisplayGameOver] = useState(false)
    const [score, setScore] = useState(0)
    const [bestScore, setBestScore] = useState(0)
    const [playerY, setPlayerY] = useState(300)
    const velocityRef = useRef(0)
    const [obstacles, setObstacles] = useState<Obstacle[]>([])
    const [soundMuted, setSoundMuted] = useState(false)
    const [difficulty, setDifficulty] = useState("Facile")

    const gameLoop = useRef<NodeJS.Timeout | null>(null)
    const gameMusic = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        const saved = localStorage.getItem("komodo_best")
        saved && setBestScore(Number(saved))
    }, [])

    const setGameMusic = () => {
        if (gameMusic.current) {
            gameMusic.current.pause()
            gameMusic.current.currentTime = 0
        }
        const audio = new Audio(`/audio/music/${Math.floor(Math.random() * 4) + 1}.m4a`)
        audio.volume = 0.02
        audio.play()
        gameMusic.current = audio
    }

    const startGame = () => {
        setGameMusic()

        gameLoop.current && clearInterval(gameLoop.current)

        setDisplayMenu(false)
        setDisplayBurger(false)
        setDisplaySettings(false)
        setDisplayGame(true)
        setDisplayGameOver(false)
        setScore(0)
        setPlayerY(300)
        setObstacles([{ id: Date.now(), x: GAME_WIDTH + 200, topHeight: Math.random() * 250 + 100, passed: false }])

        velocityRef.current = 0
    }

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
                e.preventDefault();
                jump();
            };
        };

        window.addEventListener("keydown", handleKey)

        return () => window.removeEventListener("keydown", handleKey)
    }, [displayGame])

    useEffect(() => {
        if (!displayGame) return

        gameLoop.current = setInterval(() => {
            velocityRef.current += GRAVITY
            setPlayerY((prev) => prev + velocityRef.current)
            setObstacles((prev) => {
                let updated = prev.map((obs) => ({ ...obs, x: obs.x - (4 + score * 0.12) }))
                updated = updated.filter((obs) => obs.x > -PIPE_WIDTH - 100)
                const lastPipe = updated[updated.length - 1]
                !lastPipe || lastPipe.x < GAME_WIDTH - 240 && updated.push({ id: Date.now() + Math.random(), x: GAME_WIDTH + 80, topHeight: Math.random() * 320 + 60, passed: false })
                return updated
            })
        }, 16)

        return () => { gameLoop.current && clearInterval(gameLoop.current) }
    }, [displayGame, score])

    useEffect(() => {
        if (!displayGame) return

        const playerTop = playerY
        const playerBottom = playerY + PLAYER_SIZE

        const playerLeft = PLAYER_X + 8
        const playerRight = PLAYER_X + PLAYER_SIZE - 8

        if (playerTop <= 0 || playerBottom >= GAME_HEIGHT) { endGame(); return }

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
        <div className="h-screen flex items-center justify-center bg-black overflow-hidden">
            {displayMenu && (
                <div className="w-[420px] h-[800px] rounded-[20px] overflow-hidden flex items-center justify-center flex-col gap-10 bg-[url(https://freedesignfile.com/upload/2018/02/Underwater-world-game-background-vector-01.jpg)] bg-cover bg-center">
                    <motion.div animate={{ rotate: [0, -3, 3, -2, 2, 0], y: [0, -6, 0], scale: [1, 1.02, 1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", }} className="flex items-center gap-3"><motion.h2 animate={{ textShadow: ["0px 0px 0px rgba(255,255,255,0)", "0px 0px 20px rgba(255,255,255,0.4)", "0px 0px 0px rgba(255,255,255,0)"] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="text-4xl font-bold italic text-white drop-shadow-2xl">Komodo Game</motion.h2><motion.img animate={{ y: [0, -10, 0], rotate: [0, 2, -2, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }} className="w-24 drop-shadow-2xl" src="komodo.png" alt="Komodo" /></motion.div>
                    <div className="flex flex-col w-full items-center">
                        <div className="flex items-center gap-2">
                            {["Facile", "Intermédiaire", "Difficile"].map((v, k) => (
                                <button key={k} onClick={() => setDifficulty(v)} className={`px-4 py-2 rounded-xl text-white font-bold ${v === difficulty ? "bg-white/60" : "bg-white/20"} backdrop-blur-md border border-white/30 shadow-lg hover:bg-white/30 hover:scale-105 active:scale-95 transition-all duration-500 cursor-pointer`}>{v}</button>
                            ))}
                        </div>
                        <div className="flex items-center w-full justify-center gap-3 my-3">
                            <button onClick={startGame} className="w-fit p-4 bg-white/30 rounded-xl hover:bg-white/20 transition duration-500 cursor-pointer flex items-center justify-center gap-3 text-white font-bold backdrop-blur-md"><FaGamepad size={24} />Jouer</button>
                            <div className="flex items-center gap-2">
                                <div onClick={() => setSoundMuted(!soundMuted)} className="w-fit p-4 text-[25px] py-4 bg-white/30 rounded-xl hover:bg-white/20 transition duration-500 cursor-pointer flex items-center justify-center gap-3 text-white font-bold backdrop-blur-2xl">{soundMuted ? <VscMute /> : <VscUnmute />}</div>
                                <div onClick={setGameMusic} className="w-fit p-4 text-[25px] py-4 bg-white/30 rounded-xl hover:bg-white/20 transition duration-500 cursor-pointer flex items-center justify-center gap-3 text-white font-bold backdrop-blur-2xl"><MdSkipNext /></div>
                            </div>
                        </div>
                        <p className="font-bold text-center text-white/70">Meilleur score : <span className="text-2xl">{bestScore}</span></p>
                    </div>
                </div>
            )}
            {displayGame && (
                <div className="relative overflow-hidden rounded-[20px]" style={{ width: GAME_WIDTH, height: GAME_HEIGHT, backgroundImage: "url(https://freedesignfile.com/upload/2018/02/Underwater-world-game-background-vector-01.jpg)", backgroundSize: "cover", backgroundPosition: "center" }} onClick={jump}>
                    <motion.div animate={{ x: [0, -40, 0] }} transition={{ duration: 8, repeat: Infinity }} className="absolute inset-0 bg-black/10" />
                    <motion.div key={score} initial={{ scale: 1.6 }} animate={{ scale: 1 }} className="absolute top-4 left-4 z-50 text-white text-4xl font-black drop-shadow-2xl">{score}</motion.div>
                    <div className="absolute top-4 right-4 z-50"><FaHamburger size={26} className="text-white cursor-pointer hover:text-orange-400 transition" onClick={() => { gameLoop.current && clearInterval(gameLoop.current); setDisplayGame(false); setDisplayBurger(true) }} /></div>
                    <motion.img animate={{ rotate: velocityRef.current * 3, y: [0, -3, 0] }} transition={{ duration: 0.15 }} src="komodo.png" alt="Komodo" className="absolute z-40 drop-shadow-2xl select-none pointer-events-none" style={{ width: PLAYER_SIZE, left: PLAYER_X, top: playerY }} />
                    {obstacles.map((obs) => (
                        <div key={obs.id}>
                            <div className="absolute bg-gradient-to-b from-green-500 to-green-800 border-[5px] border-green-950 rounded-b-[18px] shadow-2xl" style={{ left: obs.x, top: 0, width: PIPE_WIDTH, height: obs.topHeight }} />
                            <div className="absolute bg-gradient-to-b from-green-500 to-green-800 border-[5px] border-green-950 rounded-t-[18px] shadow-2xl" style={{ left: obs.x, top: obs.topHeight + GAP, width: PIPE_WIDTH, height: GAME_HEIGHT - (obs.topHeight + GAP) }} />
                        </div>
                    ))}
                    <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-10 w-full text-center text-white font-bold text-xl drop-shadow-2xl">SPACE ou CLICK pour voler</motion.div>
                </div>
            )}

            {displayBurger && (
                <div className="w-[420px] h-[800px] rounded-[20px] overflow-hidden bg-[url(https://freedesignfile.com/upload/2018/02/Underwater-world-game-background-vector-01.jpg)] bg-cover bg-center">
                    <div className="w-full h-full flex items-center justify-center flex-col gap-8 bg-black/60 backdrop-blur-md">
                        <motion.h2 animate={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 3, repeat: Infinity }} className="text-4xl text-white font-bold italic">Pause</motion.h2>
                        <button onClick={() => { setDisplayBurger(false); setDisplaySettings(true) }} className="w-2/3 py-4 bg-white/30 rounded-xl hover:bg-white/20 transition flex items-center justify-center gap-3 text-white font-bold backdrop-blur-md"><IoSettings size={24} />Paramètres</button>
                        <button onClick={() => { setDisplayBurger(false); setDisplayGame(true) }} className="w-2/3 py-4 bg-white/30 rounded-xl hover:bg-white/20 transition flex items-center justify-center gap-3 text-white font-bold backdrop-blur-md"><FaGamepad size={24} />Retour au jeu</button>
                        <button onClick={() => { setDisplayBurger(false); setDisplayMenu(true) }} className="w-2/3 py-4 bg-white/30 rounded-xl hover:bg-white/20 transition flex items-center justify-center gap-3 text-white font-bold backdrop-blur-md"><TbLogout2 size={24} />Retour menu</button>
                    </div>
                </div>
            )}

            {displayGameOver && (
                <div className="w-[420px] h-[800px] rounded-[20px] overflow-hidden bg-[url(https://freedesignfile.com/upload/2018/02/Underwater-world-game-background-vector-01.jpg)] bg-cover bg-center">
                    <div className="w-full h-full bg-black/70 flex flex-col items-center justify-center gap-8 text-white backdrop-blur-md">
                        <motion.h2 animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-5xl font-black drop-shadow-2xl">GAME OVER</motion.h2>
                        <div className="text-center"><p className="text-3xl font-bold">Score : {score}</p><p className="text-xl text-white/70">Meilleur score : {bestScore}</p></div>
                        <button onClick={startGame} className="w-2/3 py-4 bg-orange-500 rounded-xl hover:bg-orange-400 transition text-white font-bold text-xl">Rejouer</button>
                        <button onClick={() => { setDisplayGameOver(false); setDisplayMenu(true) }} className="w-2/3 py-4 bg-white/20 rounded-xl hover:bg-white/10 transition text-white font-bold">Retour menu</button>
                    </div>
                </div>
            )}

            {displaySettings && (
                <div className="w-[420px] h-[800px] rounded-[20px] overflow-hidden bg-[url(https://freedesignfile.com/upload/2018/02/Underwater-world-game-background-vector-01.jpg)] bg-cover bg-center">
                    <div className="w-full h-full bg-black/60 flex flex-col items-center justify-center gap-8 text-white backdrop-blur-md">
                        <h2 className="text-4xl font-bold">Paramètres</h2>
                        <div className="w-2/3 flex flex-col gap-3"><div className="bg-white/20 rounded-xl p-4"><p className="font-bold text-center">Meilleur score : <span className="text-2xl">{bestScore}</span></p></div></div>
                        <button onClick={() => { setDisplaySettings(false); setDisplayMenu(true) }} className="w-2/3 py-4 bg-white/20 rounded-xl hover:bg-white/10 transition">Retour</button>
                    </div>
                </div>
            )}
        </div>
    )
}