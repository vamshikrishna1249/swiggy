-- =============================================
-- SwiggyClone Database Schema — Supabase / PostgreSQL
-- Run this in Supabase SQL Editor
-- =============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── PROFILES ─────────────────────────────────
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text unique not null,
  phone text,
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

create policy "Admins can view all profiles"
  on profiles for select using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- ─── ADDRESSES ────────────────────────────────
create table if not exists addresses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  label text not null default 'Home',
  street text not null,
  city text not null,
  pincode text not null,
  is_default boolean default false,
  created_at timestamptz default now()
);

alter table addresses enable row level security;

create policy "Users manage own addresses"
  on addresses for all using (auth.uid() = user_id);

-- ─── RESTAURANTS ──────────────────────────────
create table if not exists restaurants (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  image_url text,
  banner_url text,
  cuisine_types text[] default array[]::text[],
  rating numeric(3,1) default 4.0 check (rating >= 0 and rating <= 5),
  delivery_time_min integer default 30,
  min_order integer default 100,
  cost_for_two integer default 400,
  is_pure_veg boolean default false,
  discount text,
  city text not null default 'Bangalore',
  lat numeric(9,6),
  lng numeric(9,6),
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table restaurants enable row level security;

create policy "Anyone can view active restaurants"
  on restaurants for select using (is_active = true);

create policy "Admins can manage restaurants"
  on restaurants for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- ─── MENU CATEGORIES ───────────────────────────
create table if not exists menu_categories (
  id uuid primary key default uuid_generate_v4(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  name text not null,
  display_order integer default 0,
  created_at timestamptz default now()
);

alter table menu_categories enable row level security;

create policy "Anyone can view menu categories"
  on menu_categories for select using (true);

create policy "Admins can manage menu categories"
  on menu_categories for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- ─── MENU ITEMS ───────────────────────────────
create table if not exists menu_items (
  id uuid primary key default uuid_generate_v4(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  category_id uuid references menu_categories(id) on delete set null,
  name text not null,
  description text,
  price numeric(10,2) not null,
  image_url text,
  is_veg boolean default true,
  is_available boolean default true,
  created_at timestamptz default now()
);

alter table menu_items enable row level security;

create policy "Anyone can view available menu items"
  on menu_items for select using (is_available = true);

create policy "Admins can manage menu items"
  on menu_items for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- ─── ORDERS ───────────────────────────────────
create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  restaurant_id uuid not null references restaurants(id),
  address_id uuid references addresses(id),
  items jsonb not null default '[]',
  subtotal numeric(10,2) not null default 0,
  delivery_fee numeric(10,2) not null default 0,
  tax numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  coupon_code text,
  status text not null default 'placed'
    check (status in ('placed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled')),
  created_at timestamptz default now()
);

alter table orders enable row level security;

create policy "Users can view own orders"
  on orders for select using (auth.uid() = user_id);

create policy "Users can create orders"
  on orders for insert with check (auth.uid() = user_id);

create policy "Admins can view and manage all orders"
  on orders for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- ─── COUPONS ───────────────────────────────────
create table if not exists coupons (
  id uuid primary key default uuid_generate_v4(),
  code text unique not null,
  discount_percent numeric(5,2) not null,
  max_discount numeric(10,2) not null default 200,
  min_order numeric(10,2) not null default 0,
  valid_until timestamptz not null,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table coupons enable row level security;

create policy "Anyone can view active coupons"
  on coupons for select using (is_active = true and valid_until > now());

create policy "Admins can manage coupons"
  on coupons for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- ─── TRIGGER: auto-create profile on signup ───
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    'user'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
