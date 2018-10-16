from flask import Blueprint
from flask import Flask, request
from flask_restplus import Api, Resource, fields, model, reqparse
import pymongo
from pymongo import MongoClient
import json
from bson import json_util

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
