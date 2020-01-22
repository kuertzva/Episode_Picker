#!/usr/bin/env python3

"""
This is the 4th iteration of episode_generator functionality. This retains
the functional programming of v3, while catering to the fact that this is now
a single page app. Test ability will also be a priority
"""

import requests
from sys import argv, version
import webbrowser
import bs4
from math import ceil
from random import choices

def get_image(id, debug = False):
    """
    CURRENTLY UNCHANGED FROM V3

    Acquire an image for either a show or episode.

    Note: There is a series of values at the ends of the titles that appears
    to specify it is a smaller version of a larger image. When this is
    removed, full size image can be accessed. I don't completely understand
    this mechanism (do the extra characters specify a separate copy of the
    original image or do they make the original image smaller?)
    """

    if debug:
        print("begin get_image()")
        print(f"link: {id}")

    req = requests.get("https://www.imdb.com" + id)
    show_soup = bs4.BeautifulSoup(req.text, features="html.parser")

    # access poster poster_div
    try:
        poster_div = show_soup.select(".poster")[0]
    except:
        return None

    image_src = poster_div.select("a > img")[0].get("src")

    # chop size specifier off file name
    return image_src[0:-27] + ".jpg"

def make_search_URL(query, page, length, debug):
    """
    Format string for insertion into a IMDB URL
    """

    # example path
    #https://www.imdb.com/search/title/?title=test&title_type=tv_series&view=simple&count=5

    if debug:
        print("make_search_URL")

    # scrub search term for imdb
    formatted_term = "+".join(query.split())

    # add page information to search term
    if page > 0:
        page_specifier = f"&start={ (page * length) + 1 }"
    else:
        page_specifier = ""

    # get BeautifulSoup data for search term
    search_URL = f"https://www.imdb.com/search/title/?title={formatted_term}&title_type=tv_series&view=simple&count={length}{page_specifier}"

    if debug:
        print(f"search_URL: {search_URL}")

    return search_URL

def cook_soup(url):
    """
    make a BS4 object
    """

    return bs4.BeautifulSoup(requests.get(url).text, features="html.parser")

def get_show(id, debug):
    """
    takes imbd id and retrieves a title and image
    """

    if debug:
        print("begin get_show()")
        print(f"link: {id}")

    req = requests.get("https://www.imdb.com" + id)
    show_soup = bs4.BeautifulSoup(req.text, features="html.parser")

    #get title
    title_wrapper = show_soup.select(".title_wrapper")
    header = title_wrapper.select("h1")

    # access poster poster_div
    try:
        poster_div = show_soup.select(".poster")[0]
    except:
        return None

    image_src = poster_div.select("a > img")[0].get("src")


    ret = {"title": header.contents,"id": id, "image": image_src[0:-27] + ".jpg"}
    # chop size specifier off file name
    return ret



def calculate_max_page(results, length, debug):
    """
    determines the maximum number of pages through which a particular query
    can cycle
    """

    if debug:
        print("calculate_max_page()")
        print(results)

    max_pages = int(ceil(results / length))
    if debug:
        print(max_pages)

    return max_pages

def make_show_dict(element, debug):

    if debug:
        print(element)

    #assure that element accessable
    try:
        outer_span = element
    except:
        return False;

    a = outer_span.select('a')[0]

    if debug:
        print(a)

    id = a.get('href')

    s = {'title': a.contents[0],
        'id': id,
        'image': get_image(id, debug)
        }

    return s

def show_search(query, page, debug = False, length = 5):
    """
    Returns a list containing
    A) a list representing the next 5 shows. These are each represented by a
    dict structured with a title, an ID and an image, in that order.
    B) an indicating the maximum number of pages if first search (otherwise
    value is None)
    """

    # confirm function call
    if debug:
        print("show_search()")

    show = cook_soup(make_search_URL(query, page, length, debug))

    #get max_page
    if page < 1:

        # identify element that states range and number of results
        desc = show.select(".desc")[0]
        span = desc.select("span")[0].contents[0][0:-8]

        # extract number of results from show
        if span[:7] == "1-5 of ":
            span = span[7:]
        try:
            result_num = float(span)
        except:
            result_num = 0

        # calculate max_pages
        max_pages = calculate_max_page(result_num, length, debug)

    else:
        max_pages = None;

    # cultivate return list
    # this is reformatted for the compact page on the assumption
    # that it will load faster
    entries = show.select(".lister-item-header")

    if debug:
        print(len(entries))
        print(entries)

    search_results = [[], max_pages]

    for i in range(len(entries)):
        if debug:
            print(f"result: {i}")

        search_results[0].append(make_show_dict(entries[i], debug))

    if debug:
        print(f"search results length: {len(search_results[0])}")

    return search_results

def get_seasons(show_id, debug=False):
    """
    this uses the IMDB id to get the seasons in a shows

    This returns a list as opposed to an int due to the possibility of
    irregularities with IMDBs representations
    """

    if debug:
        print("begin get_seasons()")

    # get the BeautifulSoup data
    show_URL = "https://www.imdb.com/" + show_id + "episodes/"
    soup = cook_soup(show_URL);

    # We are acquiring this data from a drop down, which the below line selects
    select_elem = soup.select('#bySeason')
    seasons = []
    # account for the possibility of a one season show
    if len(select_elem) == 0:
        seasons.append(1)
    else:
        # get contents of drop down
        options = select_elem[0].select('option')

        # add each season
        for season in options:
            seasons.append(season.get('value'))
        if debug:
            print(f"Seasons {seasons}")

    return seasons

def make_episode_dict(show_id, seasons, factor, debug):
    """
    makes a dictionary containing a list of episodes calls "episodes" and
    a list of weights based on ratings called "weights"
    """


    if debug:
        print("begin make_episode_dict()")
        print(f"Seasons: {seasons}")
        print(f"Factor: {factor}")

    episodes = {"episodes": [], "weights": []}

    #this is the url that will be modified to access individual seasons
    base_url = f"https://www.imdb.com/{show_id}episodes?season="

    if debug:
        print(f"Base URL: {base_url}")

    # iterate through seasons
    for season in seasons:
        if debug:
            print(seasons)
        season_url = base_url + season
        season_soup = bs4.BeautifulSoup(requests.get(season_url).text, features="html.parser")
        episode_divs = season_soup.select(".list_item")

        #iterate through episodes
        for i in range(len(episode_divs)):
            if debug:
                print(i)
            div = episode_divs[i]
            ep_link = div.select('strong > a')[0].get('href')
            rating_elem = div.select('.ipl-rating-star__rating')

            # excludes unrated episodes ensuring they have been airred
            if len(rating_elem) != 0:
                rating = float(rating_elem[0].contents[0])

                #add episode
                episodes["episodes"].append({"id": ep_link,
                                    "season": int(season),
                                    "number": i + 1,
                                    "rating": rating})

                # add weight if there is a factor selected
                if factor != 0:
                    weight = rating ** factor
                    episodes["weights"].append(weight)
                    if debug:
                        print(f"weight: {weight}")

    return episodes

def pick_episode(episodes, debug):
    """
    picks random episode based on weighted random pick
    """

    if debug:
        print("begin pick_episode()")

    if debug:
        print(episodes)

    # pick episodes
    # if factored
    if len(episodes["weights"]) != 0:
        e = choices(episodes["episodes"],
                    weights = episodes["weights"])[0]
    # otherwise
    else:
        choice = choices(episodes["episodes"])
        print(choice)
        e = choices(episodes["episodes"])[0]

    return e

def create_episode(episode, debug=False):
    """
    Gathers necessary information about the episode and returns as dict

    {"title": , "summary": , "image": , "id": , "season": , "number": , "rating"}
    """

    # get BeautifulSoup data for extracting details
    episode_url = "https://www.imdb.com/" + episode["id"]
    episode_soup = bs4.BeautifulSoup(requests.get(episode_url).text, features="html.parser")

    #get title
    title_wrapper = episode_soup.select(".title_wrapper")[0]
    episode["title"] = title_wrapper.select("h1")[0].contents[0].replace(u'\xa0', ' ')

    #get summary
    episode["summary"] = episode_soup.select(".summary_text")[0].contents[0].replace(u'\n', ' ')

    #get image
    episode["image"] = get_image(episode["id"], debug)

    return episode

def make_episode(show_id, seasons, factor, debug=False):
    """
    takes show_id, seasons and rating factor as inputs and returns an episode
    """

    if debug:
        print("begin make_episode()")
        print(seasons, factor)

    #cultivate list of episodes ratings
    episode_list = make_episode_dict(show_id, seasons, factor, debug)

    #pick an episode
    episode = pick_episode(episode_list, debug)

    #gather episode information & return
    return create_episode(episode, debug)
