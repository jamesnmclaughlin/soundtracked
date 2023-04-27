#!flask/bin/python
from flask import Flask, request, abort, jsonify, make_response

from sklearn import svm
from sklearn import preprocessing

import pandas as pd
import numpy as np

app = Flask(__name__)

# Providing message at API root
@app.route('/')
def index():
    return "SoundTracked Python Endpoint V1.0\nCreated by James McLaughlin"

# Endpoint to retrieve important features from provided data
@app.route('/api/1.0/features', methods=['GET'])
def get_importance():
    #if not request.json or not 'data' in request.json:
    #    abort(400)

    data = pd.read_json('data.json')
    label_encoder = preprocessing.LabelEncoder()

    X = data.iloc[:,3:9]
    y = label_encoder.fit_transform(data.iloc[:,0])

    print(data.sort_values(by=['pace']))

    model = svm.SVC()
    model.fit(X, y)
    print(model.predict(0.33))

    return make_response(jsonify( {'response': 'success'} ))
    
# Handling errors produced from incorrect API calls
@app.errorhandler(400)
def bad_request(error):
    return make_response(jsonify( { 'error': 'Bad request' } ), 400)

@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify( { 'error': 'Not found' } ), 404)

if __name__ == '__main__':
    app.run(port=8000, debug=False)