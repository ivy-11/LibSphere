import React, { useState, useEffect } from 'react';

export default function ShelfMap() {
  const [shelves, setShelves] = useState([]);
  const [selectedShelf, setSelectedShelf] = useState(null);

  // Backend theke live shelves data load korar jonno useEffect
  useEffect(() => {
    fetch('http://localhost:5000/api/shelves')
      .then((res) => res.json())
      .then((data) => setShelves(data))
      .catch((err) => console.error('Error fetching shelves:', err));
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-base-100 rounded-xl shadow-lg mt-8 border border-base-200">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            🗺️ Interactive 2D Library Floor Map
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Click on any shelf to check live book distribution, capacity, and category mapping.
          </p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0 text-xs font-semibold">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">🟢 Available Space</span>
          <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full">🟡 Filling Fast</span>
          <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full">🔵 Fully Optimized</span>
        </div>
      </div>

      {/* Selected Shelf Detail Drawer / Modal Panel */}
      {selectedShelf && (
        <div className="mb-6 p-4 bg-base-200 rounded-lg border-l-4 border-primary transition-all duration-300 shadow-sm">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg text-primary flex items-center gap-2">
              📍 Selected Shelf Zone: {selectedShelf.name} ({selectedShelf.code})
            </h3>
            <button 
              onClick={() => setSelectedShelf(null)}
              className="btn btn-sm btn-ghost"
            >
              ✕ Close
            </button>
          </div>
          <p className="text-sm mt-1 text-gray-600">
            Current category: <span className="font-semibold">{selectedShelf.category}</span> | 
            Capacity Status: <span className="font-semibold uppercase">{selectedShelf.capacity}</span> | 
            Stored Books: <span className="font-semibold">{selectedShelf.booksCount || 0} Units</span>
          </p>
        </div>
      )}

      {/* Grid Layout for Shelves */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {shelves.map((shelf) => (
          <div
            key={shelf._id || shelf.code}
            onClick={() => setSelectedShelf(shelf)}
            className={`p-5 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-md bg-white border-base-300 relative overflow-hidden`}
          >
            <div className="flex justify-between items-start mb-3">
              <span className="badge badge-outline font-mono text-xs">{shelf.code}</span>
              <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-base-200">
                {shelf.capacity}
              </span>
            </div>
            <h3 className="font-bold text-base mb-1">{shelf.name}</h3>
            <p className="text-xs text-gray-500 mb-3">Category: {shelf.category}</p>
            
            <div className="flex justify-between items-center text-xs pt-3 border-t border-base-200">
              <span className="text-gray-600">Stored Books: {shelf.booksCount || 0} Units</span>
              <span className="text-primary font-semibold hover:underline">View Details →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}