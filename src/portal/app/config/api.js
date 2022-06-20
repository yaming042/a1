const config = require('./../../../config/config.json');
const apiPrefix = config.apiPrefix || '';

export const TEST_URL = `${apiPrefix}/test`;