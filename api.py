from flask import Blueprint
from flask_restplus import Resource, Api

# API AND SWAGGER INIT
blueprint = Blueprint('api', __name__)
api = Api(blueprint, title='Our Api')

# API ROUTES HERE?
@api.route('/test')
class HelloWorld(Resource):
    def get(self):
        return { 'some': 'shit right here' }, 200

# api call from react front end:
    # XMLHttpRequest()
    # 
