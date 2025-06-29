# ReCast - Programmatic Logo Generation

<div align="center">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
</div>

## 🎨 Transform Code into Visual Identity

ReCast is a revolutionary approach to brand identity that treats logos as living code rather than static images. Using mathematical wave functions and programmatic generation, ReCast enables brands to have dynamic, adaptable identities that maintain consistency while responding to different contexts.

### ✨ Key Features

- **🌊 Wave-Based Generation**: Mathematical wave functions create unique, flowing designs
- **🎵 Multiple Visualization Modes**: Wave Lines, Audio Bars, and Wave Bars
- **🔑 Seed-Based Identity**: Your brand's "digital DNA" - same seed always generates the same logo
- **💻 Live Code Editor**: View and customize the generation code in real-time
- **🎯 Precise Control**: Fine-tune frequency, amplitude, complexity, chaos, and more
- **📦 Export Options**: Download as PNG or SVG (coming soon)
- **🔗 Shareable Links**: Share your exact logo configuration with a URL

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- pnpm (required) - [install instructions](https://pnpm.io/installation)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/recast.git
cd recast

# Install dependencies (pnpm required)
pnpm install

# Approve native module builds when prompted
# This is needed for better-sqlite3

# Copy environment variables
cp .env.local.example .env.local

# Start the development server
pnpm dev
```

Open [http://localhost:3002](http://localhost:3002) to see ReCast in action.

> **💡 Pro Tip**: Set up a local domain for better development experience. See [LOCAL_DOMAIN_SETUP.md](docs/setup-guides/LOCAL_DOMAIN_SETUP.md) to use `http://local.recast.dev:3002` instead.

### 🏃 Quick Start (No Auth Required)

You can start using ReCast immediately without any authentication setup:

1. Visit http://localhost:3002
2. Click "Continue as Guest" or start designing right away
3. All features work locally in your browser
4. To save settings across sessions, create a free account

### 🔐 Authentication Setup (Optional but Recommended)

ReCast uses [Better Auth](https://better-auth.com) for authentication, providing:
- 🏠 **Self-hosted authentication** - No external services required
- 💾 **Local SQLite database** - Your data stays on your machine
- 🔑 **Secure API key storage** - Save OpenAI keys per user account
- 🔐 **Multiple auth methods** - Email/password, Google, GitHub
- 💰 **Free forever** - No usage limits or paid tiers
- 🚀 **Modern architecture** - Edge-ready, TypeScript-first

#### Required Setup

1. **Generate a secret key** (required for session encryption):
   ```bash
   openssl rand -base64 32
   ```

2. **Add to `.env.local`**:
   ```env
   BETTER_AUTH_SECRET=your-generated-secret-here
   ```

3. **Run database migration** (first time only):
   ```bash
   npx @better-auth/cli migrate
   ```
   This creates `recast-auth.db` with user tables.

#### Optional OAuth Setup

Enable social sign-in by adding OAuth providers:

**Google OAuth:**
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials (Web application)
3. Add redirect URI: `http://localhost:3002/api/auth/callback/google`
4. Add to `.env.local`:
   ```env
   GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret
   ```

**GitHub OAuth:**
1. Visit [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set callback URL: `http://localhost:3002/api/auth/callback/github`
4. Add to `.env.local`:
   ```env
   GITHUB_CLIENT_ID=your-client-id
   GITHUB_CLIENT_SECRET=your-client-secret
   ```

#### Database Details

- **Type**: SQLite 3 (via better-sqlite3)
- **Location**: `./recast-auth.db` (auto-created)
- **Tables**: user, session, account, verification
- **Backup**: Simply copy the `.db` file
- **Reset**: Delete `.db` file and run migration again

### AI Features

ReCast includes several AI-powered features to help create the perfect brand identity:

#### Option 1: Server-Side AI (Using Project API Key)
For quick setup during development:

1. Copy the environment example file:
```bash
cp .env.local.example .env.local
```

2. Add your OpenAI API key to `.env.local`:
```
OPENAI_API_KEY=sk-your-api-key-here
```

3. Restart the development server

#### Option 2: Client-Side AI (Users Bring Their Own Keys)
The AI Brand Consultant allows users to use their own OpenAI API keys:

- Users enter their API key once (stored in localStorage)
- Keys are never sent to your servers
- Users pay for their own API usage
- Perfect for production deployments

#### AI Features Include:

1. **AI Brand Consultant** - Describe your brand in natural language and get personalized design recommendations
2. **AI Suggestions** - Context-aware parameter refinements based on industry and current design
3. **Brand Personality Mapping** - Translate personality traits into mathematical parameters

## 🏗️ Architecture

### Core Components

```
recast/
├── app/                      # Next.js app directory
│   ├── page.tsx             # Main application UI
│   ├── layout.tsx           # Root layout
│   └── visualization-templates.ts  # Code templates for each mode
├── core/                     # Core logic
│   └── wave-generator.ts    # Mathematical wave generation engine
├── components/              # Reusable UI components
│   └── ui/                  # Base UI components (buttons, cards, etc.)
└── lib/                     # Utility functions
```

### Technical Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Custom components built on Radix UI primitives
- **Code Editor**: CodeMirror with syntax highlighting
- **Canvas Rendering**: HTML5 Canvas API for real-time visualization

### Wave Generation System

The heart of ReCast is the `WaveGenerator` class, which implements:

```typescript
interface WaveParameters {
  amplitude: number     // Wave height
  frequency: number     // Wave cycles
  phase: number        // Wave offset
  complexity: number   // Harmonic additions
  chaos: number       // Randomness factor
  damping: number     // Layer decay
  layers: number      // Number of wave layers
}
```

## 🎮 Usage Guide

### Basic Workflow

1. **Choose a Visualization Mode**
   - Wave Lines: Classic sine wave patterns
   - Audio Bars: Vertical bars like audio visualizers
   - Wave Bars: Bars that follow a wave envelope

2. **Set Your Seed**
   - This is your brand's unique identifier
   - Same seed = same logo every time
   - Think of it as your logo's DNA

3. **Adjust Parameters**
   - Use sliders to fine-tune the visual output
   - See changes in real-time
   - Find the perfect balance for your brand

4. **Export Your Logo**
   - Download as PNG for immediate use
   - SVG export coming soon
   - Share a link to your exact configuration

### Advanced Features

#### Custom Code Mode

1. Click "Clone & Edit" on any visualization
2. Modify the JavaScript code directly
3. Create entirely new visualization algorithms
4. Full access to Canvas API and wave generation utilities

#### Animation

- Click the play button to animate your logo
- Perfect for dynamic brand presentations
- Smooth 60fps animations

#### Presets

Quick-start with pre-configured designs:
- Gentle Wave
- Audio Spectrum  
- Wave Flow

## 🧩 Development

### Commands

```bash
# Development
pnpm dev              # Start dev server (port 3002)
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
pnpm typecheck        # Run TypeScript compiler

# Database
npx @better-auth/cli migrate  # Create/update auth tables

# Testing
pnpm test             # Run tests (coming soon)
```

### Project Structure Philosophy

- **Identity as Code**: Logos are generated, not designed
- **Reproducibility**: Seed-based generation ensures consistency
- **Flexibility**: Multiple visualization modes for different contexts
- **Extensibility**: Custom code mode for unlimited possibilities

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) (coming soon) for details.

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🌟 Vision

ReCast represents a paradigm shift in brand identity. Instead of static logo files scattered across your organization, you have a single source of truth - code that generates your identity on demand. This enables:

- **Consistency**: One algorithm, infinite applications
- **Adaptability**: Respond to context while maintaining identity
- **Efficiency**: No more managing hundreds of logo variations
- **Innovation**: Push the boundaries of what a logo can be

---

<div align="center">
  <p>Built with ❤️ by the ReCast Team</p>
  <p>
    <a href="#-transform-code-into-visual-identity">Back to top ↑</a>
  </p>
</div>