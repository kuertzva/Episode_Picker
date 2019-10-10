#!/usr/bin/env python3

from flask import Flask, request, render_template, json, session
import requests
from models import *
import webbrowser
from random import randint

app = Flask(__name__)

app = Flask(__name__, static_folder='build/static',
template_folder='build')

@app.route('/')
def index():
    return render_template('index.html')
