import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>React Query CRUD</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.grid}>
        <header className={styles.header}>
          <h2>React Query CRUD</h2>
        </header>
        <div className={styles.sidebar}>
          <span>Sidebar</span>
        </div>
        <main className={styles.main}>
          <span>Main</span>
        </main>
        <footer className={styles.footer}>
          <span>Made with 💜</span>
        </footer>
      </div>
    </div>
  )
}
