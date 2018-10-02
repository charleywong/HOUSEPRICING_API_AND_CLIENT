from flask import Flask, Blueprint, render_template
from flask_restplus import Resource, Api

from api import blueprint

app = Flask(__name__, static_folder='static')

@app.route('/')
def index():
    return render_template("index.html")
    
app.register_blueprint(blueprint)

if __name__ == '__main__':
    app.run(debug=True)
