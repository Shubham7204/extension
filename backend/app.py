from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from utils import analysis, get_alternatives

app = Flask(__name__)
CORS(app)  # Allow all origins for testing, restrict in production

@app.route('/analyse', methods=['POST'])
def analyse():
    data = request.json
    extractedText = data.get('extractedText')
    analysis_result = analysis(extractedText)
    return jsonify({"message": "Analysis completed", "result": analysis_result})

@app.route('/alternatives', methods=['POST'])
def alternatives():
    data = request.json
    description = data.get('description')
    alternatives_result = get_alternatives(description)
    return jsonify({"message": "Alternatives fetched", "alternatives": alternatives_result})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)