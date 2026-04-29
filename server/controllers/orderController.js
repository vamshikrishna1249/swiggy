const supabase = require('../config/supabaseClient');

// POST /api/orders — place a new order
const placeOrder = async (req, res, next) => {
  try {
    const { restaurant_id, address_id, items, subtotal, delivery_fee, tax, total, coupon_code } = req.body;
    const user_id = req.user.id;

    const { data, error } = await supabase
      .from('orders')
      .insert([{
        user_id,
        restaurant_id,
        address_id,
        items,
        subtotal,
        delivery_fee,
        tax,
        total,
        coupon_code: coupon_code || null,
        status: 'placed',
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

// GET /api/orders/user — user order history
const getUserOrders = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const { data, error } = await supabase
      .from('orders')
      .select('*, restaurants(name, image_url)')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// GET /api/orders/:id — single order
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('orders')
      .select('*, restaurants(name, image_url, city)')
      .eq('id', id)
      .single();

    if (error || !data) return res.status(404).json({ error: 'Order not found' });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// PUT /api/orders/:id/status — admin update order status
const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['placed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// GET /api/orders — admin get all orders
const getAllOrders = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, restaurants(name), profiles(name, email)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/stats — dashboard metrics
const getAdminStats = async (req, res, next) => {
  try {
    const { count: totalOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });

    const { data: revenueData } = await supabase
      .from('orders')
      .select('total')
      .eq('status', 'delivered');

    const totalRevenue = revenueData?.reduce((sum, o) => sum + o.total, 0) || 0;

    const { count: activeRestaurants } = await supabase
      .from('restaurants')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    res.json({ totalOrders, totalRevenue, activeRestaurants, totalUsers });
  } catch (err) {
    next(err);
  }
};

module.exports = { placeOrder, getUserOrders, getOrderById, updateOrderStatus, getAllOrders, getAdminStats };
