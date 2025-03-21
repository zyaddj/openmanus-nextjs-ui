# OpenManus UI

A user-friendly web interface for OpenManus, an AI agent similar to Manus but requiring technical expertise. This interface makes OpenManus accessible to non-technical users while retaining full functionality.

## Features

- **Authentication & User Accounts**: Secure login and signup with Supabase authentication
- **Dashboard UI**: Clean, modern interface with intuitive navigation
- **API Key Management**: Securely store and manage API keys for different AI models
- **Task Execution**: Interactive interface for creating tasks and viewing responses
- **Settings & Customization**: Personalize your experience with theme switching and model parameters

## Tech Stack

- **Frontend**: Next.js with React and Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: Supabase for secure API key storage
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm
- Supabase account for authentication and database

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/openmanus-ui.git
cd openmanus-ui
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
Create a `.env.local` file with the following variables:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup

Run the following SQL in your Supabase SQL editor to set up the required tables:

```sql
-- API Keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL,
  api_key VARCHAR(255) NOT NULL,
  model VARCHAR(50),
  base_url VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, provider)
);

-- Create RLS policies
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Policy for users to only see their own API keys
CREATE POLICY "Users can view their own API keys"
  ON api_keys
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy for users to insert their own API keys
CREATE POLICY "Users can insert their own API keys"
  ON api_keys
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own API keys
CREATE POLICY "Users can update their own API keys"
  ON api_keys
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy for users to delete their own API keys
CREATE POLICY "Users can delete their own API keys"
  ON api_keys
  FOR DELETE
  USING (auth.uid() = user_id);
```

## Deployment

See [deployment.md](deployment.md) for instructions on deploying to Vercel.

## Project Structure

- `src/app`: Next.js pages and routes
- `src/components`: Reusable UI components
- `src/hooks`: Custom React hooks for authentication, API keys, and settings
- `src/lib`: Utility functions and API clients

## License

This project is licensed under the MIT License - see the LICENSE file for details.
