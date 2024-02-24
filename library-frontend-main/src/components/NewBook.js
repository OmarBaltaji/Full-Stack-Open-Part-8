import { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client';
import { ADD_BOOK, ALL_BOOKS } from '../queries';
import { useNavigate } from 'react-router-dom';

const NewBook = ({ token, favoriteGenre }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const navigate = useNavigate();

  const [addBook] = useMutation(ADD_BOOK, {
    onError: (error) => {
      const messages = error.graphQLErrors.map(e => e.message).join('\n');
      console.log(messages);
    },
    update: (cache, response) => {
      // When accessing the query from the cache, the variable needs to be the same as the one cached
      cache.updateQuery({ query: ALL_BOOKS, variables: { genre: favoriteGenre } }, ({ allBooks }) => {
        console.log(allBooks);
        return {
          allBooks: allBooks.concat(response.data.addBook)
        }
      })
    }
  });

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token]);

  const submit = async (event) => {
    event.preventDefault()

    addBook({ variables: { title, author, published: parseInt(published), genres } });

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook