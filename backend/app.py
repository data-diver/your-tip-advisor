import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes, allowing frontend to call

# In a real scenario, you'd get this from environment variables
# and it would be your actual API key.
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    print("Warning: GEMINI_API_KEY not found in .env file. Real API calls will fail.")
    # You might want to raise an error or exit if the key is critical for startup
    # For now, we'll allow it to proceed for initial setup.

@app.route('/')
def home():
    return "Flask backend is running!"

@app.route('/api/chat-gemini', methods=['POST'])
def chat_handler():
    data = request.get_json()
    if not data or 'message' not in data:
        return jsonify({"error": "No message provided"}), 400

    user_message = data['message']

    # TODO: Later, replace this with actual Gemini API call
import google.generativeai as genai

# Configure Gemini API
if GEMINI_API_KEY:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        # Initialize the Gemini model
        # Adjust model name as needed, e.g., "gemini-pro", "gemini-1.0-pro"
        # For chat, you might use a specific chat model or manage history.
        # For a simple Q&A, a text generation model might be sufficient.
        model = genai.GenerativeModel('gemini-pro')
        print("Gemini API configured successfully.")
    except Exception as e:
        print(f"Error configuring Gemini API: {e}")
        model = None
else:
    model = None
    print("Warning: GEMINI_API_KEY not found. Real API calls will not be made.")


@app.route('/api/chat-gemini', methods=['POST'])
def chat_handler():
    data = request.get_json()
    if not data or 'message' not in data:
        return jsonify({"error": "No message provided"}), 400

    user_message = data['message']
    print(f"Received message from frontend: {user_message}")

    if not model:
        return jsonify({"error": "Gemini model not initialized. Check API key and configuration."}), 500

    try:
        # Simple non-streaming generation
        # For a chat application, you'd typically use `start_chat()` and send messages iteratively.
        # response = model.generate_content(user_message)

        # Using start_chat for a more conversational approach, though simple for now
        chat_session = model.start_chat(history=[]) # You can pass conversation history here
        response = chat_session.send_message(user_message)

        llm_reply = response.text

        return jsonify({
            "reply": llm_reply,
            "sender": "llm_gemini"
        })
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return jsonify({"error": f"Failed to get response from AI: {str(e)}"}), 500

if __name__ == '__main__':
    # Make sure to run the Flask app on a port different from the React app (default 5173)
    app.run(debug=True, port=5000)
