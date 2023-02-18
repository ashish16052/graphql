import './App.css';
import Form from './Form'
import { useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client'

function App() {

  const [books, setBooks] = useState([])

  const booksQuery = gql`
    query{
      books{
        id
        name
        author{
          name
        }
      }
    }
  `

  const { err, loading, data } = useQuery(booksQuery)

  useEffect(() => {
    if (data)
      setBooks(data.books)
  }, [data])

  return (
    <div className='app'>
      {
        books.map((book, id) => (
          <div key={id} className='book'>
            <p>{book.id}</p>
            <p>{book.name}</p>
            <p>{book.author.name}</p>
          </div>
        ))
      }
      <Form />
    </div>
  );
}

export default App;
