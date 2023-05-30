# Bike App

## Brief description

This repository contains the backend and frontend components of a web application designed to display data from journeys made with city bikes in the Helsinki Capital area. The application allows users to import bike station and journey data and then explore various statistics through the web UI.

The backend of the application is implemented in TypeScript using Node.js and Express. It provides a RESTful API for fetching data from the database. The database used is PostgreSQL, which stores the journey and bike station data.

The frontend of the web application is developed using React.js.

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

### Troubleshooting

- If any part of the app fails to start, check that nothing else is using the following ports:
  - **8000** (server uses this port)
  - **5432** (database uses this port, exposed outside of docker so that server can access it even if ran outside container)
  - **3000** (react scripts serve frontend on this port)

---

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

---

## Known bugs, limitations and other TODOs

Due to discovering this pre-assignment only a few days before the deadline, there is plenty left undone I wish I had time to do.

| Type | Description                                                                                                                                             |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TODO | Ability to filter statistics calculations per month                                                                                                     |
| TODO | Tests to avoid regression when refactoring and adding new features &rarr; more confidence and speed in developing features                              |
| TODO | UI Error notifications. Idea: notification context that would allow displaying errors from anywhere in the app uniformly on top of the UI               |
| TODO | UI path mapping to pagination and filtering. Currently one cannot go to a certain list page through URL. E.g. bookmarking certain listing does not work |
| TODO | Both journey list and bike station lists have a lot in common. Probably room for refactoring the common parts into shared compoents                     |
| TODO | Mobile friendly UI. At the moment the UI does not scale, especially the tables                                                                          |
| TODO | Own README files for backend and frontend                                                                                                               |
| TODO | Caching. Currently, especially filtering sends a lot of requests to the backend despite debouncing. Data is anyway quite stable                         |
| TODO | Journey addition endpoint and corresponding UI                                                                                                          |
| TODO | Bike station addition endpoint and corresponding UI                                                                                                     |
| TODO | Document npm scripts to this readme or to frontend/backend specific readme                                                                              |

---

## Other notes

- The Google Maps feature on Bike station view might stop working at some point when I remove the API-key. One can supply a new one by defining REACT_APP_GOOGLE_MAPS_API_KEY in [./frontend/.env.development](./frontend/.env.development)