#!/usr/bin/env python3

from flask import Flask, request, render_template, json, session
import requests
from models import *
import webbrowser
from random import randint

app = Flask(__name__, static_folder='src/static',
template_folder='public')

@app.route('/')
def index():
    return render_template('index.html')
