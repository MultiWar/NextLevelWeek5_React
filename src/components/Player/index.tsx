import Image from 'next/image'
import { useContext, useEffect, useRef, useState } from 'react'
import { PlayerContext } from '../../contexts/PlayerContext'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import styles from './styles.module.scss'
import { convertDurationToTimeString } from '../../utils/convertDurationToTImeString'

export const Player = () => {
    const {
        episodeList,
        currentEpisodeIndex,
        isPlaying, 
        togglePlay, 
        setPlayingState, 
        playNext, 
        playPrevious, 
        hasNext, 
        hasPrevious,
        toggleLoop,
        isLooping,
        toggleShuffle,
        isShuffling,
        clearPlayerState
    } = useContext(PlayerContext)

    const [progress, setProgress] = useState(0)

    const episode = episodeList[currentEpisodeIndex]
    const audioRef = useRef<HTMLAudioElement>(null)

    useEffect(() => {
        if (!audioRef.current) {
            return
        }
        if (isPlaying) {
            audioRef.current.play()
            return
        }
        audioRef.current.pause()
    }, [isPlaying])

    function setupPlayerProgressListener() {
        audioRef.current.currentTime = 0;

        audioRef.current.addEventListener("timeupdate", () => {
            setProgress(Math.floor(audioRef.current.currentTime))
        })
    }

    function handleChangeTimeFromSlider(newTime: number) {
        setProgress(newTime)
        audioRef.current.currentTime = newTime
    }

    function handleEpisodeEnded() {
        if(hasNext) {
            playNext()
            return
        }
        clearPlayerState()
        return
    }

    return (
        <div className={styles.playerContainer}>
            <header>
                <img src='/playing.svg' />
                <strong>Tocando agora</strong>
            </header>

            {episode ? (
                <div className={styles.currentEpisode}>
                    <Image
                        width={592}
                        height={592}
                        src={episode.thumbnail}
                        objectFit='cover'
                    />
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>) :

                (<div className={styles.emptyPlayer}>
                    <strong>Selecione um podcast para ouvir</strong>
                </div>)}

            <footer className={episode ? '' : styles.empty}>
                <div className={styles.progress}>
                    <span>{convertDurationToTimeString(progress)}</span>
                    <div className={styles.slider}>
                        {episode ?
                            <Slider
                                max={episode.duration}
                                value={progress}
                                onChange={handleChangeTimeFromSlider}
                                trackStyle={{ backgroundColor: '#84d761' }}
                                railStyle={{ backgroundColor: '#9f75ff' }}
                                handleStyle={{ borderColor: '#84d761', borderWidth: 4 }}
                            /> :
                            <div className={styles.emptySlider} />}
                    </div>
                    <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
                </div>

                {episode && (
                    <audio
                        ref={audioRef}
                        src={episode.url}
                        loop={isLooping}
                        autoPlay
                        onEnded={handleEpisodeEnded}
                        onLoadedMetadata={setupPlayerProgressListener}
                        onPlay={() => setPlayingState(true)}
                        onPause={() => setPlayingState(false)}
                    />
                )}

                <div className={styles.buttons}>
                    <button type='button' disabled={!episode || episodeList.length === 1} onClick={toggleShuffle} className={isShuffling ? styles.isActive : ""}>
                        <img src='/shuffle.svg' alt="Embaralhar" />
                    </button>

                    <button type='button' disabled={!episode || !hasPrevious} onClick={playPrevious}>
                        <img src='/play-previous.svg' alt="Tocar anterior" />
                    </button>

                    <button type='button' className={styles.playButton} disabled={!episode} onClick={togglePlay}>
                        {isPlaying ? (
                            <img src='/pause.svg' alt="Pausar" />
                        ) : (
                            <img src='/play.svg' alt="Tocar" />
                        )}
                    </button>

                    <button type='button' disabled={!episode || !hasNext} onClick={playNext}>
                        <img src='/play-next.svg' alt="Tocar próxima" />
                    </button>

                    <button type='button' disabled={!episode} onClick={toggleLoop} className={isLooping ? styles.isActive : ''}>
                        <img src='/repeat.svg' alt="Repetir" />
                    </button>
                </div>
            </footer>
        </div>
    )
}