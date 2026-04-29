const supabase = require('../config/supabaseClient');

// GET /api/coupons/:code — validate coupon
const validateCoupon = async (req, res, next) => {
  try {
    const { code } = req.params;
    const { orderTotal } = req.query;

    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .gt('valid_until', new Date().toISOString())
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Invalid or expired coupon' });
    }

    if (orderTotal && parseFloat(orderTotal) < data.min_order) {
      return res.status(400).json({
        error: `Minimum order of ₹${data.min_order} required for this coupon`,
      });
    }

    const discount = Math.min(
      (parseFloat(orderTotal || 0) * data.discount_percent) / 100,
      data.max_discount
    );

    res.json({ coupon: data, discount: Math.round(discount) });
  } catch (err) {
    next(err);
  }
};

module.exports = { validateCoupon };
