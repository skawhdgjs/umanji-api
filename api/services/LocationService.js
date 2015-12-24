import location from 'sails-service-location';
import config from '../../config/services/location';



export default {
  gmap: location('Google', config.services.location)
}
