import { AppProps } from "next/dist/next-server/lib/router/router"
import { Header } from "../components/Header"
import { Player } from "../components/Player"
import '../styles/global.scss'
import styles from '../styles/app.module.scss'
import { PlayerContextProvider } from "../contexts/PlayerContext"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PlayerContextProvider>
      <div className={styles.appWrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player /> 
      </div>
    </PlayerContextProvider>
  )
}

export default MyApp
