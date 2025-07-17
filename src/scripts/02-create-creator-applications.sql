-- Create creator_applications table
CREATE TABLE public.creator_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  tanggal_pengajuan TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tanggal_approval TIMESTAMP WITH TIME ZONE,
  alasan_penolakan TEXT,
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.creator_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for creator_applications
CREATE POLICY "Users can view own creator application" ON public.creator_applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own creator application" ON public.creator_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all creator applications" ON public.creator_applications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid()
    )
  );

-- Insert sample data for testing (optional)
-- INSERT INTO public.creator_applications (user_id, status, tanggal_pengajuan, tanggal_approval)
-- VALUES 
--   ('afbd6eda-6724-4ab8-b744-fbc9c3c72ead', 'approved', '2025-07-11 05:17:15.952+00', '2025-07-11 08:17:29.676+00'); 