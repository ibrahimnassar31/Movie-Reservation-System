import pool from '../config/database.js';
import { queries } from '../sql/queries.js';
import { createNotification } from './notificationService.js';
import sendEmail from '../utils/email.js';

export const createReservation = async (user_id, showtime_id, seat_id, promotion_code) => {
  try {
    if (!user_id || !showtime_id || !seat_id) {
      throw new Error('User ID, showtime ID, and seat ID are required');
    }

    const [showtimeRows] = await pool.query(queries.checkShowtime, [showtime_id]);
    if (!showtimeRows.length) {
      throw new Error('Showtime not found');
    }
    const showtime = showtimeRows[0];

    const [seatRows] = await pool.query(queries.checkSeat, [seat_id, showtime.theater_id]);
    if (!seatRows.length) {
      throw new Error('Seat not found or not available in this theater');
    }

    const [reservationRows] = await pool.query(queries.checkReservation, [showtime_id, seat_id]);
    if (reservationRows.length) {
      throw new Error('Seat is already reserved');
    }

    const [userRows] = await pool.query(queries.checkUser, [user_id]);
    if (!userRows.length) {
      throw new Error('User not found');
    }
    const userEmail = userRows[0].email;

    let final_price = showtime.price;
    let promotion_id = null;

    if (promotion_code) {
      const [promotionRows] = await pool.query(queries.checkPromotionByCode, [promotion_code.trim().toUpperCase()]);
      if (!promotionRows.length) {
        throw new Error('Invalid or expired promotion code');
      }
      const promotion = promotionRows[0];
      const discount = (promotion.discount_percentage / 100) * final_price;
      final_price = parseFloat((final_price - discount).toFixed(2));
      promotion_id = promotion.id;
    }

    const [result] = await pool.query(queries.createReservation, [user_id, showtime_id, seat_id, promotion_id, final_price]);

    const notificationMessage = `New reservation created for ${showtime.movie_title} at ${showtime.theater_name} on ${showtime.showtime}`;
    await createNotification(user_id, notificationMessage, 'reservation');

    const emailHtml = `
      <h1>Booking Confirmation</h1>
      <p>Dear User,</p>
      <p>Your reservation has been successfully booked!</p>
      <ul>
        <li><strong>Movie</strong>: ${showtime.movie_title}</li>
        <li><strong>Theater</strong>: ${showtime.theater_name}</li>
        <li><strong>Showtime</strong>: ${showtime.showtime}</li>
        <li><strong>Seat</strong>: ${seatRows[0].seat_number}</li>
        <li><strong>Final Price</strong>: $${final_price.toFixed(2)}</li>
        <li><strong>Promotion</strong>: ${promotion_code || 'None'}</li>
      </ul>
      <p>Enjoy your movie!</p>
      <p>Best regards,</p>
      <p>Movie Reservation Team</p>
    `;
    await sendEmail({
      to: userEmail,
      subject: 'Your Movie Booking Confirmation',
      html: emailHtml
    });

    return {
      id: result.insertId,
      user_id,
      showtime_id,
      seat_id,
      promotion_id,
      final_price,
      showtime: showtime.showtime,
      movie_title: showtime.movie_title,
      theater_name: showtime.theater_name
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getUserReservations = async (user_id) => {
  try {
    if (!user_id) {
      throw new Error('User ID is required');
    }

    const [rows] = await pool.query(queries.getUserReservations, [user_id]);
    return rows.map((row) => ({
      reservation_id: row.reservation_id,
      showtime_id: row.showtime_id,
      seat_id: row.seat_id,
      promotion_id: row.promotion_id,
      final_price: parseFloat(row.final_price),
      seat_number: row.seat_number,
      showtime: row.showtime,
      original_price: parseFloat(row.original_price),
      movie_title: row.movie_title,
      theater_name: row.theater_name,
      promotion_code: row.promotion_code
    }));
  } catch (error) {
    throw new Error(error.message);
  }
};

export const cancelReservation = async (reservation_id, user_id) => {
  try {
    if (!reservation_id || !user_id) {
      throw new Error('Reservation ID and user ID are required');
    }

    const [reservationRows] = await pool.query(queries.checkReservationById, [reservation_id, user_id]);
    if (!reservationRows.length) {
      throw new Error('Reservation not found or not authorized');
    }

    const reservation = reservationRows[0];
    const finalPrice = parseFloat(reservation.final_price);

    const [showtimeRows] = await pool.query(queries.checkShowtime, [reservation.showtime_id]);
    if (!showtimeRows.length) {
      throw new Error('Showtime not found');
    }
    const showtime = showtimeRows[0];

    const [seatRows] = await pool.query(queries.checkSeat, [reservation.seat_id, showtime.theater_id]);
    if (!seatRows.length) {
      throw new Error('Seat not found');
    }

    const [userRows] = await pool.query(queries.checkUser, [user_id]);
    if (!userRows.length) {
      throw new Error('User not found');
    }
    const userEmail = userRows[0].email;

    await pool.query(queries.deleteReservation, [reservation_id, user_id]);

    const emailHtml = `
      <h1>Reservation Cancellation</h1>
      <p>Dear User,</p>
      <p>Your reservation has been successfully cancelled.</p>
      <ul>
        <li><strong>Movie</strong>: ${showtime.movie_title}</li>
        <li><strong>Theater</strong>: ${showtime.theater_name}</li>
        <li><strong>Showtime</strong>: ${showtime.showtime}</li>
        <li><strong>Seat</strong>: ${seatRows[0].seat_number}</li>
        <li><strong>Final Price</strong>: $${finalPrice.toFixed(2)}</li>
      </ul>
      <p>We hope to see you again soon!</p>
      <p>Best regards,</p>
      <p>Movie Reservation Team</p>
    `;
    await sendEmail({
      to: userEmail,
      subject: 'Your Movie Reservation Cancellation',
      html: emailHtml
    });

    return { id: reservation_id };
  } catch (error) {
    throw new Error(error.message);
  }
};