from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
import json
import os

app = Flask(__name__)
CORS(app)

# -----------------------------
# Load datasets
# -----------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

prices_file = os.path.join(BASE_DIR, "data", "BrentOilPrices.csv")
events_file = os.path.join(BASE_DIR, "data", "events.csv")
change_point_file = os.path.join(BASE_DIR, "data", "bayesian_change_point.json")

prices = pd.read_csv(prices_file)
events = pd.read_csv(events_file)

with open(change_point_file) as f:
    change_point = json.load(f)

# -----------------------------
# Routes / API Endpoints
# -----------------------------

@app.route("/")
def home():
    return "Welcome to the Brent Oil Analysis API!"

@app.route("/api/prices")
def get_prices():
    return jsonify(prices.to_dict(orient="records"))

@app.route("/api/change-point")
def get_change_point():
    return jsonify(change_point)

@app.route("/api/events")
def get_events():
    return jsonify(events.to_dict(orient="records"))

# -----------------------------
# Run Flask
# -----------------------------
if __name__ == "__main__":
    app.run(debug=True)