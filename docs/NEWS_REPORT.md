# News & Report Page

## Overview

The News & Report page (`/news-report`) displays comprehensive news and reports from the N8N Indonesia community. This page helps users stay updated with the latest developments, community news, and technical reports.

## Features

### 1. Hero Section
- **Title**: "News & Report" with gradient styling
- **Description**: Explains the purpose of the page and encourages community engagement
- **Stats Panel**: Shows count of total news and featured news

### 2. Featured News Section
- **Conditional Display**: Only shows if there are featured news items
- **Featured Badge**: Purple gradient badge for featured content
- **Grid Layout**: Responsive 3-column grid (desktop), 2-column (tablet), 1-column (mobile)

### 3. Latest News Section
- **All News Display**: Shows all published news items
- **Status Badges**: Published/Draft/Archived status indicators
- **Responsive Grid**: Same responsive layout as featured section

### 4. News Cards
Each card displays:
- News image with fallback to placeholder
- Featured badge (if applicable)
- Status badge (Published/Draft/Archived)
- News title (truncated to 2 lines)
- Excerpt (truncated to 3 lines)
- Published date and time
- News type indicator
- "Baca Berita" (Read News) button

## Data Source

The page uses the `news` table from the database with the following structure:

```sql
CREATE TABLE news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  published_date TIMESTAMP WITH TIME ZONE NOT NULL,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id)
);
```

## Components Used

### 1. useNews Hook
- Fetches news from `/api/news` endpoint
- Filters by status (only published news)
- Orders by published_date (newest first)
- Provides loading and error states

### 2. News Card Component
- Displays news information in a consistent format
- Handles missing images with placeholder
- Shows news status and featured badges
- Includes hover effects and call-to-action buttons

## Styling

### Color Scheme
- **Background**: Consistent with other pages using gradient circles
- **Text**: White text on dark background
- **Cards**: White background with purple accents
- **Buttons**: Purple gradient with hover effects

### Responsive Design
- **Mobile**: Single column layout, optimized spacing
- **Tablet**: Two column layout
- **Desktop**: Three column layout with hover effects

## Navigation Integration

The page is accessible through:
1. **Footer**: Added link in the "Explore" section
2. **Direct URL**: `/news-report`
3. **Not in Header**: As requested, not displayed in main navigation

## Content Organization

### Featured News
- **Priority Display**: Featured news shown first
- **Visual Distinction**: Purple gradient badge
- **Limited Display**: Only shows if featured news exist

### Latest News
- **Chronological Order**: Newest news first
- **Status Indicators**: Clear status badges
- **Complete List**: All published news items

## Date and Time Formatting

### Indonesian Localization
- **Date Format**: "15 Januari 2025" (Indonesian locale)
- **Time Format**: "14:30" (24-hour format)
- **Locale**: Uses `id-ID` for proper Indonesian formatting

## Future Enhancements

### Planned Features
1. **News Categories**: Filter news by category (Technical, Community, Events, etc.)
2. **Search Functionality**: Search through news titles and content
3. **News Detail Pages**: Individual news article pages
4. **Newsletter Integration**: Email subscription for news updates
5. **Social Sharing**: Share news on social media platforms
6. **Comment System**: Community comments on news articles

### Technical Improvements
1. **Pagination**: Load more news functionality
2. **Caching**: Implement caching for better performance
3. **SEO Optimization**: Meta tags and structured data
4. **Analytics**: Track news view and engagement metrics

## API Endpoints

### GET /api/news
- Returns published news
- Supports filtering by featured status
- Supports limiting results
- Orders by published_date (descending)

### Admin Endpoints
- `GET /api/admin/content/news` - Admin access to all news
- `POST /api/admin/content/news` - Create new news
- `PUT /api/admin/content/news/[id]` - Update news
- `DELETE /api/admin/content/news/[id]` - Delete news

## Testing

### Manual Testing Checklist
- [ ] Page loads correctly on all devices
- [ ] Featured news displays correctly
- [ ] Latest news shows in correct order (newest first)
- [ ] Only published news are shown
- [ ] Featured badges display correctly
- [ ] Status badges show correct colors
- [ ] Hover effects work properly
- [ ] Navigation links function correctly
- [ ] Loading states display properly
- [ ] Error states handle gracefully

### Automated Testing
- Unit tests for useNews hook
- Component tests for news cards
- Integration tests for API endpoints
- E2E tests for user journey

## Accessibility

### WCAG Compliance
- **Color Contrast**: Meets AA standards
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Focus Management**: Clear focus indicators

### Mobile Accessibility
- Touch-friendly button sizes
- Adequate spacing for touch targets
- Responsive text sizing
- Optimized for mobile screen readers

## Performance

### Optimization Strategies
1. **Image Optimization**: Lazy loading for news images
2. **Code Splitting**: Separate bundle for news page
3. **Caching**: Browser and CDN caching for static assets
4. **Database Indexing**: Proper indexes on published_date and status

### Monitoring
- Page load time metrics
- API response time tracking
- Error rate monitoring
- User engagement analytics

## Security

### Data Protection
- Input validation for news data
- SQL injection prevention
- XSS protection for user-generated content
- Rate limiting for API endpoints

### Access Control
- Admin-only access for news management
- Public read access for published news
- Proper authentication for protected endpoints

## Deployment

### Environment Variables
```bash
# Required for news functionality
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Database Migration
Ensure the news table is created with proper indexes:
```sql
CREATE INDEX idx_news_published_date ON news(published_date);
CREATE INDEX idx_news_status ON news(status);
CREATE INDEX idx_news_featured ON news(is_featured);
```

## Troubleshooting

### Common Issues
1. **News not loading**: Check API endpoint and database connection
2. **Wrong news order**: Verify date sorting logic
3. **Missing images**: Check image URL validity and fallback handling
4. **Performance issues**: Monitor database query performance

### Debug Steps
1. Check browser console for errors
2. Verify API response format
3. Test database queries directly
4. Check network tab for failed requests
5. Validate environment variables

## Contributing

### Development Guidelines
1. Follow existing code patterns and styling
2. Add proper TypeScript types
3. Include error handling
4. Write unit tests for new functionality
5. Update documentation for changes

### Code Review Checklist
- [ ] Code follows project conventions
- [ ] Proper error handling implemented
- [ ] Responsive design considerations
- [ ] Accessibility requirements met
- [ ] Performance impact assessed
- [ ] Security considerations addressed

## Content Guidelines

### News Writing Standards
1. **Clear Headlines**: Descriptive and engaging titles
2. **Concise Excerpts**: 2-3 sentence summaries
3. **Quality Images**: High-resolution, relevant images
4. **Proper Formatting**: Consistent text formatting
5. **SEO Optimization**: Keywords and meta descriptions

### Content Categories
- **Technical News**: N8N updates, features, tutorials
- **Community News**: Events, meetups, member spotlights
- **Industry News**: Automation trends, technology updates
- **Case Studies**: Real-world implementation examples 