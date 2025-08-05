-- Enable RLS
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  bio TEXT,
  about_markdown TEXT, -- Markdown content for detailed about section
  location TEXT,
  website TEXT,
  linkedin TEXT,
  twitter TEXT,
  github TEXT,
  skills TEXT[], -- Array of skill tags
  experience_level TEXT CHECK (experience_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  hourly_rate INTEGER, -- Optional hourly rate
  availability TEXT CHECK (availability IN ('available', 'busy', 'unavailable')),
  profile_image TEXT, -- URL to profile image
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'rejected')),
  admin_notes TEXT, -- Admin notes for rejection reasons
  instagram TEXT,
  threads TEXT,
  discord TEXT,
  youtube TEXT,
  Whatsapp TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create workflows table
CREATE TABLE public.workflows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tags TEXT[], -- Array of workflow tags
  screenshot_url TEXT, -- URL to workflow screenshot
  video_url TEXT, -- Optional video demo URL
  complexity TEXT CHECK (complexity IN ('simple', 'medium', 'complex')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_users table
CREATE TABLE public.admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for profiles
CREATE POLICY "Anyone can view approved profiles" ON public.profiles
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for workflows
CREATE POLICY "Anyone can view approved workflows" ON public.workflows
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Users can view own workflows" ON public.workflows
  FOR SELECT USING (auth.uid() = (
    SELECT user_id FROM public.profiles WHERE id = profile_id
  ));

CREATE POLICY "Users can insert own workflows" ON public.workflows
  FOR INSERT WITH CHECK (auth.uid() = (
    SELECT user_id FROM public.profiles WHERE id = profile_id
  ));

CREATE POLICY "Users can update own workflows" ON public.workflows
  FOR UPDATE USING (auth.uid() = (
    SELECT user_id FROM public.profiles WHERE id = profile_id
  ));

CREATE POLICY "Admins can view all workflows" ON public.workflows
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for admin_users
CREATE POLICY "Admins can view admin users" ON public.admin_users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid()
    )
  );

-- Add new columns to events table for registration and contact information
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS pendaftaran_link TEXT,
ADD COLUMN IF NOT EXISTS nomor_penyelenggara TEXT,
ADD COLUMN IF NOT EXISTS instagram_penyelenggara TEXT;

-- Add comments for documentation
COMMENT ON COLUMN public.events.pendaftaran_link IS 'Link Google Form untuk pendaftaran event';
COMMENT ON COLUMN public.events.nomor_penyelenggara IS 'Nomor WhatsApp penyelenggara event (format: 6281234567890)';
COMMENT ON COLUMN public.events.instagram_penyelenggara IS 'Username Instagram penyelenggara event (format: @username atau username)';

-- Add Whatsapp column if it doesn't exist (for existing databases)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'Whatsapp') THEN
        ALTER TABLE public.profiles ADD COLUMN "Whatsapp" TEXT;
    END IF;
END $$;
