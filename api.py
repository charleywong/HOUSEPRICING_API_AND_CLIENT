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

house_model = api.model( 'HouseInput', {
    'address': fields.String( description='Address of house to predict', required=True )
} )

@api.route('/predict')
class Prediction( Resource ):
    @api.response(200, 'Successfully ')
    @api.response(400, 'Invalid details (empty fields)')
    @api.expect( house_model, validate=True )
    def post(self):
        arg = request.json
        #validity check for payload
        if "address" not in arg.keys():
            return {"message": "Improper payload format - no proper address"}, 400

        # initialise a new HousePrices object
        # predict based on existing address in dataset
        price = hp.predict_existing( arg[ "address" ] )
        if price == -1:
            return {"message": "Address cannot be predicted"}, 400
        return {"price": price }

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
    @api.response( 400, 'Invalid sort_by field specified, expected between 0 and 3' )
    @api.doc( params={ 'sort_by': school_sort_desc }, required=False )
    def get( self ):
        result = si.search( )
        columns = si.get_columns( )

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
    @api.response( 400, 'Invalid sort_by field specified, expected between 0 and 3' )
    @api.response( 404, 'Suburb not found' )
    @api.doc( params={ 'sort_by': school_sort_desc }, required=False )
    def get( self, suburb ):
        if suburb not in si.get_suburb_list( ):
            return {
                'message': 'Suburb not found'
            }, 404
        result = si.search( suburb )
        columns = si.get_columns( )

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


        result_lst = [ ]
        for r in result:
            res_dict = { }
            for idx, col in enumerate( columns ):
                res_dict[ col ] = r[ idx ]
            result_lst.append( res_dict )
        return {
            "schools": result_lst
        }, 200

"""
    -- Crimes
"""

crime_output = api.model( 'CrimeOut', {
    'incidents': fields.Float( description='Number of incidents that occurred' )
} )

crime_groupby_desc = """
    Optional group_by field:
    0 - sum
    1 - mean
    2 - median
"""

@api.route( '/crimes/<suburb>' )
class CrimeSuburb( Resource ):
    @api.response( 200, 'Sucess' )
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
        res = ci.get_suburb_total_crimes( suburb, group_by )
        return { 
            'incidents': float( res )
        }, 200

def init( ):
    global hp, si, ci
    hp = HousePrices("data/prices.csv")
    si = SchoolInfo( "data/school.csv" )
    ci = CrimeInfo( 'data/crime.csv' )
