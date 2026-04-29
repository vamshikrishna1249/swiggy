-- =============================================
-- Seed Data — 50 Restaurants, Menu Items, Coupons
-- Run AFTER schema.sql in Supabase SQL Editor
-- =============================================

-- Clear existing data (safe re-run)
truncate table menu_items, menu_categories, coupons, restaurants restart identity cascade;

-- ─── 50 RESTAURANTS ──────────────────────────────────────────────────────────
insert into restaurants (name, image_url, cuisine_types, rating, delivery_time_min, min_order, cost_for_two, is_pure_veg, discount, city, is_active) values
('Domino''s Pizza',          'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80', array['Pizza','Pasta','Desserts'],              4.2, 25, 149, 600,  false, '50% off up to ₹150',          'Bangalore', true),
('Behrouz Biryani',          'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&q=80', array['Biryani','Mughlai','North Indian'],       4.5, 40, 199, 700,  false, '₹125 off on first order',      'Bangalore', true),
('McDonald''s',              'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&q=80', array['Burger','Fast Food','Beverages'],         4.1, 20, 129, 400,  false, 'Buy 1 Get 1 Free',             'Bangalore', true),
('Saravana Bhavan',          'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&q=80', array['South Indian','Breakfast','Snacks'],      4.4, 30,  99, 300,  true,  null,                           'Chennai',   true),
('Punjab Grill',             'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80', array['North Indian','Punjabi','Dal Makhani'],   4.3, 35, 249, 800,  false, '20% off on orders above ₹500', 'Delhi',     true),
('Sushi Station',            'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&q=80', array['Sushi','Japanese','Asian'],                 4.6, 45, 399, 1200, false, null,                           'Mumbai',    true),
('Burger King',              'https://images.unsplash.com/photo-1550317138-10000687a72b?w=400&q=80', array['Burger','Fast Food','Shakes'],               4.0, 22, 149, 500,  false, '30% off',                      'Hyderabad', true),
('The Green Bowl',           'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80', array['Salads','Healthy','Wraps','Vegan'],       4.3, 30, 199, 500,  true,  null,                           'Pune',      true),
('Hyderabad House',          'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80', array['Biryani','Hyderabadi','Kebabs'],          4.7, 35, 199, 600,  false, 'Free Raita',                   'Hyderabad', true),
('Chai Point',               'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80', array['Beverages','Tea','Snacks','Breakfast'],     4.1, 20,  79, 200,  true,  '₹50 off',                      'Bangalore', true),
('KFC',                      'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&q=80', array['Fried Chicken','Fast Food','Burgers'],      4.0, 25, 149, 500,  false, '2 Pc Meal at ₹149',            'Mumbai',    true),
('Pizza Hut',                'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80', array['Pizza','Pasta','Garlic Bread'],           4.1, 30, 199, 650,  false, 'Free Pepsi with every order',  'Delhi',     true),
('Subway',                   'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400&q=80', array['Sandwiches','Healthy','Wraps'],           4.2, 20,  99, 350,  false, 'Buy 2 Subs Get 1 Free',        'Bangalore', true),
('Haldiram''s',              'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80', array['Sweets','Chaat','Snacks','North Indian'], 4.4, 25, 149, 400,  true,  null,                           'Delhi',     true),
('Box8',                     'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80', array['Desi Meals','North Indian','Rice'],       4.2, 35, 149, 450,  false, '₹75 off on first order',       'Mumbai',    true),
('Faasos',                   'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&q=80', array['Wraps','Rolls','North Indian'],           3.9, 30, 129, 400,  false, 'Flat 20% off',                 'Pune',      true),
('Barbeque Nation',          'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80', array['Barbeque','North Indian','Seafood'],        4.5, 60, 499,1200,  false, null,                           'Bangalore', true),
('Social',                   'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80', array['Continental','Bar Food','Fusion'],       4.3, 45, 299, 900,  false, 'Happy Hours 6-9 PM',           'Mumbai',    true),
('Pita Pit',                 'https://images.unsplash.com/photo-1485963631004-f2f00b1d6606?w=400&q=80', array['Mediterranean','Wraps','Healthy'],        4.1, 25, 149, 450,  false, null,                           'Bangalore', true),
('Moti Mahal',               'https://images.unsplash.com/photo-1631292784640-2b24be784d5d?w=400&q=80', array['North Indian','Mughlai','Tandoor'],       4.5, 40, 299, 900,  false, null,                           'Delhi',     true),
('Vaango',                   'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&q=80', array['South Indian','Tiffin','Beverages'],      4.0, 20,  99, 250,  true,  '10% off',                      'Chennai',   true),
('Wow! Momo',                'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&q=80', array['Momos','Chinese','Fast Food'],            4.2, 25, 119, 350,  false, 'Free Soup with order >₹199',   'Kolkata',   true),
('Biryani Blues',            'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&q=80', array['Biryani','Kebabs','Mughlai'],             4.3, 35, 199, 550,  false, '₹100 off',                     'Delhi',     true),
('Taco Bell',                'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80', array['Mexican','Tacos','Fast Food'],            3.8, 20, 129, 400,  false, 'Combo at ₹199',                'Bangalore', true),
('Chilis',                   'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&q=80', array['American','Burgers','Steaks'],              4.2, 40, 399, 1000, false, null,                           'Mumbai',    true),
('Theobroma',                'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80', array['Desserts','Cakes','Bakery'],              4.6, 30, 199, 500,  true,  null,                           'Mumbai',    true),
('Naturals Ice Cream',       'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80', array['Ice Cream','Desserts','Shakes'],            4.5, 15,  79, 200,  true,  null,                           'Mumbai',    true),
('Amul Parlour',             'https://images.unsplash.com/photo-1488900128323-21503983a07e?w=400&q=80', array['Ice Cream','Dairy','Beverages'],          4.0, 15,  49, 150,  true,  null,                           'Delhi',     true),
('Spice Villa',              'https://images.unsplash.com/photo-1631292784640-2b24be784d5d?w=400&q=80', array['South Indian','Kerala','Seafood'],        4.4, 35, 199, 600,  false, null,                           'Kochi',     true),
('The Bombay Canteen',       'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80', array['Indian','Continental','Fusion'],          4.6, 50, 399, 1100, false, null,                           'Mumbai',    true),
('Pind Balluchi',            'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80', array['Punjabi','North Indian','Tandoor'],       4.3, 40, 249, 750,  false, null,                           'Delhi',     true),
('Cafe Coffee Day',          'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=400&q=80', array['Beverages','Coffee','Snacks'],            3.8, 15,  79, 200,  true,  null,                           'Bangalore', true),
('Starbucks',                'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80', array['Coffee','Beverages','Snacks'],            4.3, 20, 199, 500,  true,  'Happy Hour 3-5 PM',            'Mumbai',    true),
('Nando''s',                 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&q=80', array['Peri Peri','Chicken','Portuguese'],         4.4, 30, 299, 700,  false, null,                           'Bangalore', true),
('Oh! Calcutta',             'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80', array['Bengali','Seafood','Sweets'],               4.5, 45, 299, 900,  false, null,                           'Kolkata',   true),
('Mainland China',           'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80', array['Chinese','Asian','Dim Sum'],                4.2, 45, 349, 900,  false, null,                           'Hyderabad', true),
('Zaffran',                  'https://images.unsplash.com/photo-1631292784640-2b24be784d5d?w=400&q=80', array['Mughlai','Kebabs','North Indian'],        4.4, 40, 299, 850,  false, null,                           'Mumbai',    true),
('Carnatic Cafe',            'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&q=80', array['South Indian','Filter Coffee','Snacks'],  4.3, 20,  99, 300,  true,  null,                           'Bangalore', true),
('Asia Kitchen',             'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80', array['Pan Asian','Sushi','Thai','Chinese'],       4.1, 40, 299, 800,  false, '15% off weekdays',             'Delhi',     true),
('Freshmenu',                'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80', array['Healthy','Salads','Continental'],         4.0, 30, 199, 500,  false, null,                           'Bangalore', true),
('Charcoal Eats',            'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80', array['Biryani','North Indian','Kebabs'],          4.2, 30, 149, 450,  false, null,                           'Mumbai',    true),
('Karavalli',                'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80', array['Kerala','Seafood','South Indian'],          4.7, 50, 499,1300,  false, null,                           'Bangalore', true),
('The Rolling Pin',          'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80', array['Bakery','Desserts','Cafe'],               4.5, 25, 199, 450,  true,  null,                           'Pune',      true),
('Daryaganj',                'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&q=80', array['Biryani','Butter Chicken','North Indian'],4.6, 35, 249, 700,  false, '₹100 off first',               'Delhi',     true),
('Yumlane',                  'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80', array['Pizza','Fast Food','Burgers'],            3.9, 25, 129, 400,  false, null,                           'Hyderabad', true),
('Indigo Deli',              'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80', array['Continental','Deli','Sandwiches'],        4.4, 35, 299, 800,  false, null,                           'Mumbai',    true),
('Malgudi Cafe',             'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=400&q=80', array['South Indian','Filter Coffee','Breakfast'],4.2, 20, 79,  250,  true,  null,                           'Bangalore', true),
('Copper Chimney',           'https://images.unsplash.com/photo-1631292784640-2b24be784d5d?w=400&q=80', array['Indian','Tandoor','Kebabs'],              4.4, 40, 299, 850,  false, null,                           'Mumbai',    true),
('Khichdi Experiment',       'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80', array['Comfort Food','Indian','Healthy'],        4.1, 25, 119, 350,  true,  null,                           'Mumbai',    true),
('Creamstone',               'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80', array['Ice Cream','Desserts','Shakes'],            4.3, 20,  79, 200,  true,  null,                           'Hyderabad', true);

-- ─── COUPONS ──────────────────────────────────
insert into coupons (code, discount_percent, max_discount, min_order, valid_until, is_active) values
('SAVE50',    50,  150, 299, now() + interval '1 year',   true),
('FIRST100', 100,  100, 199, now() + interval '1 year',   true),
('FLAT20',    20,  200, 399, now() + interval '1 year',   true),
('WELCOME30', 30,  120, 249, now() + interval '6 months', true),
('BIGORDER',  15,  500, 999, now() + interval '1 year',   true);
