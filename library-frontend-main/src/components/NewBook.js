import { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client';
import ALL_AUTHORS from '../graphql/queries/allAuthors';
import ADD_BOOK from '../graphql/mutations/addBook';
import { useNavigate } from 'react-router-dom';

const NewBook = ({ token }) => {
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
      cache.updateQuery({ query: ALL_AUTHORS }, ({ allAuthors }) => {
        const authorNames = allAuthors.map(author => author.name);
        const authorName = response.data.addBook.author.name;
        return {
          allAuthors: !authorNames.includes(authorName) ? allAuthors.concat(response.data.addBook.author) : allAuthors,
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