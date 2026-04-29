const supabase = require('../config/supabaseClient');

// GET /api/restaurants — list with filters & pagination
const getRestaurants = async (req, res, next) => {
  try {
    const {
      city,
      cuisine,
      veg,
      minRating,
      minPrice,
      maxPrice,
      sortBy,
      page = 1,
      limit = 12,
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = supabase
      .from('restaurants')
      .select('*', { count: 'exact' })
      .eq('is_active', true);

    if (city) query = query.ilike('city', `%${city}%`);
    if (veg === 'true') query = query.eq('is_pure_veg', true);
    if (minRating) query = query.gte('rating', parseFloat(minRating));
    if (minPrice) query = query.gte('min_order', parseInt(minPrice));
    if (maxPrice) query = query.lte('cost_for_two', parseInt(maxPrice));
    if (cuisine) query = query.contains('cuisine_types', [cuisine]);

    if (sortBy === 'rating') query = query.order('rating', { ascending: false });
    else if (sortBy === 'delivery_time') query = query.order('delivery_time_min', { ascending: true });
    else if (sortBy === 'cost_asc') query = query.order('cost_for_two', { ascending: true });
    else if (sortBy === 'cost_desc') query = query.order('cost_for_two', { ascending: false });
    else query = query.order('rating', { ascending: false });

    query = query.range(offset, offset + parseInt(limit) - 1);

    const { data, error, count } = await query;
    if (error) throw error;

    res.json({
      restaurants: data,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / parseInt(limit)),
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/restaurants/:id — single restaurant
const getRestaurantById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return res.status(404).json({ error: 'Restaurant not found' });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// GET /api/restaurants/:id/menu — grouped by category
const getRestaurantMenu = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data: categories, error: catError } = await supabase
      .from('menu_categories')
      .select('id, name, display_order')
      .eq('restaurant_id', id)
      .order('display_order', { ascending: true });

    if (catError) throw catError;

    const { data: items, error: itemError } = await supabase
      .from('menu_items')
      .select('*')
      .eq('restaurant_id', id)
      .eq('is_available', true);

    if (itemError) throw itemError;

    const menu = categories.map((cat) => ({
      ...cat,
      items: items.filter((item) => item.category_id === cat.id),
    }));

    res.json(menu);
  } catch (err) {
    next(err);
  }
};

// Admin: POST /api/restaurants
const createRestaurant = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .insert([req.body])
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

// Admin: PUT /api/restaurants/:id
const updateRestaurant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('restaurants')
      .update(req.body)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// Admin: DELETE /api/restaurants/:id
const deleteRestaurant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('restaurants').delete().eq('id', id);
    if (error) throw error;
    res.json({ message: 'Restaurant deleted' });
  } catch (err) {
    next(err);
  }
};

// Admin: GET all restaurants
const getAllRestaurantsAdmin = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// Admin: Menu Items
const getMenuItems = async (req, res, next) => {
  try {
    const { restaurantId } = req.query;
    let query = supabase.from('menu_items').select('*, menu_categories(name)');
    if (restaurantId) query = query.eq('restaurant_id', restaurantId);
    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const createMenuItem = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .insert([req.body])
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

const updateMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('menu_items')
      .update(req.body)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const deleteMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('menu_items').delete().eq('id', id);
    if (error) throw error;
    res.json({ message: 'Menu item deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getRestaurants,
  getRestaurantById,
  getRestaurantMenu,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getAllRestaurantsAdmin,
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
};
