#!/usr/bin/env python3

from flask import Flask, request, render_template, json, session, jsonify
import requests
from models import *
import webbrowser
from random import randint

app = Flask(__name__, static_folder='build/static',
template_folder='build')
#app.secret_key = os.environ.get('SECRET_KEY', None)
app.secret_key = "placeholder"
dbg = True

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/hi')
def say_hi():
    return jsonify('Hey there buddy! Looks like your ajax works.')

@app.route('/q=<path:query>')
def initialize_query(query):

    session['query'] = query
    session['q_page'] = 0

    return jsonify(True)

@app.route('/search_batch')
def run_search():

    if 'query' not in session:
        return jsonify(False)

    # gather data
    r = show_search(session['query'], session['q_page'], dbg, 5)

    # set max_page if necessary
    if (r[1]):
        session['max_page'] = r[1]

    for i in r[0]:
        print(i)

    #increment page
    session['q_page'] += 1

    return jsonify(r[0])
