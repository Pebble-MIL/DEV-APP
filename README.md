# Pebble: Digital Literacy for Kids 🐧✨

Pebble is an interactive educational game designed to teach children about digital literacy, privacy, and online safety. Players help a cute, clumsy penguin named Pebble build his nest by navigating through various ice islands, finding clues, and learning what is safe to share online.

## 🌟 Features

- **Interactive Gameplay**: Explore different ice islands (Beaches, Cliffs, Glaciers) and solve scenarios related to digital safety.
- **Educational Scenarios**: Learn to identify sensitive information in photos, messages, and social media posts.
- **Progress Tracking**: Earn pebbles for correct answers and track your progress as you build Pebble's nest.
- **Kid-Friendly UI/UX**: Colorful, engaging, and accessible design tailored for young learners.
- **AI-Powered Backend**: Integrates with OpenRouter to provide intelligent feedback and dynamic content generation (where applicable).

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Package Manager**: pnpm

### Backend
- **Framework**: FastAPI (Python)
- **Database**: Firebase / Firestore
- **AI Integration**: OpenRouter
- **Testing**: Pytest

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- `pnpm` (Use `pnpm` exclusively, do not use `npm` or `yarn`)
- Python 3.9+
- Firebase Project configured

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start the development server:
   ```bash
   pnpm run dev
   ```
4. Build for production:
   ```bash
   pnpm run build
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the backend server:
   ```bash
   uvicorn main:app --reload
   ```
5. Run backend tests:
   ```bash
   PYTHONPATH=. pytest
   ```

## 🛡️ License

© 2024 Pebble. All rights reserved.
