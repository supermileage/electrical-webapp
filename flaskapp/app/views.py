from flask import Flask, request, jsonify, make_response
import json
import requests
from .utils import *
from app import app
import csv
import io

@app.route('/api')
def home():
   return "hello world!"

@app.route('/api/query', methods = ['POST', 'GET'])
def query():
   req = request.get_json()
   if 'query' not in req:
      return 'Missing query', 400

   if (not req['query'].lower().startswith('select')) or ';' in req['query']:
      return 'Only SELECT operators allowed, no semicolons pls.'

   bq_res = bigquery(req['query'])
   if not bq_res.ok:
      return 'Query error: ' + bq_res.text, 500
   
   bq_res_data = bq_res.json()
   csv = format_csv(bq_res_data)
   return make_csv_response(csv)

