export const queries = {
  getUserByEmail: 'SELECT * FROM Users WHERE email = ?',
  createUser: 'INSERT INTO Users (id, email, password, role) VALUES (?, ?, ?, ?)',
  createMovie: 'INSERT INTO Movies (title, description, poster_url) VALUES (?, ?, ?)',
  getMovies: `
    SELECT 
      m.id, m.title, m.description, m.poster_url,
      GROUP_CONCAT(g.name) as genres
    FROM Movies m
    LEFT JOIN Movie_Genres mg ON m.id = mg.movie_id
    LEFT JOIN Genres g ON mg.genre_id = g.id
    GROUP BY m.id, m.title, m.description, m.poster_url
  `,
  searchMovies: `
    SELECT 
      m.id, m.title, m.description, m.poster_url,
      GROUP_CONCAT(g.name) AS genres
    FROM Movies m
    LEFT JOIN Movie_Genres mg ON m.id = mg.movie_id
    LEFT JOIN Genres g ON g.id = mg.genre_id
    WHERE m.title LIKE ? OR m.description LIKE ?
    GROUP BY m.id, m.title, m.description, m.poster_url
    ORDER BY m.id DESC
  `,
  checkShowtime: `
    SELECT 
      sh.id, sh.movie_id, sh.theater_id, sh.showtime, sh.price,
      m.title AS movie_title,
      t.name AS theater_name
    FROM Showtimes sh
    JOIN Movies m ON sh.movie_id = m.id
    JOIN Theaters t ON sh.theater_id = t.id
    WHERE sh.id = ?
  `,
  checkSeat: 'SELECT * FROM Seats WHERE id = ? AND theater_id = ?',
  checkReservation: 'SELECT * FROM Reservations WHERE showtime_id = ? AND seat_id = ?',
  createReservation: 'INSERT INTO Reservations (user_id, showtime_id, seat_id, promotion_id, final_price) VALUES (?, ?, ?, ?, ?)',
  getUserReservations: `
    SELECT 
      r.id AS reservation_id,
      r.showtime_id,
      r.seat_id,
      r.promotion_id,
      r.final_price,
      s.seat_number,
      sh.showtime,
      sh.price AS original_price,
      m.title AS movie_title,
      t.name AS theater_name,
      p.code AS promotion_code
    FROM Reservations r
    JOIN Showtimes sh ON r.showtime_id = sh.id
    JOIN Seats s ON r.seat_id = s.id
    JOIN Movies m ON sh.movie_id = m.id
    JOIN Theaters t ON sh.theater_id = t.id
    LEFT JOIN Promotions p ON r.promotion_id = p.id
    WHERE r.user_id = ?
    ORDER BY sh.showtime DESC
  `,
  checkReservationById: 'SELECT * FROM Reservations WHERE id = ? AND user_id = ?',
  deleteReservation: 'DELETE FROM Reservations WHERE id = ? AND user_id = ?',
  checkMovie: 'SELECT * FROM Movies WHERE id = ?',
  updateMovie: 'UPDATE Movies SET title = ?, description = ?, poster_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
  deleteMovie: 'DELETE FROM Movies WHERE id = ?',
  checkMovieShowtimes: 'SELECT * FROM Showtimes WHERE movie_id = ?',
  getAvailableSeats: `
    SELECT 
      s.id AS seat_id,
      s.seat_number
    FROM Seats s
    JOIN Showtimes sh ON s.theater_id = sh.theater_id
    WHERE sh.id = ?
    AND s.id NOT IN (
      SELECT seat_id 
      FROM Reservations 
      WHERE showtime_id = ?
    )
    ORDER BY s.seat_number
  `,
  createGenre: 'INSERT INTO Genres (name) VALUES (?)',
  getGenres: 'SELECT id, name FROM Genres ORDER BY name',
  checkGenre: 'SELECT * FROM Genres WHERE id = ?',
  updateGenre: 'UPDATE Genres SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
  deleteGenre: 'DELETE FROM Genres WHERE id = ?',
  checkGenreMovies: 'SELECT * FROM Movie_Genres WHERE genre_id = ?',
  createShowtime: 'INSERT INTO Showtimes (movie_id, theater_id, showtime, price) VALUES (?, ?, ?, ?)',
  getShowtimes: `
    SELECT 
      sh.id,
      sh.movie_id,
      sh.theater_id,
      sh.showtime,
      sh.price,
      m.title AS movie_title,
      t.name AS theater_name
    FROM Showtimes sh
    JOIN Movies m ON sh.movie_id = m.id
    JOIN Theaters t ON sh.theater_id = t.id
    ORDER BY sh.showtime
  `,
  updateShowtime: 'UPDATE Showtimes SET movie_id = ?, theater_id = ?, showtime = ?, price = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
  deleteShowtime: 'DELETE FROM Showtimes WHERE id = ?',
  checkTheater: 'SELECT * FROM Theaters WHERE id = ?',
  checkShowtimeReservations: 'SELECT * FROM Reservations WHERE showtime_id = ?',
  addMovieGenre: 'INSERT INTO Movie_Genres (movie_id, genre_id) VALUES (?, ?)',
  getMovieGenres: `
    SELECT g.id, g.name
    FROM Genres g
    JOIN Movie_Genres mg ON g.id = mg.genre_id
    WHERE mg.movie_id = ?
  `,
  deleteMovieGenre: 'DELETE FROM Movie_Genres WHERE movie_id = ? AND genre_id = ?',
  checkMovieGenre: 'SELECT * FROM Movie_Genres WHERE movie_id = ? AND genre_id = ?',
  createTheater: 'INSERT INTO Theaters (name, location) VALUES (?, ?)',
  getTheaters: 'SELECT id, name, location FROM Theaters ORDER BY name',
  updateTheater: 'UPDATE Theaters SET name = ?, location = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
  deleteTheater: 'DELETE FROM Theaters WHERE id = ?',
  checkTheaterShowtimes: 'SELECT * FROM Showtimes WHERE theater_id = ?',
  checkTheaterSeats: 'SELECT * FROM Seats WHERE theater_id = ?',
  createSeat: 'INSERT INTO Seats (theater_id, seat_number) VALUES (?, ?)',
  getSeatsByTheater: 'SELECT id, theater_id, seat_number FROM Seats WHERE theater_id = ? ORDER BY seat_number',
  updateSeat: 'UPDATE Seats SET seat_number = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
  deleteSeat: 'DELETE FROM Seats WHERE id = ?',
  checkSeatById: 'SELECT * FROM Seats WHERE id = ?',
  checkSeatReservations: 'SELECT * FROM Reservations WHERE seat_id = ?',
  createReview: 'INSERT INTO Reviews (user_id, movie_id, rating, comment) VALUES (?, ?, ?, ?)',
  getReviewsByMovie: `
    SELECT 
      r.id, r.user_id, r.movie_id, r.rating, r.comment, 
      u.name AS user_name,
      r.created_at, r.updated_at
    FROM Reviews r
    JOIN Users u ON r.user_id = u.id
    WHERE r.movie_id = ?
    ORDER BY r.created_at DESC
  `,
  checkReview: 'SELECT * FROM Reviews WHERE id = ?',
  updateReview: 'UPDATE Reviews SET rating = ?, comment = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
  deleteReview: 'DELETE FROM Reviews WHERE id = ?',
  checkUserReview: 'SELECT * FROM Reviews WHERE user_id = ? AND movie_id = ?',
  createPromotion: 'INSERT INTO Promotions (code, discount_percentage, valid_from, valid_until) VALUES (?, ?, ?, ?)',
  getPromotions: 'SELECT id, code, discount_percentage, valid_from, valid_until, created_at, updated_at FROM Promotions ORDER BY valid_from DESC',
  checkPromotion: 'SELECT * FROM Promotions WHERE id = ?',
  checkPromotionByCode: `
    SELECT * FROM Promotions 
    WHERE code = ? 
    AND valid_from <= CURDATE() 
    AND valid_until >= CURDATE()
  `,
  updatePromotion: 'UPDATE Promotions SET code = ?, discount_percentage = ?, valid_from = ?, valid_until = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
  deletePromotion: 'DELETE FROM Promotions WHERE id = ?',
  checkUser: 'SELECT * FROM Users WHERE id = ?',
  createNotification: 'INSERT INTO Notifications (user_id, message, type, is_read) VALUES (?, ?, ?, ?)',
  getUserNotifications: `
    SELECT id, user_id, message, type, is_read, created_at, updated_at
    FROM Notifications
    WHERE user_id = ?
    ORDER BY created_at DESC
  `,
  checkNotification: 'SELECT * FROM Notifications WHERE id = ? AND user_id = ?',
  updateNotificationRead: 'UPDATE Notifications SET is_read = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
  getReservationStats: `
    SELECT 
      COUNT(r.id) AS total_reservations,
      COALESCE(SUM(r.final_price), 0) AS total_revenue,
      m.id AS movie_id,
      m.title AS movie_title,
      COUNT(r.id) AS reservation_count
    FROM Reservations r
    JOIN Showtimes sh ON r.showtime_id = sh.id
    JOIN Movies m ON sh.movie_id = m.id
    WHERE (? IS NULL OR sh.showtime >= ?)
      AND (? IS NULL OR sh.showtime <= ?)
    GROUP BY m.id, m.title
    ORDER BY reservation_count DESC
  `,
  searchMovies: `
  SELECT 
    m.id, m.title, m.description, m.poster_url,
    GROUP_CONCAT(g.name) AS genres
  FROM Movies m
  LEFT JOIN Movie_Genres mg ON m.id = mg.movie_id
  LEFT JOIN Genres g ON g.id = mg.genre_id
  WHERE (? IS NULL OR m.title LIKE ? OR m.description LIKE ?)
    AND (? IS NULL OR g.name = ?)
  GROUP BY m.id, m.title, m.description, m.poster_url
  ORDER BY m.id DESC
`,
  
};