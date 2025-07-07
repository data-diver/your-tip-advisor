# Backend Service for Global Tip Advisor Chat

This directory contains the Python Flask backend service that acts as a proxy for the Gemini API, providing AI-powered chat functionalities to the frontend.

## Setup

1.  **Ensure Python is Installed:**
    This backend requires Python 3.7+.

2.  **Create a Virtual Environment (Recommended):**
    Navigate to this `backend` directory in your terminal.
    ```bash
    python -m venv venv
    ```
    Activate the virtual environment:
    *   On macOS and Linux:
        ```bash
        source venv/bin/activate
        ```
    *   On Windows:
        ```bash
        .\venv\Scripts\activate
        ```

3.  **Install Dependencies:**
    With the virtual environment activated, install the required Python packages:
    ```bash
    pip install -r requirements.txt
    ```

4.  **Set Up Environment Variables:**
    *   Create a file named `.env` in this `backend` directory (if it doesn't already exist).
    *   Add your Gemini API key to the `.env` file:
        ```
        GEMINI_API_KEY="YOUR_ACTUAL_GEMINI_API_KEY"
        ```
        Replace `"YOUR_ACTUAL_GEMINI_API_KEY"` with your real API key obtained from Google AI Studio or Google Cloud Console.

    *   The behavior and focus of the AI are guided by a system prompt located in `system_prompt.md`. You can edit this file to change the AI's persona, instructions, and constraints.

## Running the Backend

1.  **Activate Virtual Environment (if not already active):**
    ```bash
    source venv/bin/activate  # macOS/Linux
    # .\venv\Scripts\activate    # Windows
    ```

2.  **Start the Flask Application:**
    ```bash
    python app.py
    ```
    The backend service will start, typically on `http://localhost:5000`. You should see output in your terminal indicating it's running, and if the Gemini API key was found.

## API Endpoint

*   `POST /api/chat-gemini`
    *   Accepts a JSON payload with a `message` field:
        ```json
        {
          "message": "Your question for the AI"
        }
        ```
    *   Returns a JSON response from the Gemini API, typically including a `reply` field:
        ```json
        {
          "reply": "The AI's response here",
          "sender": "llm_gemini"
        }
        ```
    *   Handles errors by returning appropriate JSON error messages and HTTP status codes.

## Note
This backend is intended to be run concurrently with the frontend React application. The frontend is configured to make requests to `http://localhost:5000/api/chat-gemini`.
