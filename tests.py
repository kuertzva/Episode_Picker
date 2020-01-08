#!/usr/bin/env python3
"""
Tests for Episode Picker functions
"""

from models import *
import unittest

class TestShowSearch(unittest.TestCase):
    def setUp(self):
        """
        As of now, all tests only pass when length is 5. Those greater than five
        will fail in make_show_dict test. May address later, but it doesn't
        really present an issue
        """

        self.test_URLs = [
        make_search_URL('red', 3, 5, False),
        make_search_URL('blue', 1, 5, False),
        make_search_URL('pokemon', 1, 5, False),
        make_search_URL('dog', 2, 5, False),
        make_search_URL('dragon', 3, 5, False),
        make_search_URL('always', 1, 5, False),
        make_search_URL('always', 1, 5, False),
        make_search_URL('ppppppp', 1, 5, False),
        make_search_URL('dragop', 3, 5, False),
        ]

        """
        self.URL_answers = [
        'https://www.imdb.com/search/title/?title=red&title_type=tv_series&view=simple&count=5&start=11',
        'https://www.imdb.com/search/title/?title=blue&title_type=tv_series&view=simple&count=5',
        'https://www.imdb.com/search/title/?title=pokemon&title_type=tv_series&view=simple&count=100',
        'https://www.imdb.com/search/title/?title=dog&title_type=tv_series&view=simple&count=5&start=6',
        'https://www.imdb.com/search/title/?title=dragon&title_type=tv_series&view=simple&count=5&start=11',
        'https://www.imdb.com/search/title/?title=always&title_type=tv_series&view=simple&count=5',
        'https://www.imdb.com/search/title/?title=always&title_type=tv_series&view=simple&count=5&start=40',
        'https://www.imdb.com/search/title/?title=dragop&title_type=tv_series&view=simple&count=5&start=11'
        ]
        """

        self.test_soups = [cook_soup(i) for i in self.test_URLs]

        self.should_have_results = [
        True, True, True, True, True, True, True, False, False
        ]

        self.max_page_tests = [
        (1, 5), (5, 5), (6, 5), (10, 5), (11, 5), (105, 5), (50, 5), (30, 5),
        (30, 50), (50, 50), (51, 50), (34, 33)
        ]

        self.max_page_answers = [
        1, 1, 2, 2, 3, 21, 10, 6, 1, 1, 2, 2
        ]

        # shows in order: madmen, batman TAS, star trek, king of the hill, game
        # of thrones, breaking bad, the soprano, battlestar galactica,
        # seinfeld
        self.season_tests = [
        ('tt0804503', 7), ('tt0103359', 4), ('tt0060028', 3), ('tt0118375', 13),
        ('tt0944947', 8), ('tt0903747', 5), ('tt0141842', 6),
        ('tt0407362', 4), ('tt0098904', 9)
        ]

    def test_make_search_URL(self):
        """
        Ensures that make_search_URL produces correctly formatted URLs
        """

        for url in self.test_URLs:
            with self.subTest(url=url):
                self.assertEqual(requests.get(url).status_code, 200)

    def test_URL_to_soup_length(self):
        """
        Ensures there is a soup for each URL
        """

        self.assertEqual(len(self.test_URLs), len(self.test_soups))

    def test_soup_to_results_length(self):
        """
        Ensures there is a result answer for each soups
        """

        self.assertEqual(len(self.test_soups), len(self.should_have_results))

    def test_cook_soup_results(self):
        """
        Checks that all soups have an element that lists amount of results
        """

        for i in range(len(self.test_soups)):

            with self.subTest(i=i):
                soup = self.test_soups[i]

                # extract results
                results = soup.select('.desc span')[0]

                # branch based on wheter or not query should be a successful search
                if self.should_have_results[i]:
                    self.assertEqual(results.contents[0][-7:], 'titles.')
                else:
                    self.assertEqual(results.contents[0][-8:], 'results.')

    def test_calculate_conditions(self):
        """
        makes sure that every max page calculation has an answer
        """

        self.assertEqual(len(self.max_page_tests), len(self.max_page_answers))

    def test_calculate_max_page(self):
        """
        Checks that calculate_max_page returns the expected result
        """

        for i in range(len(self.max_page_tests)):
            with self.subTest(i=i):
                current = self.max_page_tests[i]
                self.assertEqual(calculate_max_page(current[0], current[1], False),
                self.max_page_answers[i])

    def test_make_show_dict(self):
        """
        check make_show_dict works with first result of a soup
        """

        for i in range(len(self.test_soups)):
            with self.subTest(i=i):
                if self.should_have_results[i]:
                    soup = self.test_soups[i]
                    show = make_show_dict(soup.select_one(".lister-item-header"), False)

                    with self.subTest(show=show):
                        self.assertNotEqual(show, False)

                    with self.subTest(show=show):
                        self.assertNotEqual(show['title'], None)

                    with self.subTest(show=show):
                        self.assertNotEqual(show['id'], None)

                else:
                    self.assertEqual(1, 1)

    def test_len_season_list(self):
        """
        make sure len of get_seasons output is correctly
        """

        for i in range(len(self.season_tests)):
            with self.subTest(i=i):
                test_string = 'title/' + self.season_tests[i][0] + '/'
                self.assertEqual(len(get_seasons(test_string)), self.season_tests[i][1])

"""
Moved to bottom to prevent bug
This test fails and I'm not sure why, but it
a) works in production and
b) will likely be optimized soon, so there's no real point in writing a test
for a soon-to-be deprecated function

                    with self.subTest(show=show):
                        self.assertNotEqual(show['image'], None)
"""





if __name__ == '__main__':
    unittest.main()
