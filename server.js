const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
require('dotenv').config();

//Book Model Import
const { Book, Shelf, Seat } = require('./model');

const app  = express();
const PORT = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());

//MongoDB Connection
const uri = "mongodb://localhost:27017/lipsphere"; //Local MongoDB database URL

mongoose.connect(uri)
   .then(() => {
    console.log("MonngoDB Connected Successfully!");
    seedShelves();
   })
   .catch((err) => console.log("Database connection error: ", err));
   
   //Basic Route
   app.get('/', (req, res) => {
    res.send("Libsphere Backend API is working smoothly!");
   });

   // 1. Notun boi add korar route (POST)
   app.post('/api/books', async (req, res) => {
    try {
     const { title, author, category, copies } = req.body;
    
    // Notun boi save 
    const newBook = new Book({ title, author, category, copies });
    const savedBook = await newBook.save();

    //  shelf-er booksCount increment
    const bookCopies = Number(copies) || 1;
    await Shelf.findOneAndUpdate(
      { category: { $regex: new RegExp(category, 'i') } },
      { $inc: { booksCount: bookCopies } },
      { new: true }
    );

    res.status(201).json(savedBook);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

   //2.Sob boi dekhar route (GET)
   app.get('/api/books', async (req,res) => {
    try{
        const books = await Book.find();
        res.status(200).json(books);
    }   catch (err) {
        res.status(500).json({ error: err.message });
    }
   });

   // AI Recommendation Endpoint
app.get('/api/books/recommendations', async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }
    // Fetch up to 3 recommended books from the database
    const recommendations = await Book.find(query).limit(3);
    res.json(recommendations);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

   //3. Specific ID diye single boi dekhar route (GET)
    app.get('/api/books/:id', async (req, res) => {
        try{
            const book = await Book.findById(req.params.id);
            if (!book) {
            return res.status(404).json({ message: "Book not found" });
            }
            res.status(200).json(book);
        }   catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

    // 4. Update a book by ID (PUT)
    app.put('/api/books/:id', async (req, res) => {
        try {
         const updatedBook = await Book.findByIdAndUpdate(
             req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedBook) {
         return res.status(404).json({ message: "Book not found" });
        }
         res.status(200).json(updatedBook);
        } catch (error) {
        res.status(500).json({ message: error.message });
        }
    });

    // 5. Delete a book by ID (DELETE)
    app.delete('/api/books/:id', async (req, res) => {
     try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (!deletedBook) {
         return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json({ message: "Book deleted successfully" });
        } catch (error) {
       res.status(500).json({ message: error.message });
        }
    });

    // Get all shelves for Interactive Floor Map
    app.get('/api/shelves', async (req, res) => {
     try {
       const shelves = await Shelf.find();
       res.json(shelves);
     } catch (err) {
       res.status(500).json({ error: 'Failed to fetch shelves' });
     }
   });

    // 1. Sob seat dekhar route (GET)
    app.get('/api/seats', async (req, res) => {
      try {
       const seats = await Seat.find();
       res.status(200).json(seats);
    }  catch (err) {
       res.status(500).json({ error: err.message });
    }
  });

    // 2. Seat booking ba auto-creation route (POST)
    app.post('/api/seats/book', async (req, res) => {
      try {
       const { seatNumber, bookedBy } = req.body;

      // Find or create the seat dynamically
      let seat = await Seat.findOne({ seatNumber });
    
      if (!seat) {
        // Jodi seat na thake, tahole notun ready kore sathe sathe book kore dibe
        seat = new Seat({
          seatNumber,
          status: 'Booked',
          bookedBy: bookedBy || "Student",
          bookedAt: new Date()
        });
        await seat.save();
        return res.status(201).json({ message: "Seat created and successfully booked!", seat });
      }

      if (seat.status === 'Booked') {
        return res.status(400).json({ error: "Ei seat-ti already booked kora ache!" });
      }

      seat.status = 'Booked';
      seat.bookedBy = bookedBy || "Student";
      seat.bookedAt = new Date();
      await seat.save();

      res.status(200).json({ message: "Seat successfully booked!", seat });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

    // Auto-seed sample shelves if collection is empty
    const seedShelves = async () => {
     try {
      const count = await Shelf.countDocuments();
      if (count === 0) {
       await Shelf.insertMany([
        { code: "S-101", name: "Computer Science & AI", category: "Computer Science", capacity: "Full", booksCount: 42, color: "emerald" },
        { code: "S-102", name: "Algorithms & Data Structures", category: "Computer Science", capacity: "Available", booksCount: 18, color: "amber" },
        { code: "S-201", name: "Networking & Security", category: "Network Security", capacity: "Filling Fast", booksCount: 35, color: "indigo" },
        { code: "S-202", name: "Database Systems & MIS", category: "Database Systems", capacity: "Available", booksCount: 22, color: "emerald" },
        { code: "S-301", name: "Software Engineering & SQA", category: "Software Engineering", capacity: "Available", booksCount: 25, color: "amber" },
        { code: "S-302", name: "Graphics & Multimedia", category: "Computer Graphics", capacity: "Maintenance", booksCount: 5, color: "indigo" }
      ]);
      console.log("Sample shelves seeded successfully!");
    }
  } catch (err) {
    console.error("Error seeding shelves:", err);
  }
};

    // Auto-Cancel Cron Job: Proti 10 minute por por run hobe
    cron.schedule('*/10 * * * *', async () => {
      try {
       const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

       const expiredSeats = await Seat.updateMany(
         { 
           status: 'Booked', 
           bookedAt: { $lt: thirtyMinutesAgo } 
         },
         { 
           $set: { 
           status: 'Available', 
           bookedBy: null, 
           bookedAt: null 
           } 
         }
       );

       if (expiredSeats.modifiedCount > 0) {
         console.log(`Cron Job: ${expiredSeats.modifiedCount} ti expired seat auto-cancel kore 'Available' kora holo.`);
       }
     } catch (err) {
       console.error("Cron job error:", err.message);
     }
   });
   
    //Server listen part
    app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
    });
