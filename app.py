#!/usr/bin/env python3

from flask import Flask, request, render_template, json, session, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
import requests
import os
from models import *
from database import *
#from sql_models import *
import webbrowser
from random import randint
import datetime

app = Flask(__name__, static_folder='build/static',
template_folder='build')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
#app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:8008@localhost/EpPicker'
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
app.secret_key = os.environ.get('SECRET_KEY', None)
db = SQLAlchemy(app)
dbg = False

# SQL classes
class Show(db.Model):
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    title = db.Column(db.String(128), nullable=False)
    link = db.Column(db.String(17), unique=True, nullable=False)
    image = db.Column(db.String(128))
    searches = db.Column(db.Integer, nullable=False)
    runs = db.relationship('Run', backref=db.backref('show', lazy=True))


class Run(db.Model):
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    cookie = db.Column(db.Integer, nullable=False)
    show_id = db.Column(db.Integer, db.ForeignKey('show.id'), nullable=False)
    show = db.relationship('show', backref=db.backref('runs', lazy=True))
    seasons = db.Column(db.String(100), nullable=False)
    active = db.Column(db.String(100), nullable=False)
    rating_factor = db.Column(db.Float, nullable=False)
    time_stamp = db.Column(db.Time())

# routes

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/past_searches')
def top_shows():
    """
    retrieves the most popular shows from all users
    """

    return jsonify(get_shows())

@app.route('/past_runs')
def recent_runs():
    """
    retrieves the most recent shows for the current user if a user can be
    identified. Returns an empty list otherwise
    """

    print('begin recent_runs()')

    #attempt to get cookie
    user = request.cookies.get('vkeppicker')
    print(user)

    # if cookie is available
    if user:
        session['user'] = int(user)
        runs = get_runs(user)
        print(runs)
        return jsonify(runs)

    else:

        return jsonify([])

@app.route('/q=<path:query>')
def initialize_query(query):
    """
    sets the search term
    """

    session['query'] = query
    session['q_page'] = 0

    return jsonify(True)

@app.route('/search_batch')
def run_search():
    """
    retrieves next 5 shows from IMDB
    """

    # ensure there is a query
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

    more = (not session['max_page'] == session['q_page'])

    return jsonify([r[0], more])

@app.route('/details', methods=['POST'])
def get_details():
    """
    gets the seasons for the show and records details for database
    """

    if request.method == 'POST':
        session["link"] = request.form['show_id']
        session["title"] = request.form['title']
        session["image"] = request.form['image']
        session["seasons"] = get_seasons(session["link"], dbg)

        return jsonify(session["seasons"])
    else:
        return False

@app.route('/update_show')
def record_show():
    """
    updates show DB appropriately
    """
    print("record_show()")

    session["show_id"] = update_shows(
    {"title": session["title"], "link": session["link"], "image": session["image"]}
    )

    return("recorded")



@app.route('/episode', methods=['POST'])
def get_episode():
    """
    records information for database and returns a random episode
    """

    if request.method == 'POST':
        session["active"] = request.form.getlist('season_list[]')
        session["rating_factor"] = float(request.form['ratingFactor'])
        episode = make_episode(session['link'], session["active"], session["rating_factor"], dbg)

        return jsonify(episode)

    else:
        return False

@app.route('/update_runs')
def record_run():
    """
    records run into database
    """


    print('begin record_run()')
    if 'user' not in session:
        #get highest existing user
        new_cookie = str(get_new_user())
        print("new_cookie: " + new_cookie)
        print("got da cookie")

        #set cookie
        resp = make_response("set cookie")
        print("made response")
        resp.set_cookie('vkeppicker', new_cookie)
        print("SET DA COOKIE")
        session['user'] = int(new_cookie)
    else:
        resp = "blank"

    if "show_id" not in session:

        session["show_id"] = get_show_id(session["link"])


    update_runs({
        "user": session['user'], "show_id": session["show_id"],
        "seasons": session["seasons"], "active": session["active"],
        "rating_factor": session["rating_factor"]
    })

    print("UPDATED RUNS")


    return resp




def scream():
    print("AHHHHAFUCKFUCKFUCKIJUSTWANTTODIE")

if __name__ == '__main__':
    app.run()
