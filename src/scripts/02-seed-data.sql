-- Insert sample admin user (replace with actual admin email)
-- Note: This assumes the admin user has already signed up through Supabase Auth
-- INSERT INTO public.admin_users (user_id) 
-- SELECT id FROM auth.users WHERE email = 'admin@example.com';

-- Insert sample profiles for testing
INSERT INTO public.profiles (
  user_id, name, bio, location, skills, experience_level, 
  hourly_rate, availability, status
) VALUES 
(
  gen_random_uuid(), -- This would be a real user_id in production
  'Sarah Johnson',
  'Automation specialist with 5+ years of experience in n8n, Zapier, and custom workflow development. I help businesses streamline their operations through intelligent automation.',
  'San Francisco, CA',
  ARRAY['n8n', 'Zapier', 'API Integration', 'Data Processing', 'CRM Automation'],
  'expert',
  85,
  'available',
  'approved'
),
(
  gen_random_uuid(),
  'Mike Chen',
  'Full-stack developer turned automation expert. Specializing in complex n8n workflows and custom node development.',
  'Remote',
  ARRAY['n8n', 'JavaScript', 'Node.js', 'Custom Nodes', 'Webhook Integration'],
  'advanced',
  75,
  'busy',
  'approved'
),
(
  gen_random_uuid(),
  'Emma Rodriguez',
  'Marketing automation consultant helping small businesses automate their customer journey and lead nurturing processes.',
  'Austin, TX',
  ARRAY['n8n', 'Marketing Automation', 'Email Workflows', 'Lead Generation', 'CRM'],
  'intermediate',
  60,
  'available',
  'approved'
);

-- Insert sample workflows
INSERT INTO public.workflows (
  profile_id, title, description, tags, complexity, status
) VALUES 
(
  (SELECT id FROM public.profiles WHERE name = 'Sarah Johnson' LIMIT 1),
  'E-commerce Order Processing Automation',
  'Complete automation workflow that processes new orders, updates inventory, sends confirmation emails, and creates shipping labels. Integrates with Shopify, Gmail, and shipping providers.',
  ARRAY['e-commerce', 'shopify', 'email', 'shipping'],
  'complex',
  'approved'
),
(
  (SELECT id FROM public.profiles WHERE name = 'Sarah Johnson' LIMIT 1),
  'Social Media Content Scheduler',
  'Automated content distribution across multiple social media platforms with custom scheduling and engagement tracking.',
  ARRAY['social-media', 'scheduling', 'content-management'],
  'medium',
  'approved'
),
(
  (SELECT id FROM public.profiles WHERE name = 'Mike Chen' LIMIT 1),
  'Custom API Data Sync',
  'Real-time data synchronization between multiple APIs with error handling, retry logic, and data transformation.',
  ARRAY['api-integration', 'data-sync', 'real-time'],
  'complex',
  'approved'
),
(
  (SELECT id FROM public.profiles WHERE name = 'Emma Rodriguez' LIMIT 1),
  'Lead Nurturing Campaign',
  'Automated email sequence based on user behavior and engagement, with dynamic content personalization.',
  ARRAY['email-marketing', 'lead-nurturing', 'personalization'],
  'medium',
  'approved'
);
