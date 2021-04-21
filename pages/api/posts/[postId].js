import db from '../../../db';

export default (req, res) => {
  try{
    if (req.method === 'GET') {
      GET(req, res);
    } else if (req.method === 'PUT') {
      PUT(req, res);
    } else if (req.method === 'DELETE') {
      DELETE(req, res);
    }
  } catch (error) {
    res.status(500);
    res.json({ 'message': 'Error occurred.', error});
  }
}

function GET(req, res) {
  const { postId } = req.query;

  const post = db.posts.find(p => p.id === postId);

  if (!post) {
    res.status(404);
    return res.send('Post not found');
  }

  res.json(post);
}

function PUT(req, res) {
  const { postId } = req.query;

  const post = db.posts.find(p => p.id === postId);
  if (!post) {
    res.status(404);
    return res.send('Post not found')
  }

  const updatedPost = {
    ...post,
    ...req.body
  }

  db.posts.map(post => (post.id === postId ? updatedPost : post));

  res.json(updatedPost);
}

function DELETE(req, res) {
  const { postId } = req.query;

  const post = db.posts.find(p => p.id === postId);
  if (!post) {
    res.status(404);
    return res.send('Post not found')
  }

  db.posts.filter(p => p.id !== postId);

  res.send('Post deleted');
}
