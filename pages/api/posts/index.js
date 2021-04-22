import { nanoid } from 'nanoid';
import db from '../../../db';
import { sleep } from '../../../utils'

export default async (req, res) => {
  await sleep();

  try {
    if (req.method === 'GET') {
      GET(req, res);
    } else if (req.method === 'POST') {
      POST(req, res);
    }
  } catch(error) {
    console.error(error)
    res.status(500)
    res.json({ message: 'An unknown error occurred!', error })
  }
}

function GET(req, res) {
  res.json(db.posts);
}

function POST(req, res) {
  const newPost = {
    id: nanoid(),
    ...req.body
  }

  db.posts.push(newPost);

  res.json(newPost);
}
