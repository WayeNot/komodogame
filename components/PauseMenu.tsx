"use client"

import { motion } from "framer-motion"
import { FaGamepad } from "react-icons/fa"
import { IoSettings } from "react-icons/io5"
import { TbLogout2 } from "react-icons/tb"

type PauseMenuProps = {
    setDisplayPauseMenu: (value: boolean) => void;
    setDisplayGame: (value: boolean) => void;
    setDisplayMenu: (value: boolean) => void;
};

export default function PauseMenu({ setDisplayPauseMenu, setDisplayGame, setDisplayMenu }: PauseMenuProps) {
    return (
        <div className="w-full h-full flex items-center justify-center flex-col gap-8 bg-black/60 backdrop-blur-md">
            <motion.h2 animate={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 3, repeat: Infinity }} className="text-4xl text-white font-bold italic">Pause</motion.h2>
            <button onClick={() => { setDisplayPauseMenu(false); setDisplayGame(true) }} className="w-2/3 py-4 bg-white/30 rounded-xl hover:bg-white/20 transition flex items-center justify-center gap-3 text-white font-bold backdrop-blur-md"><FaGamepad size={24} />Retour au jeu</button>
            <button onClick={() => { setDisplayPauseMenu(false); setDisplayMenu(true) }} className="w-2/3 py-4 bg-white/30 rounded-xl hover:bg-white/20 transition flex items-center justify-center gap-3 text-white font-bold backdrop-blur-md"><TbLogout2 size={24} />Retour menu</button>
        </div>
    )
}