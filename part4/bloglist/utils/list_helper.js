const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.map(blog => blog.likes).reduce((total, current) => total + current, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }
  return blogs.reduce((favorite, blog) => {
    return blog.likes > favorite.likes ? blog : favorite;
  }, blogs[0]);
}

const mostBlogs = (blogs) => {
  const authors = []
  blogs.forEach(blog => {
    const author = authors.find(a => a.author === blog.author); // try to find current author in authors
    if (!author) { // if the author can not be found from the authors array
      authors.push({ author: blog.author, blogs: 1 })
    }
    else {
      author.blogs += 1 // if found increment their amount of blogs
    }
  })
  // finding the author with most blogs
  return authors.reduce((max, author) => {
    return author.blogs > max.blogs ? author : max;
  });
}

const mostLikes = (blogs) => {
  const authors = []
  blogs.forEach(blog => {
    const author = authors.find(a => a.author === blog.author);
    if (!author) { // if the author can not be found from the authors array
      authors.push({ author: blog.author, likes: blog.likes }) // add it
    }
    else {
      author.likes += blog.likes // if found increment their total amount of likes
    }
  })
  // finding the author with most likes
  return authors.reduce((max, author) => {
    return author.likes > max.likes ? author : max;
  });
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}