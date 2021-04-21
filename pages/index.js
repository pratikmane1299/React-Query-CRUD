import { useState } from 'react';
import Head from 'next/head'
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import axios from 'axios';

import styles from '../styles/Home.module.css'

const queryClient = new QueryClient();

export default function Home() {
  const [activePostId, setActivePostId] = useState();
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
            {activePostId ? (
              <Post postId={activePostId} setActivePostId={setActivePostId} /> 
            ) : (
              <Posts setActivePostId={setActivePostId} />
            )}
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

function Posts({ setActivePostId }) {

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
              <div className={styles.card} key={post.id} onClick={() => {
                setActivePostId(post.id)
              }}>
                <a href="#">{post.title}</a>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}

function fetchPost({ queryKey }) {
  return axios.get(`/api/posts/${queryKey[1]}`).then(res => res.data);
}

function Post({ postId, setActivePostId }) {
  const { data: post, status: postStatus, error, isFetching } = useQuery(['post', postId], fetchPost);

  return (
    <>
      {postStatus === "loading" ? (
        <span>Loading post ...</span>
      ) : postStatus === "error" ? (
        <span>Error occurred ... {error.message}</span>
      ) : (
        <>
          <a className={styles.link} href="#" onClick={() => setActivePostId()}>&#8592; Back</a>
          <div>
            <h6 className={styles.title}>
              {post.title} {isFetching ? <small>Updating...</small> : null}
            </h6>
            <span className={styles.author}>Author - {post.author}</span>
            <p className={styles.body}>{post.body}</p>
          </div>
        </>
      )}
    </>
  );
}
