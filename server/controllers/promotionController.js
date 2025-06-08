import { createPromotion, getPromotions, updatePromotion, deletePromotion } from '../services/promotionService.js';
import logger from '../utils/logger.js';

export const createPromotionController = async (req, res, next) => {
  try {
    const { code, discount_percentage, valid_from, valid_until } = req.body;

    if (!code || !discount_percentage || !valid_from || !valid_until) {
      throw Object.assign(new Error('All fields are required'), { statusCode: 400 });
    }

    const promotionData = await createPromotion(code, discount_percentage, valid_from, valid_until);
    
    logger.info('Promotion created successfully', {
      promotionId: promotionData.id,
      code,
      discount_percentage,
      userId: req.user.id
    });

    res.status(201).json({
      status: 'success',
      data: promotionData
    });
  } catch (error) {
    logger.error('Failed to create promotion', {
      error: error.message,
      code: req.body.code,
      userId: req.user ? req.user.id : null
    });
    next(error);
  }
};

export const getPromotionsController = async (req, res, next) => {
  try {
    const promotions = await getPromotions();
    
    logger.info('Promotions retrieved', {
      count: promotions.length
    });

    res.json({
      status: 'success',
      data: promotions
    });
  } catch (error) {
    logger.error('Failed to retrieve promotions', {
      error: error.message
    });
    next(error);
  }
};

export const updatePromotionController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { code, discount_percentage, valid_from, valid_until } = req.body;

    if (!id || isNaN(id)) {
      throw Object.assign(new Error('Valid promotion ID is required'), { statusCode: 400 });
    }
    if (!code || !discount_percentage || !valid_from || !valid_until) {
      throw Object.assign(new Error('All fields are required'), { statusCode: 400 });
    }

    const promotionData = await updatePromotion(parseInt(id), code, discount_percentage, valid_from, valid_until);
    
    logger.info('Promotion updated successfully', {
      promotionId: id,
      code,
      discount_percentage,
      userId: req.user.id
    });

    res.json({
      status: 'success',
      data: promotionData,
      message: 'Promotion updated successfully'
    });
  } catch (error) {
    logger.error('Failed to update promotion', {
      error: error.message,
      promotionId: req.params.id,
      code: req.body.code,
      userId: req.user ? req.user.id : null
    });
    next(error);
  }
};

export const deletePromotionController = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      throw Object.assign(new Error('Valid promotion ID is required'), { statusCode: 400 });
    }

    const result = await deletePromotion(parseInt(id));
    
    logger.info('Promotion deleted successfully', {
      promotionId: id,
      userId: req.user.id
    });

    res.json({
      status: 'success',
      data: result,
      message: 'Promotion deleted successfully'
    });
  } catch (error) {
    logger.error('Failed to delete promotion', {
      error: error.message,
      promotionId: req.params.id,
      userId: req.user ? req.user.id : null
    });
    next(error);
  }
};