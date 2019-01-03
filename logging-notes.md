# How am i going to implement logging?

Some quick notes to clear the brain..

## Logger

Winston looks good, 1.5m weekly downloads. Bunyan seemed popular but far less downloads..  
Good documentation.  
I can see support for Graylog / Cloudwatch, although i want to see if i can get it talking to slack... :D (might do both)

## What do i want to log?

### Debugging level

Probably everytime a request to the API is made, log what the request is and all the details associated with the request.  
I should also probably log what the response was, so that i can "debug" if any problems occur?

`Log level | Timestamp | Message` - I think this is all that I may need? Come back to this..

### Error level

Maybe these are just logs of the error handling i already have in place. So the same as the debug level logger but tailored for 400's 404s etc...

## Plan

Get basic logging working in my dev environment.  
Log things to both stdout and a json file stored locally.  
Establish two different logging levels - make sure correct logging level is set on npm start

### Random thoughts

I don't forsee too many challenges so far, but my biggest worry is dynamically changing logging level when live... work this out later.  
Doesn't look too difficult to implement two different logging levels.  
Can use process.env to change the logging levels, not sure how i can do this when live yet (and if this is something that should even be done)

### Updates

16:20 - tried really hard to use a middleware wrapper for express / winston so that I can just log all requests / responses in a couple of lines.  
Can't for the life of me work out why this isn't working, going to have to do this in a less DRY method but should still be ok...
This is also really annoying because the expressWinston package also measured response time which is obviously a really good metric to log.. grrr.

Might try to come back to this.

Overall though, i can log to file and console, under two different logging levels, tomorrow will be spent getting this tied to graylog / other third parties.

17:26 - ok all the logging is in place, its a bit wet atm so make DRY tomorrow..
