import actionUtil from 'sails/lib/hooks/blueprints/actionUtil';
import config from '../../config/connections';
import fileAdapter from 'skipper-s3';

/**
 * PhotoController
 * @description :: Server-side logic for manage photo
 */

let amazon = fileAdapter({
  key: 'AKIAIASRV25TIJNRVQEQ',
  secret: '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',
  bucket: 'umanji-0001'
});


export default {
  photo (req, res) {
    req.file('photo')
      .upload({
        adapter: amazon
      }, (error, uploadedFiles) =>{
        if(error) res.negotiate(error)
        res.ok({photo: uploadedFiles[0].fd})
      })
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
