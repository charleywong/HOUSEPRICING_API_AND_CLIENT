from flask import Blueprint
from flask import Flask, request
from flask_restplus import Api, Resource, fields, model, reqparse
import pymongo
from pymongo import MongoClient
import json
from bson import json_util

from housing import HousePrices
from school import SchoolInfo
from crime import CrimeInfo

import requests

MAPBOX_TOKEN = 'pk.eyJ1IjoiZmZmeDAiLCJhIjoiY2psbGtsa21nMHlneDNwcW4wbzg3bDd5eiJ9.Q3ZS5kabj_xO1KVifuuQJQ'

# API AND SWAGGER INIT
blueprint = Blueprint('api', __name__)
api = Api(blueprint, title='Our Api')

usr_details = {
    "_id": "ass2.gontri",
    "user": "gontri",
    "db": "ass2",
    "roles": [
        {
            "role": "dbOwner",
            "db": "ass2"
        }
    ]
}


user_model = api.model('User Register and Login Data', {
'name': fields.String,
'password': fields.String
})

token_model = { 
  "name": None,
  "token": None
} 


host='mongodb://gontri:Lolcats123@ds153552.mlab.com:53552/ass2'

#to do calls; do it as such
    #collection = db[arg["indicator_id"]]
    #collection.insert_one(json.loads(json_util.dumps(new_data)))

client = MongoClient(host)
db = client['ass2']

(hp, si, ci) = (None, None, None)

# API ROUTES HERE?
@api.route('/register')
class register(Resource):
    @api.expect(user_model, validate = True)

    @api.response(201, 'Successfully created new user')
    @api.response(400, 'Invalid login details (empty fields) or user already found')
    def post(self):
        
        arg = request.json

        #validity check for payload
        if "name" not in arg.keys():
            return {"message": "Improper payload format - no proper username"}, 400

        if "password" not in arg.keys():
            return {"message": "Improper payload format - no proper password"}, 400

        if (arg["name"] == "") or (arg["password"] == ""):
            return {"message": "Provide non-empty user/pass"}, 400

        #check user does not exist already
        collection = db["users"]
        for document in collection.find():
            if document["name"] == arg["name"]:
                return {"message": "username already exists"}, 400

        new_data = user_model

        new_data["name"] = arg["name"]
        new_data["password"] = arg["password"]

        
        collection.insert_one(json.loads(json_util.dumps(new_data)))

        return { 'message': 'created' }, 201

@api.route('/login')
class login(Resource):

    @api.expect(user_model, validate = True)
    @api.response(200, 'Successfully found, will return a token in form "token-username"')
    @api.response(404, 'User not found.')
    @api.response(400, 'Invalid login details (empty fields)')
    def post(self):
       
        arg = request.json
        
        if "name" not in arg.keys():
            return {"message": "Improper payload format - no proper username"}, 400

        if "password" not in arg.keys():
            return {"message": "Improper payload format - no proper password"}, 400

        if (arg["name"] == "") or (arg["password"] == ""):
            return {"message": "Provide non-empty user/pass"}, 400


        collection = db["users"]

        for document in collection.find():
            if document["name"] == arg["name"]:
                if document["password"] == arg["password"]:
                    #make a token with a date that is valid and send it 
                    token = token_model
                    token["name"] = arg["name"]
                    token["token"] = "token-"+arg["name"]

                    collection = db["tokens"]
                    collection.insert_one(json.loads(json_util.dumps(token)))
                    return {"message": token["token"] }, 200

                else:
                    return {"message": "wrong password"}, 400

        return { 'message': 'user not found' }, 404

"""
    -- House Prices
"""

house_input = api.model( 'HouseIn', {
    # "Suburb": fields.String,
    "Type": fields.String( description='h - House, u - Unit, t - Townhouse', required=True ),
    "Address": fields.String( required=True ),
    # "Postcode": fields.Float,
    "Bedroom": fields.Integer( description='Number of bedrooms', required=True, min=0 ),
    "Bathroom": fields.Integer( description='Number of bathrooms', required=True, min=0 ),
    "Car": fields.Integer( description='Number of garage/car slots', required=True, min=0 ),
    # "Landsize": fields.Float( description='Land size in m^2', required=True ),
    # "BuildingArea": fields.Float( description='Building Area in m^2', required=True ),
    # "Latitude": fields.
    # "Longtitude": fields.
    "year": fields.Integer( required=True ),
    "month": fields.Integer( required=True ),
    "day": fields.Integer( required=True )
} )

house_output = api.model( 'HouseOut', {
    'float': fields.Float
} )

@api.route( '/predict_price' )
class PredictPrice( Resource ):
    @api.response( 200, 'Success', house_output )
    @api.response( 400, 'One of the required fields was not given or specified incorrectly')
    @api.response( 503, 'Mapbox API service unavailable (token usage exhausted possibly)' )
    # @api.response( 404, 'Add')

    @api.expect( house_input, validate=True )
    def post( self ):

        for key in house_input:
            if key not in request.json:
                return {
                    'message': 'Field {} was not given in payload'.format( key )
                }, 400

        js = request.json
        (t, addr, ber, bar, car, yr, mn, dy) = [ js[ k ] for k in js.keys( ) ]

        if t not in [ 'h', 'u', 't' ]:
            return {
                'message': 'Type field expected to be H, U or T'
            }, 400

        URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/{}.json?access_token={}'.format( addr, MAPBOX_TOKEN )
        res = requests.get( URL, headers={ 'User-Agent': 'Custom' } ) # hack it so mapbox returns a result
        if res.status_code != 200:
            return {
                'message': 'Mapbox API is rejecting requests'
            }, 503
        
        result = res.json( )[ 'features' ][ 0 ]
        address = result[ 'address' ] + result[ 'text' ]
        (lng,lat) = result[ 'geometry'][ 'coordinates' ]
        (suburb, postcode) = (None, None)
        for loc in result[ 'context' ]:
            if 'locality' in loc[ 'id' ]:
                suburb = loc[ 'text' ]
            if 'postcode' in loc[ 'id' ]:
                postcode = float( loc[ 'text' ] )

        try:
            in_dict = {
                "Suburb": suburb,
                "Type": t,
                "Postcode": postcode,
                "Bedroom2": float( ber ),
                "Bathroom": float( bar ),
                "Car": float( car ),
                "Landsize": hp.get_mean_field( suburb, 'Landsize'),
                "BuildingArea": hp.get_mean_field( suburb, 'BuildingArea'),
                "Lattitude": lat,
                "Longtitude": lng,
                "year": float( yr ),
                "month": float( mn ),
                "day": float( dy ),
            }
        except ValueError:
            return {
                'message': 'Values could not be converted into floats'
            }, 400
        return {
            'price': hp.predict( in_dict )
        }, 200

house_model = api.model( 'HouseInput', {
    'address': fields.String( description='Address of house to predict', required=True )
} )

# @api.route('/predict')
# class Predict( Resource ):
#     @api.response(200, 'Successfully ')
#     @api.response(400, 'Invalid details (empty fields)')
#     @api.expect( house_model, validate=True )
#     def post(self):
#         arg = request.json
#         #validity check for payload
#         if "address" not in arg.keys():
#             return {"message": "Improper payload format - no proper address"}, 400

#         # initialise a new HousePrices object
#         # predict based on existing address in dataset
#         price = hp.predict_existing( arg[ "address" ] )
#         if price == -1:
#             return {"message": "Address cannot be predicted"}, 400
#         return {"price": price }

# heatmap_model = api.model( 'HeatmapIn', {
#     'suburb': fields.String( required=True )
# } )

# datapoint = api.model( 'Datapoint', {
#     'long': fields.Float( ),
#     'lat': fields.Float( )
# } )

# heatmap_out = api.model( 'HeatmapOut', {
#     'min': fields.Float( description='Minimum price of heatmap' ),
#     'max': fields.Float( description='Maximum price of heatmap' ),
#     'results': fields.List( fields.Nested( datapoint ) )
# })

# @api.route( '/heatmap/<suburb>' )
# class PriceHeatmap( Resource ):
#     @api.response( 200, 'Success', heatmap_out )
#     # @api.response( 404, 'Suburb not found' )
#     def get( self, suburb ):
#         (mn, mx, results) = hp.heatmap( suburb )
#         return {
#             'min': mn,
#             'max': mx,
#             'results': results
#         }, 200

"""
    -- School
"""

school_output = api.model( 'SchoolOut', {
    'School_Name': fields.String( description='Name of the school'),
    'Suburb': fields.String( description='Name of suburb' ),
    'VCE_Students': fields.Integer( description='Number of students enrolled in at least one VCE subject'),
    'VCE_Completion%': fields.Float( description='Percentage of students that completed VCE' ),
    'VCE_Median': fields.Integer( description='Median of VCE score' ),
    'VCE_Over40%': fields.Float( description='Percentage that scored over 40' ),
} )

school_sort_desc = """
Optional sort field: 
    0 - number of students, 
    1 - completion %, 
    2 - median, 
    3 - over 40%
"""

@api.route('/schools')
class Schools( Resource ):
    @api.response(200, 'Success')
    @api.response( 400, 'Invalid field or field value specified' )
    @api.doc( params={ 'sort_by': school_sort_desc }, required=False )
    @api.doc( params={ 'ascending': 'true for ascending, false for descending' }, required=False )
    def get( self ):
        ascending = True
        if 'ascending' in request.args:
            asc = request.args.get( 'ascending' )
            if 'true' not in asc and 'false' not in asc:
                return { 
                    'message': 'Invalid ascending field specified, expected true or false' 
                }, 400
            elif asc == 'true':
                ascending = True
            elif asc == 'false':
                ascending = False

        sort_by = None
        if 'sort_by' in request.args:
            try:
                sort_by = int( request.args.get( 'sort_by' ) )
                if sort_by < 0 or sort_by > 3:
                    return { 
                        'message': 'Invalid sort_by field specified, expected between 0 and 3' 
                    }, 400
            except ValueError:
                return { 
                    'message': 'Invalid sort_by field specified, expected between 0 and 3' 
                }, 400

        result = si.search( sort=sort_by, asc=ascending )
        columns = si.get_columns( )

        result_lst = [ ]
        for r in result:
            res_dict = { }
            for idx, col in enumerate( columns ):
                res_dict[ col ] = r[ idx ]
            result_lst.append( res_dict )
        return {
            "schools": result_lst
        }, 200

@api.route( '/school/<suburb>' )
class School( Resource ):
    @api.response( 200, 'Success', school_output )
    @api.response( 400, 'Invalid field or field value specified' )
    @api.response( 404, 'Suburb not found' )
    @api.doc( params={ 'sort_by': school_sort_desc }, required=False )
    @api.doc( params={ 'ascending': 'true for ascending, false for descending' }, required=False )
    def get( self, suburb ):
        if suburb not in si.get_suburb_list( ):
            return {
                'message': 'Suburb not found'
            }, 404

        ascending = True
        if 'ascending' in request.args:
            asc = request.args.get( 'ascending' )
            if 'true' not in asc and 'false' not in asc:
                return { 
                    'message': 'Invalid ascending field specified, expected true or false' 
                }, 400
            elif asc == 'true':
                ascending = True
            elif asc == 'false':
                ascending = False

        sort_by = None
        if 'sort_by' in request.args:
            try:
                sort_by = int( request.args.get( 'sort_by' ) )
                if sort_by < 0 or sort_by > 3:
                    return { 
                        'message': 'Invalid sort_by field specified, expected between 0 and 3' 
                    }, 400
            except ValueError:
                return { 
                    'message': 'Invalid sort_by field specified, expected between 0 and 3' 
                }, 400

        result = si.search( suburb, sort=sort_by )
        columns = si.get_columns( )

        result_lst = [ ]
        for r in result:
            res_dict = { }
            for idx, col in enumerate( columns ):
                res_dict[ col ] = r[ idx ]
            result_lst.append( res_dict )
        return {
            "schools": result_lst
        }, 200

search_nested = api.model( 'SearchNested', {
    'Suburb': fields.String,
    'Type': fields.String,
    'Price': fields.Integer,
    'Postcode': fields.Integer,
    'Bedroom': fields.Integer,
    'Bathroom': fields.Integer,
    'Car': fields.Integer,
    'Landsize': fields.Integer,
    'BuildingArea': fields.Integer,
    'Latitude': fields.Float,
    'Longitude': fields.Float
} )

search_output = api.model( 'SearchOutput', {
    'results': fields.List( fields.Nested( search_nested ) )
} )

search_input = api.model( 'SearchInput', {
    'min': fields.Integer( description='Minimum price of search', required=True ),
    'max': fields.Integer( description='Maximum price of search', required=True ),
    'suburb': fields.String( description='Suburb of search', required=True )
} )

@api.route( '/search' )
class HouseSearch( Resource ):
    @api.response( 200, 'Success', search_output )
    @api.expect( search_input, validate=True )
    def post( self ):
        args = request.json
        arg = {
            'min': args[ 'min' ],
            'max': args[ 'max' ],
            'suburb': args[ 'suburb']
        }
        return {
            'results': hp.search( arg )
        }, 200

"""
    -- Crimes
"""

crime_nested = api.model( 'CrimeSingle', {
    'category': fields.String( description='Category of the crime' ), 
    'incidents': fields.Integer( description='Number of incidents in the category' )
} )

crime_output = api.model( 'CrimeOut', {
    'results': fields.List( fields.Nested( crime_nested ) )
} )

crime_groupby_desc = """
    Optional group_by field:
    0 - sum
    1 - mean
    2 - median
"""

@api.route( '/crimes/<suburb>' )
class CrimeSuburb( Resource ):
    @api.response( 200, 'Sucess', crime_output )
    @api.response( 400, 'Invalid group_by field specified, expected between 0 and 2' )
    @api.response( 404, 'Suburb not found' )
    @api.doc( params={ 'group_by': crime_groupby_desc }, required=False )
    def get( self, suburb ):
        if suburb not in ci.get_suburb_list( ):
            return {
                'message': 'Suburb not found'
            }, 404
        
        group_by = None
        if 'group_by' in request.args:
            try:
                group_by = int( request.args.get( 'group_by' ) )
                if group_by < 0 or group_by > 2:
                    return { 
                        'message': 'Invalid group_by field specified, expected between 0 and 2' 
                    }, 400
            except ValueError:
                return { 
                    'message': 'Invalid group_by field specified, expected between 0 and 2' 
                }, 400

        if not group_by:
            group_by = 0
        return { 
            'results': ci.get_suburb_crimes( suburb, group_by )
        }, 200

def init( ):
    global hp, si, ci
    hp = HousePrices("data/prices.csv")
    si = SchoolInfo( "data/school.csv" )
    ci = CrimeInfo( 'data/crime.csv' )