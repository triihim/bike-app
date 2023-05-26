import { tryParseInt, tryParseNonEmptyString } from './util';

class AppConfig {
  get ENV() {
    return tryParseNonEmptyString(process.env.ENV, 'Parsing process.env.ENV');
  }

  get DB_NAME() {
    return tryParseNonEmptyString(process.env.DB_NAME, 'Parsing process.env.DB_NAME');
  }

  get DB_USER() {
    return tryParseNonEmptyString(process.env.DB_USER, 'Parsing process.env.DB_USER');
  }

  get DB_PASSWORD() {
    return tryParseNonEmptyString(process.env.DB_PASSWORD, 'Parsing process.env.DB_PASSWORD');
  }

  get DB_HOST() {
    return tryParseNonEmptyString(process.env.DB_HOST, 'Parsing process.env.DB_HOST');
  }

  get DB_PORT() {
    return tryParseInt(process.env.DB_PORT, 'Parsing process.env.DB_PORT');
  }

  get DATA_IMPORT_BUFFER_SIZE() {
    return tryParseInt(process.env.DATA_IMPORT_BUFFER_SIZE, 'Parsing process.env.DATA_IMPORT_BUFFER_SIZE');
  }

  get SERVER_PORT() {
    return tryParseInt(process.env.SERVER_PORT, 'Parsing process.env.SERVER_PORT');
  }
}

export default new AppConfig();
