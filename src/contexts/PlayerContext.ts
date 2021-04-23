import { createContext } from 'react'

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
    setPlayingState: (b: boolean) => void
    isPlaying: boolean
}


export const PlayerContext = createContext({} as PlayerContextData)