# Bike App

## Brief description

This repository contains the backend and frontend components of a web application designed to display data from journeys made with city bikes in the Helsinki Capital area.

The backend of the application is implemented in TypeScript using Node.js and Express. It provides a RESTful API for fetching data from the database. The database used is PostgreSQL, which stores the journey and bike station data.

The frontend of the web application is developed using React.js.

**App is testable at http://app1.triihimaki.com/ (Google Cloud Compute Engine)**

---

## Branches

| Branch                                                              | Description                                                  | Status                                                                                                                                                                                             |
| ------------------------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [main](https://github.com/triihim/bike-app/tree/main)               | Working version of the app                                   | [![Test backend](https://github.com/triihim/bike-app/actions/workflows/test-backend.yml/badge.svg?branch=main&event=push)](https://github.com/triihim/bike-app/actions/workflows/test-backend.yml) |
| [development](https://github.com/triihim/bike-app/tree/development) | Newest features, but not as thoroughly tested as main-branch | [![Test backend](https://github.com/triihim/bike-app/actions/workflows/test-backend.yml/badge.svg?branch=development)](https://github.com/triihim/bike-app/actions/workflows/test-backend.yml)     |

---

## Requirements to run

| Technology     | Version used | Link                                                             |
| -------------- | ------------ | ---------------------------------------------------------------- |
| Node.js        | v18.12.1     | https://nodejs.org/en/blog/release/v18.12.0                      |
| npm            | 8.19.2       | https://nodejs.org/en/blog/release/v18.12.0 (comes with Node.js) |
| Docker         | 23.0.5       | https://docs.docker.com/engine/install/                          |
| Docker Compose | v2.17.3      | https://docs.docker.com/compose/install/                         |

---

## Running the app

With the above requirements installed and from the root of the this repository run:

```bash
 # Starting the backend
 cd ./backend
 npm run dev:container:rebuild
```

```bash
 # Starting the frontend
 cd ./frontend
 npm install # required before running for the first time
 npm start
```

Alternatively one can use the provided startup scripts, which might require setting run permissions first.

- Startup script for PowerShell: [start_app.ps1](./start_app.ps1)
- Startup script for Linux/Mac: [start_app.sh](./start_app.sh)

To shutdown the backend, run the following:

```bash
# Stopping the containers
cd ./backend
npm run dev:container:shutdown
```

Frontend is shutdown by closing the terminal it runs in, or by stopping the process with CTRL-C.

### Useful backend scripts

| Script                 | Description                                                                                                                    |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| dev:container:rebuild  | Rebuilds the backend, but does not clean the database. Run this after making changes to the backend code                       |
| dev:container          | Starts the backend (db and server) in a container without rebuilding                                                           |
| dev:container:shutdown | Shuts down the container started by the above scripts                                                                          |
| dev:server             | Runs the server with [ts-node](https://www.npmjs.com/package/ts-node) instead of a container, use this for faster development  |
| dev:db                 | Starts only the database in a container, run this before the above _dev:server_ if you want to still have a database available |
| dev:db:clean           | Shuts down the backend and cleans all data from the database                                                                   |

### Troubleshooting

- If any part of the app fails to start, check that nothing else is using the following ports:

  - **8000** (server uses this port)
  - **5432** (database uses this port, exposed outside of docker so that server can access it even if ran outside container)
  - **3000** (react scripts serve frontend on this port)

- If no data is shown in the client on first startup, it may be due to the data import still running on the server side. Data importing can take time, give it a few minutes and refresh the page.

---

## Running the tests

Currently, there are tests only for the backend at [./backend/test/](./backend/test/)

```bash
# To run the tests
cd ./backend
npm install # required before running for the first time
npm run test:withdb
```

## Data importing

**DISCLAIMER**: I took liberty to make some assumptions on what I consider valid data and what gets imported into the database :grin:
Details on parsing can be found under:

- [./backend/src/bike_stations/csvMapping.ts](./backend/src/bike_stations/csvMapping.ts)
- [./backend/src/journeys/csvMapping.ts](./backend/src/journeys/csvMapping.ts)

To initialize the database with bike stations and journeys from csv files, place the csv files to

- [/backend/data/bike_stations](/backend/data/bike_stations)
- [/backend/data/journeys](/backend/data/journeys)

**The application will read all csv files from those folders on startup**, and attempt to parse and import them into the database. However **if the database already has either bike stations or journeys, the import step will be skipped**. Once imported data can be deleted by running the following:

```bash
# To clean up the database run
cd ./backend
npm run dev:db:clean
```

If the data import feels slow, one can test changing the following environment variables in [./backend/environments/development.env](./backend/environments/development.env)

1. DATA_IMPORT_BUFFER_SIZE
2. DISABLE_LOGGING_DURING_DATA_IMPORT

There is mock data in the csv folders [/backend/data/bike_stations](/backend/data/bike_stations) and [/backend/data/bike_stations](/backend/data/bike_stations), which can be removed if real world data is used. Real data is available from the following urls:

Journey csv files

1. https://dev.hsl.fi/citybikes/od-trips-2021/2021-05.csv
2. https://dev.hsl.fi/citybikes/od-trips-2021/2021-06.csv
3. https://dev.hsl.fi/citybikes/od-trips-2021/2021-07.csv

Bike station csv file

1. https://opendata.arcgis.com/datasets/726277c507ef4914b0aec3cbcfcbfafc_0.csv

---

## Known bugs, limitations and other TODOs

Due to discovering this pre-assignment only a few days before the deadline, there is plenty left undone I wish I had time to do.

| Type | Description                                                                                                                                             |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TODO | Ability to filter statistics calculations per month                                                                                                     |
| TODO | More tests to avoid regression when refactoring and adding new features &rarr; more confidence and speed in developing features                         |
| DONE | ~~UI Error notifications. Idea: notification context that would allow displaying errors from anywhere in the app uniformly on top of the UI~~           |
| TODO | UI path mapping to pagination and filtering. Currently one cannot go to a certain list page through URL. E.g. bookmarking certain listing does not work |
| TODO | Both journey list and bike station lists have a lot in common. Probably room for refactoring the common parts into shared compoents                     |
| TODO | Mobile friendly UI. At the moment the UI does not scale, especially the tables                                                                          |
| TODO | Own README files for backend and frontend                                                                                                               |
| TODO | Caching. Currently, especially filtering sends a lot of requests to the backend despite debouncing. Data is anyway quite stable and hence cacheable     |
| TODO | ~~Journey addition endpoint and corresponding UI~~                                                                                                      |
| TODO | Bike station addition endpoint and corresponding UI                                                                                                     |
| TODO | Document npm scripts to this readme or to frontend/backend specific readme                                                                              |
| TODO | Remove bike station names from journey entity, id reference is enough and does not add duplicate information                                            |
| TODO | Configure nginx to always redirect to / due to frontend routing. Currently direct url access to anything else than / results to 404                     |

---

## Other notes

- The Google Maps feature on Bike station view might stop working at some point when I remove the API-key. One can supply a new one by defining REACT_APP_GOOGLE_MAPS_API_KEY in [./frontend/.env.development](./frontend/.env.development)
