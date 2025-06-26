# ReCast Logo Setup

The ReCast logo is generated using ReCast itself! 

**Note**: The app currently uses a gradient placeholder icon. To use the generated ReCast logo, follow these steps:

1. Start the development server:
   ```bash
   pnpm dev
   ```

2. Load the ReCast Logo preset (first preset in the list) or navigate to:
   - http://localhost:3000 and click "🎯 ReCast Logo"

3. Click "Export PNG" → "Export All Sizes" to download a zip file containing:
   - `ReCast-1024.png` (1024×1024)
   - `ReCast-512.png` (512×512)
   - `ReCast-256.png` (256×256) - **Apple touch icon**
   - `ReCast-128.png` (128×128) - **Used in app header**
   - `ReCast-64.png` (64×64)
   - `ReCast-32.png` (32×32) - **Browser favicon**
   - `ReCast-16.png` (16×16) - **Browser favicon**

   **Note**: When using the ReCast Logo preset, you'll get `recast-logos.zip` with properly named files. For other seeds, the zip will be named `[seed]-logos.zip`.

4. Extract the zip and place the files in the `/public` directory:
   ```
   public/
   ├── ReCast-128.png  # App header logo
   ├── ReCast-256.png  # Apple touch icon
   ├── ReCast-16.png   # Small favicon
   └── ReCast-32.png   # Standard favicon
   ```

5. Update `app/page.tsx` to use the logo image:
   ```tsx
   // Replace the gradient div with:
   <Image 
     src="/ReCast-128.png" 
     alt="ReCast Logo"
     width={32}
     height={32}
     className="rounded-lg"
     priority
   />
   ```


## Logo Configuration

The ReCast logo uses these parameters:
- Mode: Wave Bars
- Seed: recast-identity
- Frequency: 5
- Amplitude: 80
- Complexity: 0.6
- Chaos: 0.15
- Damping: 0.85
- Bar Count: 80
- Bar Spacing: 2

These settings create the distinctive rainbow wave bar pattern that represents ReCast's generative nature.