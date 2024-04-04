from flask import Flask
import random

app = Flask(__name__)

@app.route("/index")
def index():
    return "Hello"

@app.route("/moreload")
def more_load():
  	return str(sum(random.randint(0, 1000) for _ in range(1000)))