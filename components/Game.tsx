"use client"

import { Obstacle } from "@/lib/types";
import { motion } from "framer-motion"
import { FaHamburger } from "react-icons/fa"

import { RefObject } from "react";

type GameProps = {
    SCREEN_WIDTH: number;
    SCREEN_HEIGHT: number;
    PLAYER_SIZE: number;
    PLAYER_X: number;
    PLAYER_Y: number;
    PIPE_WIDTH: number;
    GAP: number;

    obstacles: Obstacle[];

    velocityRef: RefObject<number>;
    gameLoop: RefObject<NodeJS.Timeout | null>;

    score: number;

    jump: () => void;
    endGame: () => void;

    setDisplayGame: (value: boolean) => void;
    setDisplayPauseMenu: (value: boolean) => void;
};

export default function Game({ SCREEN_WIDTH, SCREEN_HEIGHT, PLAYER_SIZE, PLAYER_X, PLAYER_Y, PIPE_WIDTH, GAP, obstacles, velocityRef, gameLoop, score, jump, endGame, setDisplayGame, setDisplayPauseMenu }: GameProps) {

    const pauseGame = () => {
        gameLoop.current && clearInterval(gameLoop.current)
        setDisplayGame(false)
        setDisplayPauseMenu(true)
    }

    return (
        <div onClick={jump}>
            <motion.div animate={{ x: [0, -40, 0] }} transition={{ duration: 8, repeat: Infinity }} className="absolute inset-0 bg-black/10" />
            <motion.div key={score} initial={{ scale: 1.6 }} animate={{ scale: 1 }} className="absolute top-4 left-4 z-50 text-white text-4xl font-black drop-shadow-2xl">{score}</motion.div>
            <div className="absolute top-4 right-4 z-50"><FaHamburger size={26} className="text-white cursor-pointer hover:text-orange-400 transition" onClick={() => { gameLoop.current && clearInterval(gameLoop.current); setDisplayGame(false); setDisplayPauseMenu(true) }} /></div>
            <motion.img animate={{ rotate: velocityRef.current * 3, y: [0, -3, 0] }} transition={{ duration: 0.15 }} src="komodo.png" alt="Komodo" className="absolute z-40 drop-shadow-2xl select-none pointer-events-none" style={{ width: PLAYER_SIZE, left: PLAYER_X, top: PLAYER_Y }} />
            {obstacles.map((obs) => (
                <div key={obs.id}>
                    <div className="absolute bg-linear-to-b from-green-500 to-green-800 border-[5px] border-green-950 rounded-b-[18px] shadow-2xl" style={{ left: obs.x, top: 0, width: PIPE_WIDTH, height: obs.topHeight }} />
                    <div className="absolute bg-linear-to-b from-green-500 to-green-800 border-[5px] border-green-950 rounded-t-[18px] shadow-2xl" style={{ left: obs.x, top: obs.topHeight + GAP, width: PIPE_WIDTH, height: SCREEN_HEIGHT - (obs.topHeight + GAP) }} />
                </div>
            ))}
            <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-10 w-full text-center text-white font-bold text-xl drop-shadow-2xl">SPACE ou CLICK pour voler</motion.div>
        </div>
    )
}

