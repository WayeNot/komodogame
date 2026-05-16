"use client"

import { motion } from "framer-motion"
import { VscMute, VscUnmute } from "react-icons/vsc"
import { MdSkipNext } from "react-icons/md"
import { LuMicVocal } from "react-icons/lu"
import { GiLoveSong } from "react-icons/gi"

type Props = {
    music: { author: string; label: string; cover: string } | null
    muted: boolean
    toggleMute: () => void
    skip: () => void
}

export default function MusicBar({ music, muted, toggleMute, skip }: Props) {
    return (
        <div className="absolute bottom-4 left-1/2 z-15 -translate-x-1/2 w-[90%] max-w-130 flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-black/20 backdrop-blur-xl border border-white/10">
            <div className="flex-1 text-white text-xs truncate">
                {music ? (
                    <div className="flex items-center gap-2">
                        <motion.img src={`/audio/music/covers/${music.cover}`} className="w-6 h-6 rounded-md" animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2.5, repeat: Infinity }}/>
                        <span className="flex items-center gap-1"><LuMicVocal />{music.author}</span>
                        <span>|</span>
                        <span className="flex items-center gap-1"><GiLoveSong />{music.label}</span>
                    </div>
                ) : "Aucune musique"}
            </div>

            <div className="flex gap-2">
                <button onClick={toggleMute} className="p-2 rounded-lg bg-white/10 hover:bg-white/20">{muted ? <VscMute /> : <VscUnmute />}</button>
                <button onClick={skip} className="p-2 rounded-lg bg-white/10 hover:bg-white/20"><MdSkipNext /></button>
            </div>
        </div>
    )
}