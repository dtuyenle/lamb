/** @module middlewares */

import Caching from './default/caching';
import ErrorHandler from './default/error-handler';
import RetrieveData from './default/retrieve-data';
import HeaderPreprocessor from './default/header-preprocessor';

export default {
  ...Caching,
  ...ErrorHandler,
  ...HeaderPreprocessor,
  ...RetrieveData,
};
