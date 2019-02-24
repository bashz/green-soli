const https = require('https')
const qs = require('querystring')

function initGeoCoder(timeout) {
  sails.log.info('initializing geocoder')
  return function (address) {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'GET',
        hostname: 'maps.googleapis.com',
        port: 443,
        timeout,
        path: '/maps/api/geocode/json',
        qs: {
          address: address.replace(/\s+/g, '+'),
          key: sails.config.geocoder.apiKey
        },
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Accept: 'application/json'
        }
      }

      options.path += '?' + qs.stringify(options.qs)

      const req = https.request(options, function (res) {
        let body = ''
        res.setEncoding('utf8')
        res.on('data', function (chunk) {
          body += chunk
        })
        res.on('end', function () {
          let response = {}
          try {
            response = JSON.parse(body)
          } catch (e) {
            return reject(e)
          }
          // if (response.error)
          //   return reject(new Error(response.status))
          return resolve(response)
        })
      })
      req.on('error', function (err) {
        return reject(err)
      })
      req.end()
    })
  }
}

const geoCoder = initGeoCoder(sails.config.geocoder.timeout)

module.exports = {
  friendlyName: 'Geo code',
  description: 'Geo code an address into lat long object',
  inputs: {
    address: {
      type: 'string',
      description: 'Human readble address of a location.',
      required: true
    }
  },
  exits: {
    success: {
      outputFriendlyName: 'GeoCode resolved',
      outputDescription: 'Successfully geocoded, returning latlong object.'
    },
    error: {
      outputFriendlyName: 'Error while geoCoding',
      outputDescription: 'Something wrong happened while trying to geocode.'
    },
    ZERO_RESULTS: {
      outputFriendlyName: 'GeoCode zero results',
      outputDescription: 'The reverse geocoding was successful but returned no results. This may occur if the geocoder was passed a latlng in a remote location.'
    },
    OVER_QUERY_LIMIT: {
      outputFriendlyName: 'GeoCode over query limit',
      outputDescription: 'You are over your quota.'
    },
    REQUEST_DENIED: {
      outputFriendlyName: 'GeoCode request denied',
      outputDescription: 'The request was denied. Possibly because the request includes a result_type or location_type parameter but does not include an API key or client ID.'
    },
    INVALID_REQUEST: {
      outputFriendlyName: 'GeoCode invalid request',
      outputDescription: 'The query (address, components or latlng) is missing or an invalid result_type or location_type was given.'
    },
    UNKNOWN_ERROR: {
      outputFriendlyName: 'GeoCode unkown error',
      outputDescription: 'The request could not be processed due to a server error. The request may succeed if you try again.'
    }
  },
  async fn (inputs, exits) {
    let geoResponse = null
    try {
      geoResponse = await geoCoder(inputs.address)
    } catch (e) {
      return exits.error(e)
    }
    if (geoResponse.error_message) {
      if (exits[geoResponse.status]) {
        return exits[geoResponse.status](geoResponse.error_message)
      }
      return exits.error(geoResponse.error_message)
    }
    if (geoResponse.results.length && geoResponse.status === 'OK' && geoResponse.results[0].geometry && geoResponse.results[0].geometry.location) {
      return exits.success(geoResponse.results[0].geometry.location)
    }
    return exits.error(new Error('Malformed geoCoder response!'))
  }
}

