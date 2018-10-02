from flask import Flask, Blueprint, render_template, send_from_directory
from flask_restplus import Resource, Api

from api import blueprint

app = Flask(__name__, static_folder='templates/static')

@app.route('/')
def index():
    return render_template("index.html")
    #return send_from_directory('./build','index.html');

app.register_blueprint(blueprint)

if __name__ == '__main__':
    app.run(debug=True)
