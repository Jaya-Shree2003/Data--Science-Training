PART 2: Insert Sample Data
Insert:
5 users (from various countries)

db.users.insertMany([
  { user_id: 1, name: "Alice", email: "alice@example.com", country: "USA" },
  { user_id: 2, name: "Bob", email: "bob@example.com", country: "India" },
  { user_id: 3, name: "Carlos", email: "carlos@example.com", country: "Brazil" },
  { user_id: 4, name: "Diana", email: "diana@example.com", country: "Germany" },
  { user_id: 5, name: "Eva", email: "eva@example.com", country: "Japan" }
])

6 movies (from different genres)
db.movies.insertMany([
  { movie_id: 101, title: "Inception", genre: "Sci-Fi", release_year: 2010, duration: 148 },
  { movie_id: 102, title: "Parasite", genre: "Thriller", release_year: 2021, duration: 132 },
  { movie_id: 103, title: "Spirited Away", genre: "Animation", release_year: 2001, duration: 125 },
  { movie_id: 104, title: "Interstellar", genre: "Sci-Fi", release_year: 2014, duration: 169 },
  { movie_id: 105, title: "The Godfather", genre: "Crime", release_year: 1972, duration: 175 },
  { movie_id: 106, title: "The Dark Knight", genre: "Action", release_year: 2008, duration: 152 }
])

8 watch_history entries (some users watch the same movie multiple times)

db.watch_history.insertMany([
  { watch_id: 1, user_id: 1, movie_id: 101, watched_on: new Date("2023-05-01"), watch_time: 120 },
  { watch_id: 2, user_id: 1, movie_id: 102, watched_on: new Date("2023-05-03"), watch_time: 132 },
  { watch_id: 3, user_id: 2, movie_id: 101, watched_on: new Date("2023-05-02"), watch_time: 148 },
  { watch_id: 4, user_id: 3, movie_id: 103, watched_on: new Date("2023-05-05"), watch_time: 125 },
  { watch_id: 5, user_id: 4, movie_id: 104, watched_on: new Date("2023-05-06"), watch_time: 169 },
  { watch_id: 6, user_id: 5, movie_id: 105, watched_on: new Date("2023-05-07"), watch_time: 175 },
  { watch_id: 7, user_id: 2, movie_id: 106, watched_on: new Date("2023-05-08"), watch_time: 152 },
  { watch_id: 8, user_id: 2, movie_id: 101, watched_on: new Date("2023-05-09"), watch_time: 100 }
])

PART 3: Query Tasks
Basic:
1. Find all movies with duration > 100 minutes.
db.movies.find({duration:{$gt:100}})

2. List users from 'India'.
db.users.find({country:"India"})

3. Get all movies released after 2020.
db.movies.find({release_year:{$gt:2020}})

Intermediate:
4. Show full watch history: user name, movie title, watch time.

db.watch_history.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "user_id",
      foreignField: "user_id",
      as: "user"
    }
  },
  { $unwind: "$user" },
  {
    $lookup: {
      from: "movies",
      localField: "movie_id",
      foreignField: "movie_id",
      as: "movie"
    }
  },
  { $unwind: "$movie" },
  {
    $project: {
      _id: 0,
      user_name: "$user.name",
      movie_title: "$movie.title",
      watch_time: 1
    }
  }
])

5. List each genre and number of times movies in that genre were watched.
db.watch_history.aggregate([
  {
    $lookup: {
      from: "movies",
      localField: "movie_id",
      foreignField: "movie_id",
      as: "movie"
    }
  },
  { $unwind: "$movie" },
  {
    $group: {
      _id: "$movie.genre",
      watch_count: { $sum: 1 }
    }
  },
  {
    $project: {
      _id: 0,
      genre: "$_id",
      watch_count: 1
    }
  }
])

6. Display total watch time per user.
db.watch_history.aggregate([
  {
    $group: {
      _id: "$user_id",
      total_watch_time: { $sum: "$watch_time" }
    }
  },
  {
    $lookup: {
      from: "users",
      localField: "_id",
      foreignField: "user_id",
      as: "user"
    }
  },
  { $unwind: "$user" },
  {
    $project: {
      _id: 0,
      user_name: "$user.name",
      total_watch_time: 1
    }
  }
])

Advanced:
7. Find which movie has been watched the most (by count).
db.watch_history.aggregate([
  {
    $group: {
      _id: "$movie_id",
      watch_count: { $sum: 1 }
    }
  },
  {
    $sort: { watch_count: -1 }
  },
  { $limit: 1 },
  {
    $lookup: {
      from: "movies",
      localField: "_id",
      foreignField: "movie_id",
      as: "movie"
    }
  },
  { $unwind: "$movie" },
  {
    $project: {
      _id: 0,
      title: "$movie.title",
      watch_count: 1
    }
  }
])

8. Identify users who have watched more than 2 movies.
db.watch_history.aggregate([
  {
    $group: {
      _id: "$user_id",
      total_watches: { $sum: 1 }
    }
  },
  {
    $match: {
      total_watches: 2
    }
  },
  {
    $lookup: {
      from: "users",
      localField: "_id",
      foreignField: "user_id",
      as: "user"
    }
  },
  { $unwind: "$user" },
  {
    $project: {
      _id: 0,
      user_name: "$user.name",
      email: "$user.email",
      total_watches: 1
    }
  }
])

9. Show users who watched the same movie more than once.

db.watch_history.aggregate([
  {
    $group: {
      _id: { user_id: "$user_id", movie_id: "$movie_id" },
      watch_count: { $sum: 1 }
    }
  },
  { $match: { watch_count: { $gt: 1 } } },
  {
    $lookup: {
      from: "users",
      localField: "_id.user_id",
      foreignField: "user_id",
      as: "user"
    }
  },
  { $unwind: "$user" },
  {
    $lookup: {
      from: "movies",
      localField: "_id.movie_id",
      foreignField: "movie_id",
      as: "movie"
    }
  },
  { $unwind: "$movie" },
  {
    $project: {
      _id: 0,
      user_name: "$user.name",
      movie_title: "$movie.title",
      watch_count: 1
    }
  }
])

10. Calculate percentage of each movie watched compared to its full duration
( watch_time/duration * 100 ).
db.watch_history.aggregate([
  {
    $lookup: {
      from: "movies",
      localField: "movie_id",
      foreignField: "movie_id",
      as: "movie"
    }
  },
  { $unwind: "$movie" },
  {
    $project: {
      _id: 0,
      movie_title: "$movie.title",
      user_id: 1,
      watch_time: 1,
      duration: "$movie.duration",
      percentage_watched: {
        $multiply: [
          { $divide: ["$watch_time", "$movie.duration"] },
          100
        ]
      }
    }
  }
])
