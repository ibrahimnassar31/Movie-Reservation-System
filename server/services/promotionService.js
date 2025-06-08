import pool from '../config/database.js';
import { queries } from '../sql/queries.js';

export const createPromotion = async (code, discount_percentage, valid_from, valid_until) => {
  try {
    // Validate inputs
    if (!code || typeof code !== 'string' || code.trim() === '') {
      throw new Error('Valid promotion code is required');
    }
    if (!Number.isFinite(discount_percentage) || discount_percentage < 0 || discount_percentage > 100) {
      throw new Error('Discount percentage must be between 0 and 100');
    }
    const validFromDate = new Date(valid_from);
    const validUntilDate = new Date(valid_until);
    if (isNaN(validFromDate.getTime()) || isNaN(validUntilDate.getTime())) {
      throw new Error('Invalid date format. Use YYYY-MM-DD');
    }
    if (validUntilDate < validFromDate) {
      throw new Error('Valid until date must be after valid from date');
    }

    // Check for duplicate code
    const [existing] = await pool.query(queries.checkPromotionByCode, [code.trim().toUpperCase()]);
    if (existing.length) {
      throw new Error('Promotion code already exists');
    }

    const [result] = await pool.query(queries.createPromotion, [
      code.trim().toUpperCase(),
      discount_percentage,
      valid_from,
      valid_until
    ]);
    return { id: result.insertId, code, discount_percentage, valid_from, valid_until };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getPromotions = async () => {
  try {
    const [rows] = await pool.query(queries.getPromotions);
    return rows.map(row => ({
      id: row.id,
      code: row.code,
      discount_percentage: parseFloat(row.discount_percentage),
      valid_from: row.valid_from,
      valid_until: row.valid_until,
      created_at: row.created_at,
      updated_at: row.updated_at
    }));
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updatePromotion = async (id, code, discount_percentage, valid_from, valid_until) => {
  try {
    // Check if promotion exists
    const [promotionRows] = await pool.query(queries.checkPromotion, [id]);
    if (!promotionRows.length) {
      throw new Error('Promotion not found');
    }

    // Validate inputs
    if (!code || typeof code !== 'string' || code.trim() === '') {
      throw new Error('Valid promotion code is required');
    }
    if (!Number.isFinite(discount_percentage) || discount_percentage < 0 || discount_percentage > 100) {
      throw new Error('Discount percentage must be between 0 and 100');
    }
    const validFromDate = new Date(valid_from);
    const validUntilDate = new Date(valid_until);
    if (isNaN(validFromDate.getTime()) || isNaN(validUntilDate.getTime())) {
      throw new Error('Invalid date format. Use YYYY-MM-DD');
    }
    if (validUntilDate < validFromDate) {
      throw new Error('Valid until date must be after valid from date');
    }

    // Check for duplicate code (excluding current promotion)
    const [existing] = await pool.query(queries.checkPromotionByCode, [code.trim().toUpperCase()]);
    if (existing.length && existing[0].id !== parseInt(id)) {
      throw new Error('Promotion code already exists');
    }

    await pool.query(queries.updatePromotion, [
      code.trim().toUpperCase(),
      discount_percentage,
      valid_from,
      valid_until,
      id
    ]);
    return { id, code, discount_percentage, valid_from, valid_until };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deletePromotion = async (id) => {
  try {
    const [promotionRows] = await pool.query(queries.checkPromotion, [id]);
    if (!promotionRows.length) {
      throw new Error('Promotion not found');
    }

    await pool.query(queries.deletePromotion, [id]);
    return { id };
  } catch (error) {
    throw new Error(error.message);
  }
};