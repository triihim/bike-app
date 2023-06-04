import express, { Express, Request, Response } from 'express';
import AppConfig from '../config';
import bikeStationRouter from './routers/bikeStationRouter';
import { errorHandler } from './middleware/errorHandler';
import journeyRouter from './routers/journeyRouter';
import cors from 'cors';
import { initialiseDatabase } from '../database/initialisation';
import { AppDataSource } from '../database/dataSource';
import http from 'http';

export interface ServerConfiguration {
  csvRootFolderPath: string;
}

export class Server {
  private _app: Express;
  private _server: http.Server;
  private _configuration: ServerConfiguration;
  private _initialised: boolean;

  constructor(configuration: ServerConfiguration) {
    this._configuration = configuration;
    this._initialised = false;
  }

  // Exposed for testing
  get instance() {
    return this._app;
  }

  async start() {
    await this.initialise();
    this._initialised = true;
    this._server = this._app.listen(AppConfig.SERVER_PORT, () =>
      console.log(`Server running on port ${AppConfig.SERVER_PORT}`),
    );
  }

  shutdown() {
    return new Promise<void>((resolve, reject) =>
      this._server.close(() => {
        return AppDataSource.destroy()
          .then(() => resolve())
          .catch(() => reject());
      }),
    );
  }

  private handleInitialisationStatusRequest = (req: Request, res: Response) => {
    res.json({ initialised: this._initialised });
  };

  private async initialise() {
    this._app = express();
    this._app.use(cors());
    this._app.use(express.json());
    this._app.use('/bike-stations', bikeStationRouter);
    this._app.use('/journeys', journeyRouter);
    this._app.get('/initialisation-status', this.handleInitialisationStatusRequest);
    this._app.use(errorHandler);
    await initialiseDatabase(this._configuration.csvRootFolderPath);
  }
}
