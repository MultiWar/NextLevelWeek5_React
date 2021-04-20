import { AppProps } from "next/dist/next-server/lib/router/router"
import { Header } from "../components/Header"
import { Player } from "../components/Player"
import '../styles/global.scss'
import styles from '../styles/app.module.scss'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className={styles.appWrapper}>
      <main>
        <Header />
        <Component {...pageProps} />
      </main>
      <Player />
    </div>
  )
}

export default MyApp