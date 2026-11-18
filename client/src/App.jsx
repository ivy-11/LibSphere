
import ShelfMap from './ShelfMap';

import SeatPanel from './SeatPanel';
import AddBook from './AddBook';
import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [books, setBooks] = useState([]);
  // State and Filter Logic 
  const [searchTerm, setSearchTerm] = useState('');
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetch('http://localhost:5000/api/books')
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.error('Error fetching books:', err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">

        {/* 1.Add Book Form */}
        <AddBook />

        {/* Interactive Shelf Map */}
        <ShelfMap />

        {/* Seat Management Panel */}
        <SeatPanel />

        {/*Search Box UI */} 
        <div className="mb-6 max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search by Title, Author, or Category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />
        </div>

        {/* 2.Header */}
        <div className="mb-8 text-center">
          <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-indigo-700">📚 LibSphere - Book List</h1>
          <p className="text-gray-600 mt-2">Explore books fetched directly from your backend database</p>
         </header>
        </div> 

        {/* 3.Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book, index) => (
            <div 
              key={book._id || index} 
              className="bg-white p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-800">{book.title}</h2>
              <p className="text-gray-600 mt-1">Author: <span className="font-medium text-gray-700">{book.author}</span></p>
              <div className="mt-3 flex justify-between items-center">
                <span className="bg-indigo-100 text-indigo-800 text-xs px-2.5 py-1 rounded-full font-medium">
                  {book.category || 'General'}
                </span>
                <span className="text-sm text-gray-500">Copies: {book.copies || 1}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;