import React, { useEffect, useState } from 'react'
import BookCards from './BookCards'

const OtherBooks = ({ onBookSelect }) => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/all-books`)
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