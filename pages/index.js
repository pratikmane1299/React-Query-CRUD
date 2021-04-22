import { useEffect, useState } from 'react';
import Head from 'next/head'
import { useMutation, useQuery, useQueryClient } from 'react-query';
import axios from 'axios';

import PostForm from '../components/PostForm';

import styles from '../styles/Home.module.css'

const defaultValues = {
  title: '',
  body: '',
  author: ''
};

export default function Home() {
  const [activePostId, setActivePostId] = useState();
  const qClient = useQueryClient();

  const { data: post, status: postStatus, error, isFetching } = useQuery(
    activePostId && ["post", activePostId],
    fetchPost
  );

  const [values, setValues] = useState(defaultValues || post);

  const { mutate: createPost, status: createPostStatus } = useMutation((values) => {
    return axios.post('/api/posts', values).then(res => res.data);
  }, {
    onMutate: async (post) => {
      console.log(Math.floor(Math.random() * (10 - 1)) + 1);
      await qClient.cancelQueries('posts');

      const previousValue = qClient.getQueryData('posts');

      await qClient.setQueryData('posts', (old) => {
        return [...old, { id: Math.floor(Math.random()),...post }];
      });

      return previousValue;
    },
    onError: (error, variables, previousValue) => {
      qClient.setQueryData('posts', previousValue);
    },
    onSuccess: (data) => {
      qClient.refetchQueries('posts');
    }
  })

  useEffect(() => {
    if (post) setValues(post);
    else setValues(defaultValues);
  }, [post, isFetching]);

  const {mutate: updatePost, status: updatePostStatus } = useMutation(({ values, activePostId }) => {
    return axios.put(`/api/posts/${activePostId}`, values).then(res => res.data);
  }, {
    onMutate: ({values, activePostId}) => {
      const previousPost = qClient.getQueryData(['post', activePostId]);

      qClient.setQueryData(['post', activePostId], (old) => ({
        ...old,
        ...values
      }));

      return previousPost;
    },
    onError: (err, { activePostId }, previousValue) => {
      qClient.setQueryData(['post', activePostId], previousValue);
    },
    onSuccess: async (data) => {
      await qClient.refetchQueries(['post', data.id]);
      qClient.refetchQueries('posts');
    }
  });

  function handleOnChange(key, value) {
    setValues((prev) => ({
      ...prev,
      [key]: value
    }));
  }

  function handleOnSubmit(e) {
    e.preventDefault();
    setValues(defaultValues);
    if (activePostId) {
      updatePost({ values, activePostId })
    } else {
      createPost(values);
    }
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
          {activePostId ? (
            postStatus === "loading" ? (
              <span>Loading...</span>
            ) : postStatus === "error" ? (
              <span>Error occurred</span>
            ) : postStatus === "success" ? (
              <>
                <h2>Edit Post{' '}{isFetching && 'Updating...'}</h2>
                <PostForm
                  values={values}
                  handleOnChange={handleOnChange}
                  onFormSubmit={handleOnSubmit}
                  submitText={
                    updatePostStatus === "loading"
                      ? "..."
                      : updatePostStatus === "error"
                      ? "Error"
                      : updatePostStatus === "success"
                      ? "Post updated !!!"
                      : "Update Post"
                  }
                />
              </>
            ) : null
          ) : (
            <>
              <h2>Create Post</h2>
              <PostForm
                values={values}
                handleOnChange={handleOnChange}
                onFormSubmit={handleOnSubmit}
                submitText={
                  createPostStatus === "loading"
                    ? "..."
                    : createPostStatus === "error"
                    ? "Error"
                    : createPostStatus === "success"
                    ? "Post created !!!"
                    : "Create Post"
                }
              />
            </>
          )}
        </div>
        <main className={styles.main}>
          {activePostId ? (
            postStatus === "loading" ? (
              <span>Loading...</span>
            ) : postStatus === "error" ? (
              <span>Error occurred</span>
            ) : (
              postStatus === "success" && (
                <Post
                  postId={activePostId}
                  post={post}
                  status={postStatus}
                  isFetching={isFetching}
                  setActivePostId={setActivePostId}
                />
              )
            )
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
  const qClient = useQueryClient();

  const { status, data, error, isFetching } = useQuery('posts', fetchPosts);

  const { mutate: deletePost, status: deletePostStatus } = useMutation((id) => {
    return axios.delete(`/api/posts/${id}`).then(res => res.data);
  }, {
    onMutate: (id) => {
      const previousPosts = qClient.getQueryData('posts');

      qClient.setQueryData('posts', (old) => (old.filter(post => post.id !== id)));

      return previousPosts;
    },
    onError: (err, variables, previousValue) => {
      qClient.setQueryData('posts', previousValue);
    },
    onSuccess: () => {
      qClient.refetchQueries('posts');
    },
  });

  function handleOnDelete(id) {
    deletePost(id); 
  }

  return (
    <>
      {status === "loading" ? (
        <span>Loading posts ...</span>
      ) : status === "error" ? (
        <span>{error.message}</span>
      ) : (
        <>
          <h3>Posts {isFetching ? <small>Updating...</small> : null}</h3>
          <div className={styles.postsList}>
            {data.map((post) => (
              <div
                className={styles.card}
                key={post.id}
              >
                <a href="#"
                  onClick={() => {
                    setActivePostId(post.id);
                  }}
                >
                  {post.title}
                </a>
                <button className={styles.deleteBtn} onClick={(e) => {
                  e.preventDefault();
                  handleOnDelete(post.id);
                }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
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

function Post({ postId, post, postStatus, isFetching, setActivePostId }) {

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
