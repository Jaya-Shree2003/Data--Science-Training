PART 1: Create Collections
Create the following 3 collections in a database named bookstoreDB :
books
Fields:
book_id (Number)
title (String)
author (String)
genre (String)
price (Number)
stock (Number)

2. customers
Fields:
customer_id (Number)
name (String)
email (String)
city (String)

3. orders
Fields:
order_id (Number)
customer_id (Number)
book_id (Number)
order_date (ISODate)
quantity (Number)

PART 2: Insert Sample Data
Insert at least:
5 books (mix of genres and price points)
db.books.insertMany([{
book_id: 101,
title: "Attitude is everything",
author: "Jeff kille",
genre: "Self help",
price: 299,
stock: 4
},{
book_id: 102,
title: "The AI Revolution",
author: "Ray Kurzweil",
genre: "Technology",
price: 799,
stock: 20},
{
book_id: 103,
title: "The Life of PI",
author: "Ray Kurzweil",

genre: "Bravery",
price: 799,
stock: 20
},{
book_id: 104,
title: "The Deep Learning",
author: "Ray Henifer",

genre: "Technology",
price: 855,
stock: 24
},{
book_id: 105,
title: "Think and grow rich",
author: "Napolean Hill",

genre: "Business",
price: 399,
stock: 40
}]);
5 customers (different cities)

db.customers.insertMany([
  {
    customer_id: 101,
    name: "Amit Sharma",
    email: "amit.sharma@example.com",
    city: "Hyderabad"
  },
  {
    customer_id: 102,
    name: "Priya Verma",
    email: "priya.verma@example.com",
    city: "Mumbai"
  },
  {
    customer_id: 103,
    name: "Rahul Mehta",
    email: "rahul.mehta@example.com",
    city: "Bangalore"
  },
  {
    customer_id: 104,
    name: "Sneha Iyer",
    email: "sneha.iyer@example.com",
    city: "Chennai"
  },
  {
    customer_id: 105,
    name: "Ravi Patel",
    email: "ravi.patel@example.com",
    city: "Ahmedabad"
  }
]);

7 orders (various combinations of books & customers)

db.orders.insertMany([
  {
    order_id: 201,
    customer_id: 101,
    book_id: 102,
    order_date: ISODate("2025-07-01T10:15:00Z"),
    quantity: 2
  },
  {
    order_id: 202,
    customer_id: 102,
    book_id: 104,
    order_date: ISODate("2025-07-03T11:30:00Z"),
    quantity: 1
  },
  {
    order_id: 203,
    customer_id: 103,
    book_id: 101,
    order_date: ISODate("2025-07-05T09:45:00Z"),
    quantity: 3
  },
  {
    order_id: 204,
    customer_id: 104,
    book_id: 103,
    order_date: ISODate("2025-07-08T14:00:00Z"),
    quantity: 1
  },
  {
    order_id: 205,
    customer_id: 105,
    book_id: 105,
    order_date: ISODate("2025-07-10T16:20:00Z"),
    quantity: 2
  },
  {
    order_id: 206,
    customer_id: 101,
    book_id: 101,
    order_date: ISODate("2025-07-12T13:15:00Z"),
    quantity: 1
  },
  {
    order_id: 207,
    customer_id: 102,
    book_id: 105,
    order_date: ISODate("2025-07-14T18:10:00Z"),
    quantity: 2
  }
]);
PART 3: Write Queries
Basic Queries:
1. List all books priced above
500.

db.books.find({price:{$gt:500} })

2. Show all customers from ‘Hyderabad’.

db.customers.find({city:"Hyderabad"})

3. Find all orders placed after January 1, 2023.
db.orders.find({order_date:{$gt:ISODate("2021-01-01")}})

db.orders.aggregate([
  {
    $lookup: {
      from: "customers",
      localField: "customer_id",
      foreignField: "customer_id",
      as: "customer"
    }
  },
  {
    $unwind: "$customer"
  },
  {
    $lookup: {
      from: "books",
      localField: "book_id",
      foreignField: "book_id",
      as: "book"
    }
  },
  {
    $unwind: "$book"
  },
  {
    $project: {
      _id: 0,
      order_id: 1,
      order_date: 1,
      quantity: 1,
      customer_name: "$customer.name",
      book_title: "$book.title"
    }
  }
])

Joins via $lookup :
4. Display order details with customer name and book title.

db.orders.aggregate([
  {
    $lookup: {
      from: "customers",
      localField: "customer_id",
      foreignField: "customer_id",
      as: "customer"
    }
  },
  {
    $unwind: "$customer"
  },
  {
    $lookup: {
      from: "books",
      localField: "book_id",
      foreignField: "book_id",
      as: "book"
    }
  },
  {
    $unwind: "$book"
  },
  {
    $project: {
      _id: 0,
      order_id: 1,
      order_date: 1,
      quantity: 1,
      customer_name: "$customer.name",
      book_title: "$book.title"
    }
  }
])

5. Show total quantity ordered for each book.
db.orders.aggregate([
  {
    $group: {
      _id: "$book_id",
      total_quantity: { $sum: "$quantity" }
    }
  },
  {
    $lookup: {
      from: "books",
      localField: "_id",
      foreignField: "book_id",
      as: "book"
    }
  },
  {
    $unwind: "$book"
  },
  {
    $project: {
      _id: 0,
      book_id: "$_id",
      book_title: "$book.title",
      total_quantity: 1
    }
  }
])

6. Show the total number of orders placed by each customer.
db.orders.aggregate([
  {
    $group: {
      _id: "$customer_id",
      total_orders: { $sum: 1 }
    }
  },
  {
    $lookup: {
      from: "customers",
      localField: "_id",
      foreignField: "customer_id",
      as: "customer"
    }
  },
  {
    $unwind: "$customer"
  },
  {
    $project: {
      _id: 0,
      customer_id: "$_id",
      customer_name: "$customer.name",
      total_orders: 1
    }
  }
])

Aggregation Queries:
7. Calculate total revenue generated per book.

db.orders.aggregate([
  {
    $lookup: {
      from: "books",
      localField: "book_id",
      foreignField: "book_id",
      as: "book"
    }
  },
  { $unwind: "$book" },
  {
    $project: {
      book_id: 1,
      title: "$book.title",
      revenue: { $multiply: ["$quantity", "$book.price"] }
    }
  },
  {
    $group: {
      _id: "$book_id",
      title: { $first: "$title" },
      totalRevenue: { $sum: "$revenue" }
    }
  }
])

8. Find the book with the highest total revenue.
db.orders.aggregate([
  {
    $lookup: {
      from: "books",
      localField: "book_id",
      foreignField: "book_id",
      as: "book"
    }
  },
  { $unwind: "$book" },
  {
    $project: {
      book_id: 1,
      title: "$book.title",
      revenue: { $multiply: ["$quantity", "$book.price"] }
    }
  },
  {
    $group: {
      _id: "$book_id",
      title: { $first: "$title" },
      totalRevenue: { $sum: "$revenue" }
    }
  },
  { $sort: { totalRevenue: -1 } },
  { $limit: 1 }
])

9. List genres and total books sold in each genre.
db.orders.aggregate([
  {
    $lookup: {
      from: "books",
      localField: "book_id",
      foreignField: "book_id",
      as: "book"
    }
  },
  { $unwind: "$book" },
  {
    $group: {
      _id: "$book.genre",
      totalBooksSold: { $sum: "$quantity" }
    }
  },
  {
    $project: {
      genre: "$_id",
      totalBooksSold: 1,
      _id: 0
    }
  }
])

10. Show customers who ordered more than 2 different books.

db.orders.aggregate([
  {
    $group: {
      _id: "$customer_id",
      uniqueBooks: { $addToSet: "$book_id" }
    }
  },
  {
    $project: {
      customer_id: "$_id",
      bookCount: { $size: "$uniqueBooks" }
    }
  },
  {
    $match: {
      bookCount: { $gt: 2 }
    }
  },
  {
    $lookup: {
      from: "customers",
      localField: "customer_id",
      foreignField: "customer_id",
      as: "customer"
    }
  },
  { $unwind: "$customer" },
  {
    $project: {
      _id: 0,
      customer_id: 1,
      name: "$customer.name",
      email: "$customer.email",
      bookCount: 1
    }
  }
])
