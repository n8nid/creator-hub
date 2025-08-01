# Upcoming Events Page

## Overview

The Upcoming Events page (`/upcoming-events`) displays a comprehensive list of upcoming N8N community events. This page helps users discover and register for community meetups, workshops, and networking events.

## Features

### 1. Hero Section
- **Title**: "Upcoming Events" with gradient styling
- **Description**: Explains the purpose of the page and encourages community participation
- **Stats Panel**: Shows count of upcoming events and featured events

### 2. Events Grid
- **Responsive Layout**: 1 column on mobile, 2 on tablet, 3 on desktop
- **Event Cards**: Each card displays:
  - Event image
  - Featured badge (if applicable)
  - Status badge (Published/Draft/Cancelled/Archived)
  - Event title
  - Description (truncated to 3 lines)
  - Date and time
  - Location
  - Event type indicator
  - Registration button

### 3. Call-to-Action Section
- Encourages users to propose new events
- Provides contact information for event collaboration

## Data Source

The page uses the `events` table from the database with the following structure:

```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  status TEXT CHECK (status IN ('draft', 'published', 'archived', 'cancelled')) DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id)
);
```

## Components Used

### 1. useUpcomingEvents Hook
- Filters events by date (only future events)
- Filters by status (only published events)
- Sorts events by date (earliest first)
- Provides loading and error states

### 2. Event Card Component
- Displays event information in a consistent format
- Handles missing images with placeholder
- Shows event status and featured badges
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
1. **Header Navigation**: Added "Upcoming Events" link with Calendar icon
2. **Footer**: Added link in the "Explore" section
3. **Direct URL**: `/upcoming-events`

## Future Enhancements

### Planned Features
1. **Event Registration**: Direct registration functionality
2. **Event Categories**: Filter events by type (meetup, workshop, etc.)
3. **Calendar View**: Alternative calendar-based layout
4. **Event Search**: Search functionality for events
5. **Event Reminders**: Email notifications for upcoming events
6. **Event Details Page**: Individual event detail pages

### Technical Improvements
1. **Pagination**: Load more events functionality
2. **Caching**: Implement caching for better performance
3. **Real-time Updates**: WebSocket integration for live event updates
4. **Analytics**: Track event view and registration metrics

## API Endpoints

### GET /api/events
- Returns published events
- Supports filtering by featured status
- Supports limiting results
- Orders by event date (ascending)

### Admin Endpoints
- `GET /api/admin/content/events` - Admin access to all events
- `POST /api/admin/content/events` - Create new event
- `PUT /api/admin/content/events/[id]` - Update event
- `DELETE /api/admin/content/events/[id]` - Delete event

## Testing

### Manual Testing Checklist
- [ ] Page loads correctly on all devices
- [ ] Events display in correct order (earliest first)
- [ ] Only future events are shown
- [ ] Only published events are shown
- [ ] Featured badges display correctly
- [ ] Status badges show correct colors
- [ ] Hover effects work properly
- [ ] Navigation links function correctly
- [ ] Loading states display properly
- [ ] Error states handle gracefully

### Automated Testing
- Unit tests for useUpcomingEvents hook
- Component tests for event cards
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
1. **Image Optimization**: Lazy loading for event images
2. **Code Splitting**: Separate bundle for events page
3. **Caching**: Browser and CDN caching for static assets
4. **Database Indexing**: Proper indexes on event_date and status

### Monitoring
- Page load time metrics
- API response time tracking
- Error rate monitoring
- User engagement analytics

## Security

### Data Protection
- Input validation for event data
- SQL injection prevention
- XSS protection for user-generated content
- Rate limiting for API endpoints

### Access Control
- Admin-only access for event management
- Public read access for published events
- Proper authentication for protected endpoints

## Deployment

### Environment Variables
```bash
# Required for events functionality
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Database Migration
Ensure the events table is created with proper indexes:
```sql
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_featured ON events(is_featured);
```

## Troubleshooting

### Common Issues
1. **Events not loading**: Check API endpoint and database connection
2. **Wrong event order**: Verify date sorting logic
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