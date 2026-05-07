"use client"
import { motion } from "motion/react"
import { style } from "motion/react-client";
import { useState } from "react";
import { FaGamepad, FaHamburger } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import { TbLogout2 } from "react-icons/tb";

export default function Home() {
    const [displayMenu, setDisplayMenu] = useState(true)
    const [displayGame, setDisplayGame] = useState(false)
    const [displayBurger, setDisplayBurger] = useState(false)
    const [displaySettings, setDisplaySettings] = useState(false)
    const [displayGameOver, setDisplayGameOver] = useState(false)

    const [dataGame, setDataGame] = useState({ score: 0 })

    const [playerPos, setPlayerPos] = useState()

    document.body.onkeyup = function (e) {
        if (e.code === "space" || e.key === " " || e.code === "onclick") {
            let player = document.getElementById("playerPos")
            player.style.bottom = player.getBoundingClientRect().top + 10 + "px"
        }
    }

    const startGame = () => {
        setDisplayMenu(false);
        setDisplayBurger(false);
        setDisplaySettings(false);
        setDisplayGame(true);
    }

    return (
        <div className="h-screen flex items-center justify-center">
            {displayMenu && (
                <div className="w-1/4 h-[90%] rounded-[8px] m-auto flex items-center justify-center flex-col gap-10 bg-[url(https://freedesignfile.com/upload/2018/02/Underwater-world-game-background-vector-01.jpg)] bg-center bg-cover">
                    <motion.div animate={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 3, repeat: Infinity }} className="w-fit h-fit flex items-center justify-center font-bold italic gap-2">
                        <h2 className="text-[25px] font-bold italic text-white/70">Komodo Game</h2>
                        <img className="w-15" src="komodo.png" alt="Image du komodo" />
                    </motion.div>
                    <div className="flex flex-col items-center justify-center gap-3 w-full">
                        <button onClick={startGame} className="w-2/5 py-3 bg-white/40 rounded-[8px] hover:bg-white/20 cursor-pointer transition duration-500 flex items-center gap-2 justify-center"><FaGamepad size={25} />Jouer</button>
                        <button onClick={() => { setDisplayBurger(false); setDisplaySettings(true); }} className="w-2/5 py-3 bg-white/40 rounded-[8px] hover:bg-white/20 cursor-pointer transition duration-500 flex items-center gap-2 justify-center"><IoSettings size={25} />Paramètres</button>
                    </div>
                </div>
            )}
            {displayGame && (
                <div className="w-1/4 relative h-[90%] rounded-[8px] m-auto flex items-center justify-center flex-col gap-10 bg-[url(https://freedesignfile.com/upload/2018/02/Underwater-world-game-background-vector-01.jpg)] bg-center bg-cover">
                    <div className="w-full flex flex-col absolute top-0 p-3 gap-10">
                        <div className="flex items-center justify-between w-full">
                            <h2 className="text-[25px] font-bold italic text-white/70">KomodoGame</h2>
                            <FaHamburger onClick={() => { setDisplayBurger(true); setDisplayGame(false); }} size={25} className="hover:text-orange-500/60 cursor-pointer transition duration-500" />
                        </div>
                        <motion.h2 animate={{ rotate: [0, -3, 3, 0] }} transition={{ duration: 8, repeat: Infinity }} className="text-[25px] w-full p-2 flex items-center justify-center bg-black/40 rounded-[9px]">Appuyez sur [ SPACE ] pour avancer !</motion.h2>
                    </div>
                    <img id="playerPos" className="w-25 absolute" src="komodo.png" alt="Image du komodo" />
                </div>
            )}
            {displayBurger && (
                <div className="w-1/4 relative h-[90%] rounded-[8px] m-auto bg-[url(https://freedesignfile.com/upload/2018/02/Underwater-world-game-background-vector-01.jpg)] bg-center bg-cover">
                    <div className="w-full h-full flex items-center justify-center flex-col gap-10 bg-black/50">
                        <motion.h2 animate={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 3, repeat: Infinity }} className="text-[25px] font-bold italic text-white/70">KomodoGame</motion.h2>
                        <div className="w-full flex items-center justify-center flex-col gap-2">
                            <button onClick={() => { setDisplayBurger(false); setDisplaySettings(true); }} className="w-2/5 py-3 bg-white/40 rounded-[8px] hover:bg-white/20 cursor-pointer transition duration-500 flex items-center gap-2 justify-center"><IoSettings size={25} />Paramètres</button>
                            <button onClick={() => { setDisplayBurger(false); setDisplayGame(true); }} className="w-2/5 py-3 bg-white/40 rounded-[8px] hover:bg-white/20 cursor-pointer transition duration-500 flex items-center gap-2 justify-center"><FaGamepad size={25} />Revenir au jeu</button>
                            <button onClick={() => { setDisplayBurger(false); setDisplayMenu(true); }} className="w-2/5 py-3 bg-white/40 rounded-[8px] hover:bg-white/20 cursor-pointer transition duration-500 flex items-center gap-2 justify-center"><TbLogout2 size={25} />Revenir au menu</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}