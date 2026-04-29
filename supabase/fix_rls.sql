-- =============================================
-- FIX: Profiles RLS policies (removes recursive admin check)
-- FIX: Ensure profile exists for all auth users
-- Run this in Supabase SQL Editor
-- =============================================

-- 1. Drop the problematic recursive policies
drop policy if exists "Users can view own profile" on profiles;
drop policy if exists "Users can update own profile" on profiles;
drop policy if exists "Admins can view all profiles" on profiles;

-- 2. Create clean, non-recursive policies
-- Allow users to always read their own profile
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

-- Allow users to update their own profile  
create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Allow insert (needed for signup trigger + upsert)
create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- Allow service role full access (for backend API)
create policy "Service role full access"
  on profiles for all
  using (auth.role() = 'service_role');

-- 3. Ensure profiles exist for ALL existing auth users
-- (handles case where trigger wasn't set up before signup)
insert into profiles (id, name, email, role)
select 
  au.id,
  coalesce(au.raw_user_meta_data->>'name', split_part(au.email, '@', 1)),
  au.email,
  'user'
from auth.users au
left join profiles p on p.id = au.id
where p.id is null
on conflict (id) do nothing;

-- 4. Make your account admin (update with your email)
update profiles set role = 'admin' where email = 'vamshi@gmail.com';

-- 5. Verify
select id, name, email, role from profiles;
