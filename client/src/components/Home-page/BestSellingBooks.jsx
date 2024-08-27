import React, { useState, useEffect } from 'react'
import BookCards from './BookCards'

const BestSellingBooks = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/all-books")
        .then(res => res.json())
        .then(data => setBooks(data.slice(0, 8)))
    }, []);
  return (
    <div>
      <BookCards books={books} headline="Best Selling Books"/>
    </div>
  )
}

export default BestSellingBooks
