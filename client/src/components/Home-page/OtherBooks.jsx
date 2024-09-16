import React, { useEffect, useState } from 'react'
import BookCards from './BookCards'

const OtherBooks = ({ onBookSelect }) => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/all-books")
        .then(res => res.json())
        .then(data => setBooks(data.slice(8,16)))
    }, []);

    return (
        <div>
            <BookCards books={books} headline="Other Books" onBookSelect={onBookSelect} />
        </div>
    )
}

export default OtherBooks