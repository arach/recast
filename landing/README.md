# ReCast Landing Page

Marketing landing page for ReCast - the dynamic brand identity system.

## Tech Stack

- **Framework**: Next.js 14 (Static Export)
- **Styling**: TailwindCSS
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Deployment**: GitHub Pages

## Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Export static site
pnpm export

# Deploy to GitHub Pages
pnpm deploy
```

## Structure

```
landing/
├── app/
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── components/
│   ├── Navigation.tsx   # Header navigation
│   ├── Hero.tsx         # Hero section
│   ├── Features.tsx     # Features grid
│   ├── Templates.tsx    # Template showcase
│   ├── HowItWorks.tsx   # Process steps
│   ├── Pricing.tsx      # Pricing plans
│   ├── CTA.tsx          # Call to action
│   └── Footer.tsx       # Footer
├── public/              # Static assets
├── next.config.js       # Next.js config
└── tailwind.config.ts   # Tailwind config
```

## Deployment

The site is configured for GitHub Pages deployment:

1. Push to `main` branch
2. GitHub Action builds and exports the site
3. Deploys to GitHub Pages

The site will be available at: `https://recast.arach.io`

## Features

- **Responsive Design**: Mobile-first approach
- **Dark Mode Ready**: Prepared for dark mode support
- **SEO Optimized**: Meta tags and structured data
- **Performance**: Static export for fast loading
- **Animations**: Smooth scroll animations with Framer Motion
- **Interactive**: Live canvas animation in hero section

## Customization

### Colors

Edit the theme colors in `tailwind.config.ts`:

```js
colors: {
  'recast-blue': '#3b82f6',
  'recast-purple': '#8b5cf6',
  'recast-pink': '#ec4899',
  'recast-dark': '#0f172a',
}
```

### Content

All content is in the component files. Edit directly to update:
- Hero text: `components/Hero.tsx`
- Features: `components/Features.tsx`
- Templates: `components/Templates.tsx`
- Pricing: `components/Pricing.tsx`

### Domain

To use a custom domain:
1. Add a `CNAME` file to `public/` with your domain
2. Configure DNS to point to GitHub Pages
3. Enable HTTPS in repository settings