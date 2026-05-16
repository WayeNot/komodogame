"use client"

import { motion } from "framer-motion"

type GameOverProps = {
    startGame: () => void;
    setDisplayGameOver: (value: boolean) => void;
    setDisplayMenu: (value: boolean) => void;
    score: number;
    bestScore: number;
};

export default function GameOver({ startGame, setDisplayGameOver, setDisplayMenu, score, bestScore }: GameOverProps) {
    return (
        <div className="w-full h-full bg-black/70 flex flex-col items-center justify-center gap-8 text-white backdrop-blur-xs">
            <motion.h2 animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-5xl font-black drop-shadow-2xl">GAME OVER</motion.h2>
            <div className="text-center"><p className="text-3xl font-bold">Score : {score}</p><p className="text-xl text-white/70">Meilleur score : {bestScore}</p></div>
            <div className="flex flex-col items-center gap-2 w-full">
                <button onClick={startGame} className="w-2/3 py-4 bg-orange-500 rounded-xl hover:bg-orange-400 transition duration-500 cursor-pointer text-white font-bold text-xl">Rejouer</button>
                <button onClick={() => { setDisplayGameOver(false); setDisplayMenu(true) }} className="w-2/3 py-4 bg-white/20 rounded-xl hover:bg-white/10 transition duration-500 cursor-pointer text-white font-bold">Retour menu</button>
            </div>
        </div>
    )
}