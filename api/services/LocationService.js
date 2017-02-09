import config from '../../config/services/location';
import https from 'https';
import Promise from 'bluebird';

export default {
  getAddress: (point) => {
    return getAddressByTmap(point)
    .then(address => {
      if(address) {
        return new Promise((resolve, reject) => {
          resolve(address);
        })

      }else {
        return getAddressByGmap(point)
      }
    })
  }
};


function getAddressByGmap(point) {
  return new Promise((resolve, reject) => {
    let options = {
      host : 'maps.googleapis.com',
      port: 443,
      path : "/maps/api/geocode/json?latlng=" + point.latitude + "," + point.longitude+ "&key=AIzaSyCQCJnG4VyPK-kJy4-84xBGCRobhtKMQFE",
      method : 'GET',
      headers : {
        'Content-Type': 'application/json'
      }
    };

    https.request(options, function(response) {
      let body = '';
      response.on('error', e => { reject(e); });
      response.on('data', (chunk) => { body += chunk; });

      response.on('end', () => {
        if(body) {
          let address = JSON.parse(body).results[0];
/*
          let addressDoc = {
            address: address.formatted_address,
            countryCode: address.getCountryCode(),
            countryName: address.getCountryName(),
            adminArea: address.getAdminArea(),
            locality: address.getLocality(),
            thoroughfare: address.getThoroughfare(),
            featureName: address.getFeatureName(),
            latitude: point.latitude,
            longitude: point.longitude
          }
          */
          console.log("Paul addresDoc Gmap :: ", "LocationService ::Gmap address");

          let addressDoc;


          if(typeof address === "undefined"){
            addressDoc = {
                address: "sea",
                latitude: point.latitude,
                longitude: point.longitude
              }

          } else {
            // let arrayCount = Object.keys(address).length;
          let arrayCount = address.address_components.length;

          console.log("Paul addresDoc Gmap Array Count :: ", arrayCount);

            switch(arrayCount){
              case 2:
              addressDoc = {
                address: address.formatted_address,
                countryCode: address.address_components[arrayCount -1].short_name,
                countryName: address.address_components[arrayCount-1].long_name,
                adminArea: address.address_components[arrayCount-2].long_name,
                latitude: point.latitude,
                longitude: point.longitude
              }
              break;
              case 3:
              addressDoc = {
                address: address.formatted_address,
                countryCode: address.address_components[arrayCount -1].short_name,
                countryName: address.address_components[arrayCount-1].long_name,
                adminArea: address.address_components[arrayCount-2].long_name,
                locality: address.address_components[arrayCount-3].long_name,
                latitude: point.latitude,
                longitude: point.longitude
              }
              break;
              case 4:
              addressDoc = {
                address: address.formatted_address,
                countryCode: address.address_components[arrayCount -1].short_name,
                countryName: address.address_components[arrayCount-1].long_name,
                adminArea: address.address_components[arrayCount-2].long_name,
                locality: address.address_components[arrayCount-3].long_name,
                thoroughfare: address.address_components[arrayCount-4].long_name,
                latitude: point.latitude,
                longitude: point.longitude
              }
              break;
              case 5:
              addressDoc = {
                address: address.formatted_address,
                countryCode: address.address_components[arrayCount-1].short_name,
                countryName: address.address_components[arrayCount-1].long_name,
                adminArea: address.address_components[arrayCount-2].long_name,
                locality: address.address_components[arrayCount-3].long_name,
                thoroughfare: address.address_components[arrayCount-4].long_name,
                featureName: address.address_components[arrayCount-5].long_name,
                latitude: point.latitude,
                longitude: point.longitude
              }
              break;
              default:
              addressDoc = {
                address: address.formatted_address,
                countryCode: address.address_components[arrayCount-2].short_name,
                countryName: address.address_components[arrayCount-2].long_name,
                adminArea: address.address_components[arrayCount-3].long_name,
                locality: address.address_components[arrayCount-4].long_name,
                thoroughfare: address.address_components[arrayCount-5].long_name,
                featureName: address.address_components[arrayCount-6].long_name,
                latitude: point.latitude,
                longitude: point.longitude
              }

            }

            /*let addressDoc = {
              address: address.formatted_address,
              countryCode: address.address_components[4].short_name,
              countryName: address.address_components[4].long_name,
              adminArea: address.address_components[3].long_name,
              locality: address.address_components[2].long_name,
              thoroughfare: address.address_components[1].long_name,
              featureName: address.address_components[0].long_name,
              latitude: point.latitude,
              longitude: point.longitude
            }*/
          }

          if(typeof addressDoc != 'undefined'){
            // console.log("Paul addresDoc :: ", addressDoc);

            resolve(addressDoc);
          }

        } else {
          resolve('');
        }
      });

}).end();
})
}


function getAddressByTmap(point) {
  // console.log("Paul", "I am in ADDRESS!!!!!!!!!!!");
  return new Promise( (resolve, reject) => {
    //console.log("long"+point.longitude+" lati"+point.latitude);
    let options = {
      host : 'apis.skplanetx.com',
      port: 443,
      path : "/tmap/geo/reversegeocoding?lon="+ point.longitude + "&lat=" + point.latitude + "&version=1&appKey=260efe0d-c6ab-3d4b-a97a-efdb7a4528a5&coordType=WGS84GEO&addressType=A10",
      method : 'GET',
      headers : {
        'Content-Type': 'application/json',
        'access_token': '68b558b6-a032-4c07-846b-ec0379fdd229'
      }
    };

    https.request(options, function(response) {
      //console.log("statusCode: " + response.statusCode);

      let body = '';
      response.on('error', e => { reject(e); });
      response.on('data', (chunk) => {
        body += chunk;
        //console.log(body);
      });

      response.on('end', () => {
        if(body) {
        //  body = parseForErrorData_01(body);

          let address = JSON.parse(body).addressInfo;
          console.log("Paul :: ", "LocationService : getAddressByTmap");
          let addressDoc ;
          if(typeof address != 'undefined'){
            addressDoc = {
              address: address.fullAddress,
              countryCode: 'KR',
              countryName: '대한민국',
              adminArea: address.city_do,
              locality: address.gu_gun,
              thoroughfare: address.adminDong,
              featureName: address.bunji,
              latitude: point.latitude,
              longitude: point.longitude
            }
          } else {
            addressDoc = "sea";
          }

          resolve(addressDoc);
        } else {
          resolve('');
        }
      });

    }).end();

  })
}


function parseForErrorData_01(body) {
  body = body.replace(/: "",/g, ': " ",');
  body = body.replace(/"한국컴퓨터빌딩/g, '한국컴퓨터빌딩');
  body = body.replace(/""/g, '"');
  return body;
}
