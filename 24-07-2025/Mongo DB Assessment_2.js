use librarydb

 db.books.insertMany([ 
{ book_id: 201, title: "The Alchemist", author: "Paulo Coelho", genre: "Fiction", 
copies: 10 }, 
{ book_id: 202, title: "Atomic Habits", author: "James Clear", genre: "Self-Help", 
copies: 5 }, 
{ book_id: 203, title: "Sapiens", author: "Yuval Noah Harari", genre: "History", 
copies: 7 }, 
{ book_id: 204, title: "The Lean Startup", author: "Eric Ries", genre: "Business", 
copies: 3 }, 
{ book_id: 205, title: "Deep Work", author: "Cal Newport", genre: "Productivity", 
copies: 4 } 
])
 

 db.members.insertMany([ 
{ member_id: 101, name: "Ayesha Khan", joined_on: new Date("2024-01-15") }, 
{ member_id: 102, name: "Rahul Verma", joined_on: new Date("2024-03-12") }, 
{ member_id: 103, name: "Nikita Rao", joined_on: new Date("2024-04-10") } 
])


 db.borrowed.insertMany([ 
{ borrow_id: 1, member_id: 101, book_id: 201, date: new Date("2024-06-01"), 
returned: true }, 
{ borrow_id: 2, member_id: 101, book_id: 203, date: new Date("2024-06-15"), 
returned: false }, 
{ borrow_id: 3, member_id: 102, book_id: 202, date: new Date("2024-06-20"), 
returned: false }, 
{ borrow_id: 4, member_id: 103, book_id: 204, date: new Date("2024-06-22"), 
returned: true } 
])


// 1. Find all books in the Self-Help genre.

db.books.find({ genre: "Self-Help" })


// 2. Show members who joined after March 2024.

db.members.find({ joined_on: { $gt: new Date("2024-03-31") } })


// 3. List all borrowed books that have not been returned.

db.borrowed.find({ returned: false })


// 4. Display all books with fewer than 5 copies in stock.

db.books.find({ copies: { $lt: 5 } })


// 5. Get details of all books written by Cal Newport.

db.books.find({ author: "Cal Newport" })


// 6. List all borrow records with book title and member name.

db.borrowed.aggregate([
  { $lookup: {
      from: "books",
      localField: "book_id",
      foreignField: "book_id",
      as: "book_info"
  }},
  { $lookup: {
      from: "members",
      localField: "member_id",
      foreignField: "member_id",
      as: "member_info"
  }},
  { $unwind: "$book_info" },
  { $unwind: "$member_info" },
  { $project: {
      borrow_id: 1,
      book_title: "$book_info.title",
      member_name: "$member_info.name",
      date: 1,
      returned: 1
  }}
])


// 7. Find which member borrowed "Sapiens".

db.borrowed.aggregate([
  { $lookup: {
      from: "books",
      localField: "book_id",
      foreignField: "book_id",
      as: "book_info"
  }},
  { $unwind: "$book_info" },
  { $match: { "book_info.title": "Sapiens" }},
  { $lookup: {
      from: "members",
      localField: "member_id",
      foreignField: "member_id",
      as: "member_info"
  }},
  { $unwind: "$member_info" },
  { $project: { _id: 0, member_name: "$member_info.name" } }
])


// 8. Display all members along with the books they've borrowed.

db.members.aggregate([
  { $lookup: {
      from: "borrowed",
      localField: "member_id",
      foreignField: "member_id",
      as: "borrowed_books"
  }}
])


// 9. Get a list of members who have borrowed books and not returned them.

db.borrowed.aggregate([
  { $match: { returned: false }},
  { $lookup: {
      from: "members",
      localField: "member_id",
      foreignField: "member_id",
      as: "member_info"
  }},
  { $unwind: "$member_info" },
  { $project: { member_name: "$member_info.name", _id: 0 } }
])


// 10. Show each book along with how many times it has been borrowed.

db.borrowed.aggregate([
  { $group: {
      _id: "$book_id",
      borrow_count: { $sum: 1 }
  }},
  { $lookup: {
      from: "books",
      localField: "_id",
      foreignField: "book_id",
      as: "book_info"
  }},
  { $unwind: "$book_info" },
  { $project: {
      title: "$book_info.title",
      borrow_count: 1
  }}
])


// 11. Count how many books each member has borrowed.

db.borrowed.aggregate([
  { $group: {
      _id: "$member_id",
      borrow_count: { $sum: 1 }
  }},
  { $lookup: {
      from: "members",
      localField: "_id",
      foreignField: "member_id",
      as: "member_info"
  }},
  { $unwind: "$member_info" },
  { $project: {
      member_name: "$member_info.name",
      borrow_count: 1
  }}
])


// 12. Which genre has the highest number of books?

db.books.aggregate([
  { $group: {
      _id: "$genre",
      total_books: { $sum: "$copies" }
  }},
  { $sort: { total_books: -1 }},
  { $limit: 1 }
])


// 13. List the top 2 most borrowed books.

db.borrowed.aggregate([
  { $group: {
      _id: "$book_id",
      borrow_count: { $sum: 1 }
  }},
  { $sort: { borrow_count: -1 }},
  { $limit: 2 },
  { $lookup: {
      from: "books",
      localField: "_id",
      foreignField: "book_id",
      as: "book_info"
  }},
  { $unwind: "$book_info" },
  { $project: {
      title: "$book_info.title",
      borrow_count: 1
  }}
])


// 14. Show the average number of copies available per genre.

db.books.aggregate([
  { $group: {
      _id: "$genre",
      avg_copies: { $avg: "$copies" }
  }}
])


// 15. Find the total number of books currently borrowed (not returned).

db.borrowed.aggregate([
  { $match: { returned: false }},
  { $group: {
      _id: null,
      total_borrowed: { $sum: 1 }
  }}
])


// 16. Add a new member who hasn't borrowed any book. Write a query to list such members.

db.members.insertOne({ member_id: 104, name: "Zoya", joined_on: new Date("2024-07-01") })
db.members.aggregate([
  { $lookup: {
      from: "borrowed",
      localField: "member_id",
      foreignField: "member_id",
      as: "borrow_info"
  }},
  { $match: { borrow_info: { $eq: [] } }}
])


// 17. Identify books that have never been borrowed.

db.books.aggregate([
  { $lookup: {
      from: "borrowed",
      localField: "book_id",
      foreignField: "book_id",
      as: "borrow_info"
  }},
  { $match: { borrow_info: { $eq: [] } }}
])


// 18. Get the name of members who borrowed more than one book.

db.borrowed.aggregate([
  { $group: {
      _id: "$member_id",
      count: { $sum: 1 }
  }},
  { $match: { count: { $gt: 1 } }},
  { $lookup: {
      from: "members",
      localField: "_id",
      foreignField: "member_id",
      as: "member_info"
  }},
  { $unwind: "$member_info" },
  { $project: { member_name: "$member_info.name", count: 1 } }
])


// 19. Display borrowing trends by month (group by date).

db.borrowed.aggregate([
  { $group: {
      _id: { $month: "$date" },
      borrow_count: { $sum: 1 }
  }},
  { $sort: { _id: 1 } }
])


// 20. Show borrow records where the borrowed book had fewer than 5 copies at the time of borrowing.

db.borrowed.aggregate([
  { $lookup: {
      from: "books",
      localField: "book_id",
      foreignField: "book_id",
      as: "book_info"
  }},
  { $unwind: "$book_info" },
  { $match: { "book_info.copies": { $lt: 5 } }},
  { $project: {
      borrow_id: 1,
      book_title: "$book_info.title",
      member_id: 1,
      date: 1
  }}
])
