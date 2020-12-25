import Head from 'next/head'
import styles from '../styles/Home.module.scss'

const Home = () => {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
          Hello World
      </main>
    </>
  )
}

export default Home;
