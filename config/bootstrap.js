import fs from 'fs';

/**
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 * @param {Function} cb This function should always be called, so DON'T REMOVE IT
 */

export default {
  bootstrap: cb => {
    let dir = '.tmp';
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }

    let uploadDir = '.tmp/uploads';
    if (!fs.existsSync(uploadDir)){
      fs.mkdirSync(uploadDir);
    }

    cb();
  }
}
