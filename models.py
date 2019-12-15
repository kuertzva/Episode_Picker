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

def show_search(query, page, debug, length):
    """
    Returns a list containing
    A) a list representing the next 5 shows. These are each represented by a
    dict structured with a title, an ID and an image, in that order.
    B) an indicating the maximum number of pages if first search (otherwise
    value is None)
    """
    # example path
    #https://www.imdb.com/search/title/?title=test&title_type=tv_series&view=simple&count=5

    # confirm function call
    if debug:
        print("show_search()")

    # scrub search term for imdb
    formatted_term = "+".join(query.split())

    # add page information to search term
    if page > 0:
        page_specifier = f"&start={ (page * length) + 1 }"
    else:
        page_specifier = ""

    # get BeautifulSoup data for search term
    search_string = "https://www.imdb.com/search/title/?title=" + formatted_term + "&title_type=tv_series" + page_specifier + "&view=simple&count=5"
    if debug:
        print(f"search_string: {search_string}")
    search_soup = bs4.BeautifulSoup(requests.get(search_string).text, features="html.parser")

    #get max_page
    if page < 1:

        # identify element that states range and number of results
        desc = search_soup.select(".desc")[0]
        span = desc.select("span")[0].contents[0][0:-8]

        # get number of results
        if span[:7] == "1-5 of ":
            span = span[7:]
        try:
            result_num = float(span)
        except:
            result_num = 0

        # calculate max_pages
        max_pages = int(ceil(result_num / 5))
        if debug:
            print(result_num)
            print(max_pages)

    else:
        max_pages = None;

    # cultivate return list
    # this is reformatted for the compact page on the assumption
    # that it will load faster
    links = search_soup.select(".lister-item-header")

    if debug:
        print(len(links))
        print(links)

    search_results = [[], max_pages]

    for i in range(len(links)):
        if debug:
            print(f"result: {i}")

        try:
            outer_span = links[i]
        except:
            break

        a = outer_span.select('a')[0]

        if debug:
            print(a)

        link = a.get('href')

        s = {'title': a.contents[0],
            'link': link,
            'image': get_image(link, debug)
            }

        search_results[0].append(s)

    if debug:
        print(f"search results length: {len(search_results[0])}")

    return search_results
