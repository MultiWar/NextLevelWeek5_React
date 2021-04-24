import { createContext, ReactNode, useContext, useState } from 'react'

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
}

type PlayerContextData = {
    episodeList: Array<Episode>
    currentEpisodeIndex: number
    play: (episode: Episode) => void
    togglePlay: () => void
    playNext: () => void
    playPrevious: () => void
    setPlayingState: (b: boolean) => void
    isPlaying: boolean
    playList: (e: Episode[], i: number) => void
    hasNext: boolean
    hasPrevious: boolean
    toggleLoop: () => void
    isLooping: boolean
    toggleShuffle: () => void
    isShuffling: boolean
    clearPlayerState: () => void
}


export const PlayerContext = createContext({} as PlayerContextData)

export const PlayerContextProvider = ({ children }: { children: ReactNode }) => {
    const [episodeList, setEpisodeList] = useState([])
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isLooping, setIsLooping] = useState(false)
    const [isShuffling, setIsShuffling] = useState(false)

    function play(episode: Episode) {
        setEpisodeList([episode])
        setCurrentEpisodeIndex(0)
        setIsPlaying(true)
    }

    function playList(episodes: Episode[], currentEpisodeIndex: number) {
        setEpisodeList(episodes)
        setCurrentEpisodeIndex(currentEpisodeIndex)
        setIsPlaying(true)
    }

    function togglePlay() {
        setIsPlaying(prev => !prev)
    }

    function setPlayingState(state: boolean) {
        setIsPlaying(state)
    }

    function toggleLoop() {
        setIsLooping(current => !current)
    }

    function toggleShuffle() {
        setIsShuffling(current => !current)
    }

    const hasNext = isShuffling || currentEpisodeIndex + 1 < episodeList.length
    const hasPrevious = currentEpisodeIndex > 0

    function getRandomIndex() {
        const random = Math.floor(Math.random() * 1000) % episodeList.length
        if(random === currentEpisodeIndex) {
            return getRandomIndex()
        }
        return random
    }

    function playNext() {
        if(isShuffling) {
            const nextRandomIndex = getRandomIndex()
            setCurrentEpisodeIndex(nextRandomIndex)
            return
        }

        if (hasNext) {
            setCurrentEpisodeIndex(current => current + 1)
            return
        }
    }

    function playPrevious() {
        if (hasPrevious) {
            setCurrentEpisodeIndex(current => current - 1)
        }
    }

    function clearPlayerState() {
        setEpisodeList([])   
        setCurrentEpisodeIndex(0)
        setIsPlaying(false) 
    }

    return (
        <PlayerContext.Provider value={{ 
            episodeList, 
            currentEpisodeIndex, 
            play, 
            togglePlay, 
            setPlayingState, 
            isPlaying, 
            playList, 
            playNext, 
            playPrevious, 
            hasNext, 
            hasPrevious,
            toggleLoop,
            isLooping,
            toggleShuffle,
            isShuffling,
            clearPlayerState
        }}>
            {children}
        </PlayerContext.Provider>
    )

}

export const usePlayer = () => {
    return useContext(PlayerContext)
}