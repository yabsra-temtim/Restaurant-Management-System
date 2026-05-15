import pool from '../db.js';

export const logAudit = async (restaurantId, userId, action, entityType, entityId, details, ipAddress) => {
  try {
    await pool.query(
      'INSERT INTO audit_logs (restaurant_id, user_id, action, entity_type, entity_id, details, ip_address) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [restaurantId, userId, action, entityType, entityId, details ? JSON.stringify(details) : null, ipAddress || null]
    );
  } catch (err) {
    console.error('Audit log failed:', err);
    // We don't throw here to avoid breaking the main operation
  }
};
