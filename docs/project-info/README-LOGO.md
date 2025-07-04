# ReFlow Logo Setup

The ReFlow logo is generated using ReFlow itself! 

**Note**: The app currently uses a gradient placeholder icon. To use the generated ReFlow logo, follow these steps:

1. Start the development server:
   ```bash
   pnpm dev
   ```

2. Load the ReFlow Logo preset (first preset in the list) or navigate to:
   - http://localhost:3000 and click "🎯 ReFlow Logo"

3. Click "Export PNG" → "Export All Sizes" to download a zip file containing:
   - `ReFlow-1024.png` (1024×1024)
   - `ReFlow-512.png` (512×512)
   - `ReFlow-256.png` (256×256) - **Apple touch icon**
   - `ReFlow-128.png` (128×128) - **Used in app header**
   - `ReFlow-64.png` (64×64)
   - `ReFlow-32.png` (32×32) - **Browser favicon**
   - `ReFlow-16.png` (16×16) - **Browser favicon**

   **Note**: Files are named using your seed as the base name. For the ReFlow Logo preset (seed: reflow-identity), files will be named `ReFlow-*.png`. For other seeds, they'll be named `{seed}-*.png`.

4. Extract the zip and place the files in the `/public` directory:
   ```
   public/
   ├── ReFlow-128.png  # App header logo
   ├── ReFlow-256.png  # Apple touch icon
   ├── ReFlow-16.png   # Small favicon
   └── ReFlow-32.png   # Standard favicon
   ```

5. Update `app/page.tsx` to use the logo image:
   ```tsx
   // Replace the gradient div with:
   <Image 
     src="/ReFlow-128.png" 
     alt="ReFlow Logo"
     width={32}
     height={32}
     className="rounded-lg"
     priority
   />
   ```


## Logo Configuration

The ReFlow logo uses these parameters:
- Mode: Wave Bars
- Seed: reflow-identity
- Frequency: 5
- Amplitude: 80
- Complexity: 0.6
- Chaos: 0.15
- Damping: 0.85
- Bar Count: 80
- Bar Spacing: 2

These settings create the distinctive rainbow wave bar pattern that represents ReFlow's generative nature.