export default function Home(props) {
  return (
    <div>
      {props.episodes.map(episode => (
        <div>
          <h1>{episode.title}</h1>
          <p>{episode.members}</p>
        </div>
      ))}
    </div>
  )
}

export async function getStaticProps() {
  const response = await fetch('http://localhost:3333/episodes')
  const data = await response.json()

  return {
    props: {
      episodes: data
    },
    revalidate: 60 * 60 * 8 // 8 horas
  }
}
