from flask import Flask, render_template, request, jsonify
import anthropic  # for Claude AI integration
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
client = anthropic.Anthropic(api_key=os.getenv('ANTHROPIC_API_KEY'))

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['GET'])
def generate_page():
    return render_template('generate.html')

@app.route('/generate', methods=['POST'])
def generate_script():
    prompt = request.json.get('prompt')
    try:
        response = client.messages.create(
            model="claude-3-sonnet-20240229",
            max_tokens=1000,
            messages=[{
                "role": "user",
                "content": f"Write a video script for: {prompt}"
            }]
        )
        return jsonify({"script": response.content[0].text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/generate-video', methods=['POST'])
def generate_video():
    data = request.json
    script = data.get('script')
    video_style = data.get('videoStyle')
    duration = data.get('duration')
    voice_style = data.get('voiceStyle')
    
    try:
        # Here you would integrate with video generation APIs
        # For example: Synthesia, D-ID, or other AI video generation services
        # For now, we'll return a placeholder response
        return jsonify({
            "status": "success",
            "message": "Video generation started"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True) 