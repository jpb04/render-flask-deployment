from flask import Flask, request, jsonify
from flask_cors import CORS
import speech_recognition as sr
import openai
import os
from dotenv import load_dotenv
import json

load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize OpenAI
openai.api_key = os.getenv('OPENAI_API_KEY')

@app.route('/api/transcribe', methods=['POST'])
def transcribe_audio():
    try:
        audio_file = request.files['audio']
        recognizer = sr.Recognizer()
        
        with sr.AudioFile(audio_file) as source:
            audio = recognizer.record(source)
            text = recognizer.recognize_google(audio)
            
            # Use OpenAI to analyze and summarize the text
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a meeting note taker. Analyze the following text and provide: 1. Key points 2. Action items 3. Important decisions 4. Summary"},
                    {"role": "user", "content": text}
                ]
            )
            
            analysis = response.choices[0].message.content
            
            return jsonify({
                "transcription": text,
                "analysis": analysis
            })
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/save-notes', methods=['POST'])
def save_notes():
    try:
        data = request.json
        filename = f"meeting_notes_{data.get('timestamp', '')}.json"
        
        with open(f"notes/{filename}", 'w') as f:
            json.dump(data, f, indent=4)
            
        return jsonify({"message": "Notes saved successfully", "filename": filename})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    os.makedirs('notes', exist_ok=True)
    app.run(debug=True) 