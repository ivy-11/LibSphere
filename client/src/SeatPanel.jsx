import React, { useState, useEffect } from 'react';

const SeatPanel = () => {
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState("Dipa"); // Student nam input rakhar jonno state

  // 1. Server theke seats data load kora (GET API)
  const fetchSeats = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/seats');
      const data = await res.json();
      setSeats(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching seats:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeats();
  }, []);

  // 2. Seat Booking Function (POST API)
  const handleBookSeat = async (seatNumber) => {
    try {
      const res = await fetch('http://localhost:5000/api/seats/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seatNumber, bookedBy: studentName || "Student" })
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        fetchSeats(); // UI refresh korar jonno abar data fetch korbe
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error("Booking error:", err);
    }
  };

  if (loading) return <p className="text-center p-4">Loading seats...</p>;

  // Sample seats list
  const seatList = ["A1", "A2", "A3", "B1", "B2", "B3"];

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-md my-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Library Seat Management</h2>
      
      {/* Student Name Input Field */}
      <div className="mb-4 flex items-center justify-center gap-2">
        <label className="font-semibold text-gray-700">Your Name:</label>
        <input 
          type="text" 
          value={studentName} 
          onChange={(e) => setStudentName(e.target.value)}
          placeholder="Enter your name" 
          className="border px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {seatList.map((seatNum) => {
          const foundSeat = seats.find(s => s.seatNumber === seatNum);
          const isBooked = foundSeat && foundSeat.status === 'Booked';

          return (
            <button
              key={seatNum}
              onClick={() => handleBookSeat(seatNum)}
              className={`p-4 rounded-lg font-semibold text-white transition-all ${
                isBooked 
                  ? 'bg-red-500 hover:bg-red-600 cursor-not-allowed' 
                  : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              Seat {seatNum}
              <div className="text-xs mt-1">
                {isBooked ? `Booked (${foundSeat.bookedBy})` : 'Available'}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SeatPanel;