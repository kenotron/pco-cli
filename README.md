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

## Using a PAT in PCO REST API

To use the REST API, all you need is to supply the HTTP headers with a magical auth header:

> encodedToken = base64(applicationId + ":" + secret)

```
Authorization: Basic encodedToken
```

There is an API explorer, but one can learn a LOT by using a dedicated REST API tool to set your own headers, etc.:
https://insomnia.rest/download

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

## Add a .env file with PAT

For security, you need your own developer account key here:
https://api.planningcenteronline.com/oauth/applications

Create a PAT on the 2nd section. This will come in the form of an application ID and a secret. In the HTTP sense, the application ID is your **username** and the secret is the **password**.

In the playground, you can get started by copying the `.env.sample` to `.env`, and then substituting the right value:

```js
PCO_APPLICATION_ID=[what you get from application ID]
PCO_SECRET=[what you get from secret]
```

After saving this file, then you're ready to try using the playground scripts to interact with the sample church data.

## Running the sample playground

```
yarn start
```

