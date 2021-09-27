# This is a little practice playground to interact with the Planning Center API

## Overview of Planning Center (PCO)
Planning Center exposes a SINGLE API endpoint that encompass the entire product line. There are samples about how to create integrations with the API:
https://github.com/orgs/planningcenter/repositories?q=pco_api

As we dig further, we tend to find that the developers at PCO favor a particular language - Ruby. It seems the backend is written with Rails as well as the backed API. I find some evidence of this just poking at the main site a bit and finding some Rails variables being defined in the HTML's script tags.

## Tech Stack Overview

Cache: Amazon CloudFront

FrontEnd: React + Alt.js (flux)

BackEnd: Ruby on Rails

> Note: PCO is KIND enough to leave their sourcemaps in tact, so even when their code is mangled, the client side source code is entirely readable by the F12 devtools from modern browsers.

## How to Auth with PCO REST API
Reference code on how to authenticate with the PCO API is here
https://github.com/planningcenter/developers

There are 2 ways to authenticate against the PCO REST API:
1. via a Personal Access Token (PAT)
2. as an OAUTH application

The choice is really up to the use case. For example, if we're developing a script that would operate on a single organization (church), then the PAT (1) is a good idea. The token is issued as a developer account and can be thought of as a way to impersonate a real user to perform some automation.

The second way (2) is meant for third party services and applications to provide functionality for many churches. These integrations can themselves be products that make use of the PCO API. Most of what is needed within a single church probably does NOT need to use this kind of integration.


# This playground
There's just a bit of set up to get this playground set up. Make sure you have latest node.js setup:

* https://git-scm.com/ - install latest for platform
* https://nodejs.org/en/ - install the latest for your platform
* https://classic.yarnpkg.com - install the latest for your platform

The playground uses TypeScript and might grow to become a good starting point of PCO projects providing type safety in future developers' endeavors in trying to make automation for their own churches.

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

