# This is a little practice playground to interact with the Planning Center API

## Overview of Planning Center (PCO)
Planning Center exposes a SINGLE API endpoint that encompass the entire product line. There are samples about how to create integrations with the API:
https://github.com/orgs/planningcenter/repositories?q=pco_api

As we dig further, we tend to find that the developers at PCO favor a particular language - Ruby. I cannot directly infer their server stack - could be Rails or could be a mixture of different languages. My usual sniffing technique of looking at their career site didn't yield anything (no openings currently). So, my quick guess is just a wild guess; but it doesn't materially affect how people interact with a REST API.

## Tech Stack Overview

Cache: Amazon CloudFront

FrontEnd: React + Alt.js (flux)

## How to Auth with PCO REST API
Reference code on how to authenticate with the PCO API is here
https://github.com/planningcenter/developers



# This playground
There's just a bit of set up to get this playground set up. Make sure you have latest node.js setup:

* https://git-scm.com/ - install latest for platform
* https://nodejs.org/en/ - install the latest for your platform
* https://classic.yarnpkg.com - install the latest for your platform

## Clone & Install Some Dependencies 

```
git clone https://github.com/kenotron/playground-planning-center.git
cd playground-planning-center
yarn
```

## Running the sample playground

```
yarn start
```

