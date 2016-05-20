import actionUtil from 'sails/lib/hooks/blueprints/actionUtil';


export default function (req, res, next) {
  let params = actionUtil.parseValues(req);
  
  if(!params.id) {
    res.badRequest();
    return;
  }

  next();
}
