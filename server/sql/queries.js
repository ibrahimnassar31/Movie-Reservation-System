export const queries = {
  getUserByEmail: 'SELECT * FROM Users WHERE email = ?',
  createUser: 'INSERT INTO Users (email, password, name, role) VALUES (?, ?, ?, ?)',
  createMovie: 'INSERT INTO Movies (title, description, poster_url) VALUES (?, ?, ?)',
  getMovies: `
    SELECT 
      m.id, m.title, m.description, m.poster_url,
      GROUP_CONCAT(g.name) as genres
    FROM Movies m
    LEFT JOIN Movie_Genres mg ON m.id = mg.movie_id
    LEFT JOIN Genres g ON mg.genre_id = g.id
    GROUP BY m.id
  `,
  checkShowtime: 'SELECT * FROM Showtimes WHERE id = ?',
  checkSeat: 'SELECT * FROM Seats WHERE id = ? AND theater_id = ?',
  checkReservation: 'SELECT * FROM Reservations WHERE showtime_id = ? AND seat_id = ?',
  createReservation: 'INSERT INTO Reservations (user_id, showtime_id, seat_id) VALUES (?, ?, ?)',
  getUserReservations: `
    SELECT 
      r.id AS reservation_id,
      r.showtime_id,
      r.seat_id,
      s.seat_number,
      sh.showtime,
      sh.price,
      m.title AS movie_title,
      t.name AS theater_name
    FROM Reservations r
    JOIN Showtimes sh ON r.showtime_id = sh.id
    JOIN Seats s ON r.seat_id = s.id
    JOIN Movies m ON sh.movie_id = m.id
    JOIN Theaters t ON sh.theater_id = t.id
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
  `
};