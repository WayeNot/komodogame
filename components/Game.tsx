"use client"

import { Difficulty, Obstacle } from "@/lib/types";
import { motion } from "framer-motion"

import { RefObject } from "react";
import { IoSettingsSharp } from "react-icons/io5";

type BestScore = { easy: number; intermediate: number; hard: number; }

type GameProps = {
    SCREEN_WIDTH: number;
    SCREEN_HEIGHT: number;
    PLAYER_SIZE: number;
    PLAYER_X: number;
    PLAYER_Y: number;
    PIPE_WIDTH: number;
    GAP: number;

    main_character: string;

    obstacles: Obstacle[];

    velocityRef: RefObject<number>;
    gameLoop: RefObject<NodeJS.Timeout | null>;

    difficulty: Difficulty;
    score: number;
    bestScore: number;

    jump: () => void;
    endGame: () => void;

    setDisplayGame: (value: boolean) => void;
    setDisplayPauseMenu: (value: boolean) => void;
};

export default function Game({ SCREEN_HEIGHT, PLAYER_SIZE, PLAYER_X, PLAYER_Y, PIPE_WIDTH, GAP, obstacles, velocityRef, main_character, gameLoop, difficulty, score, bestScore, jump, endGame, setDisplayGame, setDisplayPauseMenu }: GameProps) {

    const pauseGame = () => {
        gameLoop.current && clearInterval(gameLoop.current)
        setDisplayGame(false)
        setDisplayPauseMenu(true)
    }

    return (
        <div onClick={jump} className="relative w-screen h-screen overflow-hidden">
            <motion.div animate={{ x: [0, -40, 0] }} transition={{ duration: 8, repeat: Infinity }} className="absolute inset-0 z-0 pointer-events-none bg-black/10" />
            <div className="absolute top-0 left-0 z-100 flex items-center justify-between p-3 text-white font-black drop-shadow-2xl w-full">
                <div className="flex flex-col items-center gap-3">
                    <motion.div key={score + 1000} initial={{ scale: 1.6 }} animate={{ scale: 1 }} className="text-4xl">{score}</motion.div>
                    <motion.div key={bestScore} initial={{ scale: 1.6 }} animate={{ scale: 1 }} className=" text-[14px]">Best : {bestScore}</motion.div>
                    <IoSettingsSharp size={26} className="text-white hover:text-orange-400 transition duration-500 cursor-pointer" onClick={e => { e.stopPropagation(); pauseGame() }} />
                </div>
            </div>
            <motion.img animate={{ rotate: velocityRef.current * 3, y: [0, -3, 0] }} transition={{ duration: 0.15 }} src={main_character} alt="Komodo" className="absolute z-40 drop-shadow-2xl select-none pointer-events-none" style={{ width: PLAYER_SIZE, left: PLAYER_X, top: PLAYER_Y }} />
            {obstacles.map((obs) => (
                <div key={obs.id}>
                    <motion.div animate={{ scaleX: [1, 1.02, 1] }} className="absolute z-10 bg-linear-to-b from-blue-500 to-blue-800 border-[5px] border-green-950 rounded-b-[18px] shadow-2xl transition duration-500 cursor-pointer" style={{ left: obs.x, top: -5, width: PIPE_WIDTH, height: obs.topHeight }} />
                    <motion.div animate={{ scaleX: [1, 1.02, 1] }} className="absolute z-10 bg-linear-to-b from-blue-500 to-blue-800 border-[5px] border-green-950 rounded-t-[18px] shadow-2xl transition duration-500 cursor-pointer" style={{ left: obs.x, top: obs.topHeight + GAP + 5, width: PIPE_WIDTH, height: SCREEN_HEIGHT - (obs.topHeight + GAP) }} />
                </div>
            ))}
            <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-10 w-full text-center text-white font-bold text-xl drop-shadow-2xl">SPACE ou CLICK pour voler</motion.div>
        </div>
    )
}