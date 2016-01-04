import Promise from 'bluebird';

export default {
  getUserSimple: (doc) => {
    return {
      id: doc.id,
      email: doc.email,
      name: doc.email.split('@')[0],
      desc: doc.desc,
      photos: doc.photos,
      roles: doc.roles,
      keywords: doc.keywords,
      actions: doc.actions,
      devices: doc.devices
    }
  },
  getChannelSimple: (doc) => {
    return {
      id: doc.id,
      type: doc.type,
      name: doc.name,
      desc: doc.desc,
      photos: doc.photos,
      keywords: doc.keywords,
      actions: doc.actions,
      devices: doc.devices
    }
  },
  getAddressFrom: (doc) => {
    return {
      address: doc.address,
      countryCode: doc.countryCode,
      countryName: doc.countryName,
      adminArea: doc.adminArea,
      locality: doc.locality,
      thoroughfare: doc.thoroughfare,
      featureName: doc.featureName,
      latitude: doc.latitude,
      longitude: doc.longitude    }
  },

  copyAddress: (doc, address) => {
    doc.address = address.address,
    doc.countryCode = address.countryCode,
    doc.countryName = address.countryName,
    doc.adminArea = address.adminArea,
    doc.locality = address.locality,
    doc.thoroughfare = address.thoroughfare,
    doc.featureName = address.featureName,
    doc.latitude = address.latitude,
    doc.longitude = address.longitude
  }

}
