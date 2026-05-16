"use client"

import { motion } from "framer-motion"

type PauseMenuProps = {
    setDisplayPauseMenu: (value: boolean) => void;
    setDisplayGame: (value: boolean) => void;
    setDisplayMenu: (value: boolean) => void;
};

export default function PauseMenu({ setDisplayPauseMenu, setDisplayGame, setDisplayMenu }: PauseMenuProps) {
    return (
        <div className="w-full h-full flex items-center justify-center flex-col gap-8 bg-black/60 backdrop-blur-md">
            <motion.h2 animate={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 3, repeat: Infinity }} className="text-4xl text-white font-bold italic">Pause</motion.h2>
            <div className="flex flex-col items-center gap-2 w-full">
                <button onClick={() => { setDisplayPauseMenu(false); setDisplayGame(true) }} className="w-2/3 py-4 bg-blue-500 rounded-xl hover:bg-blue-400 transition duration-500 cursor-pointer text-white font-bold text-xl">Retour au jeu</button>
                <button onClick={() => { setDisplayPauseMenu(false); setDisplayMenu(true) }} className="w-2/3 py-4 bg-white/20 rounded-xl hover:bg-white/10 transition duration-500 cursor-pointer text-white font-bold">Retour menu</button>
            </div>
        </div>
    )
}