import actionUtil from 'sails/lib/hooks/blueprints/actionUtil';
import config from '../../config/connections';
import fileAdapter from 'skipper-s3';
import storageService from '../services/StorageService';
import gm from 'gm';


var Writable = require('stream').Writable;

let receiver = new Writable({objectMode: true});
receiver._write = function(file, enc, cb) {
  gm(file)
    .autoOrient()
    .write('.tmp/uploads/' + file.fd, function (err) {
      cb();
    });
};

/**amazon
 * PhotoController
 * @description :: Server-side logic for manage photo
 */

let amazon = fileAdapter({
  key: 'AKIAIASRV25TIJNRVQEQ',
  secret: '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',
  bucket: 'umanji-0001'
});

export default {
  photo (req, res, next) {
    req.file('photo')
      .upload(receiver, (error, files) =>{
        if(error) {
          res.negotiate(error)
        }
        let file = files[0];

        let fileName = null;
        let filePath = null;
        if(file.fd.indexOf('.tmp/uploads/') < 0) {
          fileName = file.fd;
          filePath = '.tmp/uploads/' + file.fd;
        }else {
          fileName = file.fd.substring(file.fd.indexOf('.tmp/uploads/')+13)
          filePath = '.tmp/uploads/' + fileName;
        }

        storageService
          .upload(filePath, 'umanji-0001:' + fileName)
          .then((a) => {
            res.ok({photo: fileName});
          })
          .catch(res.negotiate);
      })

    // req.file('photo')
    //   .upload({
    //     adapter: amazon
    //   }, (error, uploadedFiles) =>{
    //     if(error) res.negotiate(error)
    //     res.ok({photo: uploadedFiles[0].fd})
    //   })
  },

  get (req, res) {
    let params = actionUtil.parseValues(req);
    amazon
      .read(params.photo, (error, file) => {
        if(error) res.negotiate(error);
        res.ok(file);
      })
  }
}
