# Tablet Responsive Design Guide

## Overview

Aplikasi Creator Hub sekarang mendukung tampilan tablet dengan breakpoint khusus untuk ukuran 768px hingga 1024px.

## Breakpoint Configuration

### Tailwind CSS Configuration

Breakpoint tablet telah ditambahkan ke `tailwind.config.ts`:

```typescript
screens: {
  'tablet': {'min': '768px', 'max': '1024px'},
}
```

### Penggunaan

Gunakan class `tablet:` untuk styling khusus tablet:

```jsx
// Grid layout responsif
<div className="grid grid-cols-1 tablet:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Content */}
</div>

// Sidebar yang dapat di-collapse di tablet
<div className="tablet:w-16 tablet:expanded:w-56">
  {/* Sidebar content */}
</div>

// Sembunyikan elemen di tablet
<div className="tablet:hidden">
  {/* Hidden on tablet */}
</div>
```

## Komponen yang Sudah Diupdate

### 1. Dashboard Layout (`src/components/dashboard-layout.tsx`)

- Sidebar dapat di-collapse di tablet (16px vs 224px)
- Overlay untuk mobile tetap berfungsi
- Transisi smooth untuk collapse/expand
- Main content menyesuaikan margin berdasarkan state sidebar
- Tombol toggle sidebar di header untuk kontrol mudah

### 2. Dashboard Sidebar (`src/components/dashboard-sidebar.tsx`)

- Mendukung mode collapsed dengan hanya icon
- Tooltip untuk label saat collapsed
- Transisi smooth

### 3. Dashboard Header (`src/components/dashboard-header.tsx`)

- Navigation menu tetap terlihat di tablet untuk akses cepat
- Tombol toggle sidebar ditambahkan di header untuk tablet
- Spacing dan ukuran font disesuaikan untuk tablet
- Navigasi "Dashboard Profile", "Workflow Saya", "Creator Saya" tersedia di header

### 4. Header Navigation (`src/components/header-nav.tsx`)

- Tombol "Join Community" diperkecil untuk tablet
- Text berubah menjadi "Join" di tablet untuk menghemat ruang
- Padding dan ukuran font disesuaikan untuk tablet

### 5. About Section (`src/components/about-section.tsx`)

- Tombol "Join Community" di CTA section diperkecil untuk tablet
- Padding dan ukuran icon disesuaikan untuk tablet

### 6. Connect With Us Page (`src/app/connect-with-us/page.tsx`)

- Tombol "Join Community" diperkecil untuk tablet
- Padding dan ukuran font disesuaikan untuk tablet

### 7. Grid Layouts

#### Dashboard Profile Page
- Profile info: 1 kolom di mobile, 1 kolom di tablet, 1 kolom di desktop
- Profile card: Diperbesar untuk tablet dengan elemen internal yang diperkecil
- Avatar: Ukuran proporsional (h-24 w-24 → h-36 w-36 di tablet) dan diposisikan center di tablet
- User name: Font size 1rem (text-base) dan posisi center di tablet
- Follower/Following: Layout vertikal di tablet (following di bawah followers)
- Content area: 1 kolom di mobile, 2 kolom di tablet, 3 kolom di desktop
- Stats grid: 1 kolom di mobile, 2 kolom di tablet, 4 kolom di desktop

#### Workflows Page
- Workflow cards: 1 kolom di mobile, 2 kolom di tablet, 3 kolom di desktop

#### Talent Directory
- Creator cards: 1 kolom di mobile, 2 kolom di tablet, 3 kolom di desktop

#### Featured Components
- Featured creators: 1 kolom di mobile, 2 kolom di tablet, 3 kolom di desktop
- Featured workflows: 1 kolom di mobile, 2 kolom di tablet, 4 kolom di desktop

## CSS Utilities

### Custom Classes

```css
/* Container khusus tablet */
.tablet-container {
  max-width: 1024px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Sidebar states */
.tablet-sidebar-collapsed {
  width: 4rem;
}

.tablet-sidebar-expanded {
  width: 14rem;
}
```

### Button Responsive Styling

```css
/* Responsive button styling untuk tablet */
@media (min-width: 768px) and (max-width: 1024px) {
  .btn-login {
    padding: 0.5rem 1.25rem;
    font-size: 0.875rem;
    min-height: 36px;
  }
}
```

## Best Practices

### 1. Layout Hierarchy
- Mobile: Single column, minimal navigation
- Tablet: Two-column layout dengan sidebar yang dapat di-collapse
- Desktop: Full layout dengan sidebar tetap terbuka

### 2. Navigation
- Mobile: Hamburger menu dengan overlay, navigation links disembunyikan di header
- Tablet: Collapsible sidebar dengan icon-only mode, navigation links terlihat di header, hamburger menu disembunyikan
- Desktop: Fixed sidebar dengan full labels, navigation links terlihat di header, hamburger menu disembunyikan

### 3. Content Density
- Tablet: Optimalkan ruang dengan 2 kolom untuk cards
- Gunakan spacing yang konsisten (gap-4, gap-6, gap-8)

### 4. Touch Targets
- Pastikan semua interactive elements minimal 44px untuk touch
- Spacing yang cukup antara elemen untuk touch interaction

### 5. Button Responsive Design
- Gunakan text yang lebih pendek di tablet (contoh: "Join" vs "Join Community")
- Kurangi padding dan ukuran font untuk menghemat ruang
- Sesuaikan ukuran icon untuk proporsi yang tepat
- Gunakan class `tablet:` untuk styling khusus tablet

### 6. Profile Card Responsive Design
- Perbesar card container untuk tablet (`max-w-xs` → `max-w-sm`)
- Sesuaikan ukuran avatar secara proporsional (h-24 → h-36 di tablet)
- Kurangi ukuran font untuk nama user (text-xl → text-base di tablet)
- Posisikan nama user ke center untuk tablet
- Posisikan avatar ke center di tablet menggunakan flexbox
- Posisikan button "Edit Profile" ke center di tablet menggunakan flexbox wrapper (`tablet:flex tablet:justify-center`)
- Layout follower/following: horizontal di mobile/desktop, vertikal di tablet
- Optimalkan spacing dan padding untuk tablet
- Kurangi jarak antara navigation dan card untuk tablet (py-12 → py-6, space-y-8 → space-y-4, mt-4 → mt-2)
- Pastikan social media icons tetap proporsional

### 7. Spacing Optimization untuk Tablet
- **Main Content Padding**: Kurangi padding vertikal untuk tablet (`py-12` → `py-6`)
- **Content Spacing**: Kurangi spacing antar elemen (`space-y-8` → `space-y-4`)
- **Top Margin**: Kurangi margin top (`mt-4` → `mt-2`)
- **Grid Gap**: Sesuaikan gap grid untuk tablet (`gap-8` → `gap-4`)
- **Navigation Gap**: Pastikan jarak antara header navigation dan content optimal

### 8. Header Navigation Optimization
- **Mobile**: Navigation links disembunyikan (`hidden sm:flex`) untuk menghemat ruang
- **Tablet**: Navigation links terlihat di header untuk akses cepat
- **Desktop**: Navigation links tetap terlihat di header
- **Hamburger Menu**: Hanya tersedia di mobile (`flex sm:hidden`) untuk akses navigation

## Testing

### Breakpoint Testing
```css
/* Test breakpoint tablet */
@media (min-width: 768px) and (max-width: 1024px) {
  /* Tablet styles */
}
```

### Device Testing
- iPad (768px x 1024px)
- iPad Pro 11" (834px x 1194px)
- iPad Pro 12.9" (1024px x 1366px)
- Samsung Galaxy Tab (800px x 1280px)

## Migration Guide

### Dari md: ke tablet:

```jsx
// Sebelum
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

// Sesudah
<div className="grid grid-cols-1 tablet:grid-cols-2 lg:grid-cols-3">
```

### Sidebar Implementation:

```jsx
// Gunakan DashboardLayout component
import { DashboardLayout } from "@/components/dashboard-layout";

export default function MyPage() {
  return (
    <DashboardLayout>
      {/* Your content */}
    </DashboardLayout>
  );
}
```

## Troubleshooting

### Sidebar tidak collapse di tablet
- Pastikan menggunakan `DashboardLayout` component
- Periksa state `sidebarOpen` dan `isCollapsed`

### Grid layout tidak responsif
- Pastikan menggunakan class `tablet:` bukan `md:`
- Periksa Tailwind config sudah ter-update

### Styling tidak ter-apply
- Restart development server setelah update Tailwind config
- Clear browser cache 