#!/usr/bin/env python3

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import datetime

#from app import db, app


engine = create_engine('postgresql://postgres:8008@localhost/EpPicker')
#engine = create_engine(os.environ.get('DATABASE_URL'))
db = scoped_session(sessionmaker(bind=engine))

def get_new_user():
    print("begin get_new_user()")
    row = db.execute("SELECT * FROM run ORDER BY cookie desc LIMIT 1").fetchone()
    if not row:
        big_cookie = 0

    else:
        big_cookie = row.cookie

    print(big_cookie)

    return big_cookie + 1

def get_show_id(link):

    row = db.execute("SELECT id FROM show WHERE link= :link",
                        {"link": link}).fetchone()

    return row["show_id"]

def update_shows(show):
    print("begin update_shows()")
    print("show: ")
    print(show)

    #check if show for show already exists
    row = db.execute("SELECT * FROM show WHERE link= :link",
                        {"link": show["link"]}).fetchone()

    #if so, increment the number of shows
    if row != None:
        print("row: ")
        print(row)

        #update
        db.execute(
        "UPDATE show SET searches = :next WHERE id = :id",
        {"next": row["searches"] + 1, "id": row["id"]}
        )

        ret = row["id"]
        print(ret)

    #else, add as show
    else:

        db.execute(
        "INSERT INTO show (title, link, image, searches) VALUES (:title, :link, :image, :searches)",
        {"title": show["title"], "link": show["link"], "image": show["image"], "searches": "1"}
        )

        new = db.execute("SELECT * FROM show WHERE link= :link",
                            {"link": show["link"]}).fetchone()
        ret = new["id"]

    db.commit()



    return ret

def update_runs(run):

    print('begin update_runs()')
    print(run["user"])
    print(type(run["user"]))

    #check if run for show exists with matching user
    row = db.execute("SELECT * FROM run WHERE show_id= :show_id AND cookie= :cookie",
                        {"show_id": run["show_id"], "cookie": str(run["user"])}).fetchone()

    #if so, update seasons and rating factor
    if row != None:

        db.execute(
        "UPDATE run SET seasons = :seasons, active=:active, rating_factor = :rating_factor, time_stamp = :time_stamp WHERE id = :id",
        {"seasons" : run["seasons"], "active": run["active"], "rating_factor": run["rating_factor"], "time_stamp": datetime.datetime.now(), "id": row.id}
        )


    #else, add run
    else:
        #update
        db.execute(
        "INSERT INTO run (cookie, show_id, seasons, active, rating_factor, time_stamp) VALUES (:cookie, :show_id, :seasons, :active, :rating_factor, :time_stamp)",
        {"cookie": run["user"], "show_id": run["show_id"], "seasons": run["seasons"], "active": run["active"], "rating_factor": run["rating_factor"], "time_stamp": datetime.datetime.now()}
        )


    db.commit()

def unpack_show(row):

    return ({
        "title": row.title,"link": row.link,"image": row.image
    })

def unpack_seasons(seasons):

    format_seasons = seasons[1:-1].split(',')

    return list(map(int, format_seasons))


def get_shows():

    shows = []
    rows = db.execute("SELECT * FROM show ORDER BY searches desc LIMIT 10").fetchall()

    for row in rows:

        shows.append(unpack_show(row))

    return shows

def get_runs(user):
    print("begin get_runs()")
    print("user: " + user)

    runs = []
    rows = db.execute("SELECT * FROM run WHERE cookie=:cookie ORDER BY time_stamp desc LIMIT 10",
    {"cookie": user}).fetchall()

    print(len(rows))

    for row in rows:

        print(row)

        show = db.execute("SELECT * FROM show WHERE id= :id",
        {"id": row.show_id}).fetchone()

        print(show)

        unpacked_show = unpack_show(show)
        unpacked_show["seasons"] =  unpack_seasons(row.seasons)
        unpacked_show["active"] = unpack_seasons(row.active)
        unpacked_show["rating_factor"] = row.rating_factor

        runs.append(unpacked_show)

    return runs
