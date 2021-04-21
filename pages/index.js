import { useState } from 'react';
import Head from 'next/head'
import { useMutation, useQuery, useQueryClient } from 'react-query';
import axios from 'axios';

import styles from '../styles/Home.module.css'

const defaultValues = {
  title: '',
  body: '',
  author: ''
};

export default function Home() {
  const [activePostId, setActivePostId] = useState();
  const qClient = useQueryClient();

  const [values, setValues] = useState(defaultValues);

  const { mutate, status, } = useMutation((values) => {
    return axios.post('/api/posts', values).then(res => res.data);
  }, {
    onSuccess: (data) => {
      qClient.refetchQueries('posts');
    }
  })

  function handleOnChange(key, value) {
    setValues((prev) => ({
      ...prev,
      [key]: value
    }));
  }

  function handleOnSubmit(e) {
    setValues(defaultValues);
    e.preventDefault();
    mutate(values);
  }

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
          <h3>Create New Post</h3>
          <form className={styles.form} onSubmit={handleOnSubmit}>
            <div className={styles.formRow}>
              <label className={styles.formLabel}>Title</label>
              <input
                name="title"
                placeholder="enter title"
                className={styles.formInput}
                value={values.title}
                onChange={(e) => handleOnChange('title', e.target.value)}
              />
            </div>
            <div className={styles.formRow}>
              <label className={styles.formLabel}>Body</label>
              <textarea
                name="body"
                placeholder="enter body"
                className={styles.formInput}
                value={values.body}
                onChange={(e) => handleOnChange('body', e.target.value)}
              ></textarea>
            </div>
            <div className={styles.formRow}>
              <label className={styles.formLabel}>Author</label>
              <input
                name="author"
                placeholder="enter author"
                className={styles.formInput}
                value={values.author}
                onChange={(e) => handleOnChange('author', e.target.value)}
              />
            </div>
            <button type="submit" className={styles.btn}>
              {status === 'loading' ? (
                <span>...</span>
              ) : status === 'error' ? (
                <span>Error occurred</span>
              ) : status === 'success' ? (
                'Post created'
              ) : (
                'Create Post'
              )}
            </button>
          </form>
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
