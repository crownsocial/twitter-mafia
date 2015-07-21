# Twitter-Mafia Docs

# Links:
### [Github Repo](https://github.com/nguyenalexander/twitter-analytics)

# Technologies used
* Sails Generate Auth used for creating local auth and oauth with twitter.
* twitter npm module used to interact with twitter api (from UserController (backend))
* Nodemailer and Cron used to time emails (as of right now, emails are sent when a user logs in with a twitter account.)
* Angular Charts.js used for rendering data.
* Momentjs used to format dates for easy accessibility (DD/MM/YY format) this will be important later. 
* Typical sails layout. Backend javascripts in /api, frontend javascripts in assets
* bootstrap for the css framework.


# Current functionality/flow
* Any can land on the dashboard page (everything is broken because current user is not yet defined)
* User can log in (twitter-oauth)
* logging in creates the following models:
	* user -> passport -> twitter_account
* upon login, pulls data from Twitter API.
* Saves twitter account info to -> twitter_account, tweet info to -> tweet, tweet collection info to -> tweetCollection.
* data can be rendered on the page, from local db.

# Model setup
* User > Passport
	* Twitter_Account (multiple)
		* Tweet Collection (assorted by MM/YY)
			* Tweets
		* Hashtag (tracked hashtags)
			* instance of tweet
		* Influencer (tracked influencer accounts)
			* influencer is an instance of Twitter_account
		* Follower
		* Friend (following)
		* Favorite
		
# Dashboard Components / Desired Functionality (TODO)

## content: 
* ### chart 1
	* total followers vs engagements
		* pull historical data, if we don't have it (avg followers from each month of past year)
		* take average # of engagements (likes + retweets + replies) per post from each month
		
* ### chart 2
	* total created tweets per month
* ### chart 3
	* engagements breakdown (average engagement for all posts dependant on type, i.e. did that post contain a link, image, trending hashtag?)
	
## audience:
* ### top words
	* top words in follower bios. function is already written for this, but as of now brings back trash words, e.g. 'i', 'the' etc.
* ### most frequently followed by followers
	* pull data from Follower -> Friend (nested)
* ### heatmap of followers
	* a bit tricky because most people don't include location info.
	
## trends:
* ### influencers
	* displays top post by each influencer (max 3 influencers, chosen by user)
* ### hashtags
	* displays top tweet of tracked hashtags (max 3 hashtags, chosen by user)
	
## email alert settings
* users will eventually be able to receive emails if:
	* their tweets receive an abnormal number (lower or higher) of engagements than usual. 
		* plan: will create a function that will take cumulative number of engagements, map it to a graph of standard deviation, and any tweet that is an outlier will trigger email alert
	* influencers post something with abnormal engagements
	* hashtag post has abnormal engagements
	* influx of followers
	* more to come.
	
## Our codebase:
### auth
* user can sign in locally, though for right now, functionality is limited to twitter-oauth users.
	* currentUser is accessible from the frontend through $rootScope.currentUser (app.js line 43) or the backend through req.session.user
* #### TODO:
	* Need to get local auth + connecting multiple twitter accounts

### front end controllers (ctrls):
* NavCtrl just shows login/signup modals and controls navbar anchor scrolling
* HomeCtrl controls everything on the dashboard.
	* initializes graphs
	* gets Twitter_Account + TweetCollection + Tweet object with currentUser.id (HomeCtrl.js line 85)
	* hits twitter api to 'update' user (nonfunctional), (HomeCtrl.js line 74))
	* sets and gets user's influencers (HomeCtrl.js line 95)
* ModalCtrl (badly named, should be AuthCtrl). self explanatory

### backend controllers:
* ##### AuthController created with passport
* ##### UserController - main functionality here	
	* index - retrieves all users
	* create - creates new user
	* update influencers - pulls parameters sent from HomeCtrl line 95 to update Twitter_Account model's influencers and sends it back.
	* #### retrieve - asynchronously:
		* finds Twitter_Account with req.session.user.id
		* populates twitterAccount(instance) tweetCollections
		* populates tweetCollections' tweets
		* sends back object with twitter_account and tweet_collection (populated)
	* ##### update - CALLBACK HELL to pull data from Twitter API
		* ##### getMyUser
			* hits api with screenname (from Passport model that is created with twitter oauth, line 558)
			* creates twitter_account with data pulled from twitter
			* calls getMyFollowers, storing results in object.myTwitterAccount
		* ##### getMyFollowers
			* hits api with twitterid (user_id)
			* retrieves followers in lists of 100
			* formats dates
			* pushes follower descriptions to wordCountArray helper method (audience -> topwords)
			* calls getMyTweets, storing results in object.myFollowers and object.wordCountArray
			
		* ##### getMyTweets
			* hits api with twitterid
			* gets tweets (amount defined in count: x parameter)
			* async call to:
				* go through each tweet in array of tweets (data)
				* take formatted date (MM/YY)
				* finds or create TweetCollection (associated to Twitter_Account and Tweet)
					* finds by MM/YY, if there is already a tweetCollection with that MM/YY, Tweet will be created associated to that TweetCollection
					* If TweetCollection is not found, TweetCollection is made, and Tweets are associated to that collection. 
				* pushes tweetCollection to object.myTweets
			* Then, marks the top tweet (through markTopTweets helper method)
			* calls getInfluencers, data passed through as object.myTweets, object.myTopTweet. 
		* ##### getInfluencers & getHashtags
			* self explanatory, same sort of process.
				
		
* ### View controller renders index.ejs and the viewcontroller.get serves to authenticate user.



