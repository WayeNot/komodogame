import { useRef, useState } from "react"

type Music = {
    author: string
    label: string
    audio: string
    cover: string
}

export function useMusic(musics: Music[], muted: boolean) {
    const audioRef = useRef<HTMLAudioElement | null>(null)

    const [current, setCurrent] = useState<Music | null>(null)
    const [paused, setPaused] = useState(false)

    const playRandom = () => {
        if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.currentTime = 0
        }

        const music = musics[Math.floor(Math.random() * musics.length)]

        const audio = new Audio(`/audio/music/${music.audio}`)
        audio.volume = muted ? 0 : 0.02
        audio.play()

        audio.onended = () => playRandom()

        audioRef.current = audio
        setCurrent(music)
    }

    const togglePause = () => {
        if (!audioRef.current) return

        if (paused) {
            audioRef.current.play()
        } else {
            audioRef.current.pause()
        }

        setPaused(!paused)
    }

    const setMuted = (muted: boolean) => {
        if (audioRef.current) {
            audioRef.current.volume = muted ? 0 : 0.02
        }
    }

    const skip = () => playRandom()

    return {
        current,
        playRandom,
        skip,
        setMuted,
        togglePause,
        paused,
        audioRef,
    }
}