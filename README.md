## Episode Picker

This is an in progress personal project. As of now, the core functionality appears to work just fine, but other features like the suggestions are more of a prototype at this stage. While unfinished, I am currently setting aside this project to learn other projects.

It would be greatly appreciated if you send any bugs to vincent.kuertz@gmail.com.

### How to use

The search bar will run a search in IMDB. This search is fairly finicky. It requires full words and is unforgiving towards misspeelings.

This will then provide a series of five results. More results can be received by pressing the button at the bottom of the page. 

On selection of a show, you can then decide which seasons will be eligible for selection and whether to weight the selection towards selecting more highly rated episodes (based on IMDBs ratings).

Once an episode is selected, buttons will provide you the options of A) getting a different episode using the same parameters and B) changing your parameters.

The front page will also provide suggestions. Recent searches are the 10 most recent shows by the current user (recorded in SQL and retrived with a cookie that lasts 90 days) and will save the rating factor and active seasons of the most recent search. 

Popular searches are the 10 most popularly searched shows by all users with nothing saved.


### How it's made

The front end is a create-react-app which uses jQuery to make asynchronous calls to the server. The backend is a python/flask app. It gathers information about the shows/episodes using beautifulsoup4 webscraping. The searches are saved to a PostgreSQL database using flask-SQLAlchemy.


### What's next?

Unfortunately, the coding became more and more sloppy and less commented as I approached my limitations. My first priority will be to reorganize and add comments. 

After that, I want to add the ability to navigate the app using the address route. That way a user can bookmark the episode page and will be able quickly reuse later.
