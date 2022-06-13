import requests
import io
import csv
from flask import make_response

bq_url = 
api_key = 


def bigquery(query):
   json = {
      'query': query,
      'location': 'US'
   }
   headers = {
      'Content-Type': 'application/json',
      'Accept': '*/*',
      'x-api-key': api_key
   }
   return requests.post(bq_url, json=json, headers=headers)

def make_csv_response(csv):
    res = make_response(csv)
    res.headers["Content-Disposition"] = "attachment; filename=export.csv"
    res.headers["Content-type"] = "text/csv"
    return res

def format_csv(data):
    columns = list(data[0].keys())
    res_map = []
    # format data for csv writer
    for row in data:
        # properly format timestamps
        for column in columns:
            if type(row[column]) is dict:
                row[column] = row[column]['value']
        res_map.append(row)
    
    csv_string_io = io.StringIO()
    csv_writer = csv.DictWriter(csv_string_io, fieldnames = columns)
    csv_writer.writeheader()
    csv_writer.writerows(res_map)
    return csv_string_io.getvalue()

