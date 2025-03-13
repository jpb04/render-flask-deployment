# AI Meeting Note Taker

An intelligent application that takes meeting notes, transcribes audio, and provides AI-powered analysis of important points and action items.

## Features

- Real-time audio recording and transcription
- AI-powered analysis of meeting content
- Automatic identification of key points and action items
- Downloadable meeting notes
- Available as both web and desktop applications

## Prerequisites

- Python 3.8 or higher
- Node.js 14 or higher
- OpenAI API key

## Setup

1. Clone the repository
2. Install backend dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

4. Create a `.env` file in the backend directory with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

## Running the Application

### Web Version

1. Start the backend server:
   ```bash
   cd backend
   python app.py
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

### Desktop Version

1. Build the desktop application:
   ```bash
   cd frontend
   npm run electron-pack
   ```

2. The packaged application will be available in the `dist` folder

## Usage

1. Click the "Start Recording" button to begin recording your meeting
2. Speak clearly into your microphone
3. Click "Stop Recording" when finished
4. Wait for the AI to process and analyze the meeting content
5. Review the transcription and analysis
6. Download the notes using the "Download Notes" button

## Technologies Used

- Backend: Python, Flask, OpenAI API, SpeechRecognition
- Frontend: React, Material-UI, Electron
- AI: OpenAI GPT-3.5 Turbo
- Audio Processing: Web Audio API, SpeechRecognition

## License

MIT License 