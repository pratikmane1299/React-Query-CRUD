import Head from 'next/head'
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import axios from 'axios';

import styles from '../styles/Home.module.css'

const queryClient = new QueryClient();

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
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
            <Posts />
          </main>
          <footer className={styles.footer}>
            <span>Made with 💜</span>
          </footer>
        </div>
      </div>
    </QueryClientProvider>
  );
}

function fetchPosts(key) {
  return axios.get('/api/posts').then(res => res.data);
}

function Posts() {

  const { status, data, error, isFetching } = useQuery('posts', fetchPosts);

  return (
    <>
      {status === "loading" ? (
        <span>Loading posts ...</span>
      ) : status === "error" ? (
        <span>{error.message}</span>
      ) : (
        <>
          <h3>
            Posts{' '}
            {isFetching ? <small>Updating...</small> : null}
          </h3>
          <div className={styles.postsList}>
            {data.map((post) => (
              <div className={styles.card} key={post.id}>
                <a href="#">{post.title}</a>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
