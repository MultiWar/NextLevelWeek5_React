import { parseISO, format } from "date-fns"
import ptBR from "date-fns/locale/pt-BR"
import { GetStaticPaths, GetStaticProps } from "next"
import Image from "next/image"
import Link from "next/link"
import { api } from "../../services/api"
import { convertDurationToTimeString } from "../../utils/convertDurationToTImeString"
import styles from './episode.module.scss'

interface EpisodeProps {
    episode: Episode
}

interface Episode {
    id: string,
    title: string,
    members: string,
    publishedAt: string,
    duration: string,
    description: string,
    thumbnail: string,
    url: string
}

const Episode = ({ episode }: EpisodeProps) => {
    return (
        <div className={styles.container}>
            <div className={styles.episode}>
                <div className={styles.thumbnailContainer}>
                    <Link href='/'>
                        <button type='button'>
                            <img src='/arrow-left.svg' alt='Voltar'/>
                        </button>
                    </Link>
                    <Image
                        width={700}
                        height={160}
                        objectFit='cover'
                        src={episode.thumbnail}
                    />
                    <button type='button'>
                        <img src='/play.svg' alt='Tocar episódio'/>
                    </button>
                </div>

                <header>
                    <h1>{episode.title}</h1>
                    <span>{episode.members}</span>
                    <span>{episode.publishedAt}</span>
                    <span>{episode.duration}</span>
                </header>

                <div className={styles.description} dangerouslySetInnerHTML={{__html: episode.description}} />
            </div>
        </div>
    )
}

export default Episode

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
    const { episodeTitle } = ctx.params
    const { data } = await api.get(`/episodes/${episodeTitle}`)

    const episode = {
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', {locale: ptBR}),
        duration: convertDurationToTimeString(Number(data.file.duration)),
        description: data.description,
        url: data.file.url
    }

    return {
        props: {
            episode: episode
        },
        revalidate: 60 * 60 * 8 // 8 horas
    }
}