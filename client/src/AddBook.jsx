import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const AddBook = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    copies: 1,
  });
  
// Recommendation State & Effect
const [recommendations, setRecommendations] = useState([]);
 
useEffect(() => {
  if (!formData.category || formData.category.trim() === ''){
    setRecommendations([]);
    return;
  }
   fetch(`http://localhost:5000/api/books/recommendations?category=${encodeURIComponent(formData.category)}`)
    .then((res) => res.json())
    .then((data) => {
      console.log("AI Recommendations Data:", data); 
      setRecommendations(data);
    })
    .catch((err) => console.error("Error fetching recommendations:",err));
}, [formData.category]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setLoading(false);

        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Boi shofolbhave add hoyeche!',
          confirmButtonText: 'OK'
        }).then((result) => {
         if (result.isConfirmed) {
          setFormData({ title: '', author: '', category: '', copies: 1 });
         }
        });
        
      } else {
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Boi jog korte somoshsha hoyeche!',
        });
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Server Error',
        text: 'Server-er sathe connect kora jacche na!',
      });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center text-indigo-700">নতন বই যুক্ত করুন</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">বইয়ের নাম</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g. Clean Code"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">লেখকের নাম</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            placeholder="e.g. Robert Martin"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">ক্যাটাগরি</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={(e) => {
              handleChange(e);
              fetchRecommendations(e.target.value);
            }}
            required
            placeholder="e.g. Computer Science"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">কপি সংখ্যা</label>
          <input
            type="number"
            name="copies"
            value={formData.copies}
            onChange={handleChange}
            required
            min="1"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          {loading ? 'Adding Book...' : 'Add Book'}
        </button>
      </form>
  {/* AI Recommendation Section */}
  {recommendations.length > 0 && (
    <div className="bg-indigo-50 p-4 rounded-xl my-6 border border-indigo-200">
      <h3 className="text-lg font-bold text-indigo-700 mb-3">
        ✨ AI Recommended Books
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendations.map((book) => (
          <div key={book._id} className="bg-white p-3 rounded-lg shadow-sm border">
            <h4 className="font-semibold text-gray-800">{book.title}</h4>
            <p className="text-sm text-gray-600">Author: {book.author}</p>
            <span className="inline-block mt-2 px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded-full">
              {book.category}
            </span>
          </div>
        ))}
      </div>
    </div>
  )}
    </div>
  );
};

export default AddBook;