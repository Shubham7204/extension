import os
from dotenv import load_dotenv
import google.generativeai as genai
import json

# Load environment variables from .env file
load_dotenv()

# Configure Google AI
genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
model = genai.GenerativeModel('gemini-1.5-pro')

def analysis(product):
    prompt = f"""You are an expert in sustainable shopping with vast knowledge of eco-friendliness and environmental impact 
    of various products. Analyze this product text and provide:
    1. A short description of the product
    2. Rate environmental-friendliness (0-10, where 0 is very harmful, 10 is very eco-friendly)
    3. A one-sentence summary of your rating reason
    4. Detailed analysis including environmental impact, purchase recommendations, and recycling options
    
    Product details: {product}
    
    Format response as a Python dictionary with keys: description, rating, summary, detail"""

    response = model.generate_content(prompt)
    
    try:
        # Clean the response to ensure it's valid JSON
        response_text = response.text.strip()
        if response_text.startswith('```python'):
            response_text = response_text[9:-3]  # Remove Python code block markers
        response_dict = eval(response_text)  # Convert string to dictionary
        return json.dumps(response_dict)
    except Exception as e:
        print(f"Error processing response: {e}")
        return json.dumps({
            "description": "Error analyzing product",
            "rating": 0,
            "summary": "Analysis failed",
            "detail": "Unable to process product information"
        })

def get_alternatives(desc):
    prompt = f"""Find eco-friendly alternatives to this product. Include:
    - Specific product names and brands
    - Where to purchase
    - Why they're more sustainable
    
    Product description: {desc}
    
    Format as markdown with clear headings and bullet points."""

    response = model.generate_content(prompt)
    return response.text