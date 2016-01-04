import storage from 'sails-service-storage';
import config from '../../config/services/storage';

export default storage('Amazon', config.services.storage.amazon);
// export default storage('local', config.services.storage);
