# ReCast Logo Setup

The ReCast logo is generated using ReCast itself! To set up the logo files:

1. Start the development server:
   ```bash
   pnpm dev
   ```

2. Load the ReCast Logo preset (first preset in the list) or navigate to:
   - http://localhost:3000 and click "🎯 ReCast Logo"

3. Click "Export PNG" → "Export All Sizes" to download all logo files at once:
   - `logo-1024.png` (1024×1024)
   - `logo-512.png` (512×512)
   - `logo-256.png` (256×256)
   - `logo-128.png` (128×128) - **Used in app header**
   - `logo-64.png` (64×64)
   - `favicon-32.png` (32×32) - **Browser favicon**
   - `favicon-16.png` (16×16) - **Browser favicon**

   **Note**: When using the ReCast Logo preset (seed: recast-identity), the files will automatically have the correct names. For other logos, the files will be named with your seed.

4. Place the exported files in the `/public` directory:
   ```
   public/
   ├── logo-128.png    # App header logo
   ├── logo-256.png    # Apple touch icon
   ├── favicon-16.png  # Small favicon
   └── favicon-32.png  # Standard favicon
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