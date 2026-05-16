"use client"

import { Difficulty } from "@/lib/types";
import { motion } from "framer-motion"

type MenuProps = {
    main_character: string;
    difficulty: Difficulty;
    setDifficulty: (value: Difficulty) => void;
    startGame: () => void;
    bestScore: number;
};

const difficulties: Difficulty[] = [ "easy", "intermediate", "hard" ]

export default function Menu({ main_character, difficulty, setDifficulty, startGame, bestScore }: MenuProps) {
    return (
        <div className="flex items-center justify-center flex-col gap-10 h-full w-full">
            <motion.div animate={{ rotate: [0, -3, 3, -2, 2, 0], y: [0, -6, 0], scale: [1, 1.02, 1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", }} className="flex items-center gap-3"><motion.h2 animate={{ textShadow: ["0px 0px 0px rgba(255,255,255,0)", "0px 0px 20px rgba(255,255,255,0.4)", "0px 0px 0px rgba(255,255,255,0)"] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="text-4xl font-bold italic text-white drop-shadow-2xl">Komodo Game</motion.h2><motion.img animate={{ y: [0, -10, 0], rotate: [0, 2, -2, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }} className="w-24 drop-shadow-2xl" src={main_character} alt="Komodo" /></motion.div>
            <div className="flex flex-col items-center w-fit">
                <div className="flex items-center gap-2">
                    {difficulties.map((v, k) => (
                        <button key={k} onClick={() => setDifficulty(v)} className={`px-4 py-2 rounded-xl text-white font-bold ${v === difficulty ? "bg-white/60" : "bg-white/20"} backdrop-blur-md border border-white/30 shadow-lg hover:bg-white/30 hover:scale-105 active:scale-95 transition-all duration-500 cursor-pointer`}>{v}</button>
                    ))}
                </div>
                <button onClick={startGame} className="w-full py-4 my-3 bg-orange-500 rounded-xl hover:bg-orange-400 transition duration-500 cursor-pointer text-white font-bold text-xl">Jouer</button>
                <p className="font-bold text-center text-white/70">Meilleur score : <span className="text-2xl">{bestScore || 0}</span></p>
            </div>
        </div>
    )
}