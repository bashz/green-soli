const parseLatLong = function (literalCoords) {
  let latLong = literalCoords.split(',')
  latLong = latLong.map(c => parseFloat(c))
  if (latLong.every(l => l && typeof l === 'number')) {
    console.log(latLong)
    return {
      lat: latLong[0],
      lng: latLong[1]
    }
  }
  return false
}

const coords2Distance = function (fromLat, fromLong, toLat, toLong) {
  console.log(fromLat, fromLong, toLat, toLong)
  const R = 6371
  const lat1 = fromLat * (Math.PI / 180)
  const lat2 = toLat * (Math.PI / 180)
  const deltaLat = (toLat - fromLat) * (Math.PI / 180)
  const deltaLong = (toLong - fromLong) * (Math.PI / 180)
  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(deltaLong / 2) * Math.sin(deltaLong / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

module.exports = {
  friendlyName: 'CreatePollution',
  description: 'Create pollution from raw entry',
  inputs: {
    type: {
      type: 'string',
      description: 'Pollution type.',
      required: true
    },
    // trip type
    geoFrom: {
      type: 'string',
      description: 'Address of the start of the trip.',
      required: false
    },
    geoTo: {
      type: 'string',
      description: 'Address of the end of the trip.',
      required: false
    },
    from: {
      type: 'string',
      description: 'Lat long string of the start location of the trip in xx,xx format.',
      required: false
    },
    to: {
      type: 'string',
      description: 'Lat long string of the end location of the trip in xx,xx format.',
      required: false
    },
    locomotive: {
      type: 'string',
      description: 'locomotive used for the trip.',
      required: false
    }
  },
  exits: {
    serverError: {
      responseType: 'serverError'
    },
    badRequest: {
      responseType: 'badRequest'
    },
    created: {
      responseType: 'created'
    }
  },
  fn: async function (inputs, exits) {
    let type = null
    let unit = 'Km'
    let amount = 0
    let co2Amount = 0
    let trees = 0
    let details = {}
    if (inputs.type === 'trip') {
      let from = { lat: 0, lng: 0 }
      let to = { lat: 0, lng: 0 }
      if ((!inputs.from && !inputs.geoFrom) || (!inputs.to && !inputs.geoTo)) {
        return exits.badRequest('For trip type, location `from` and location `to` must be provided')
      }
      if (!inputs.locomotive) {
        return exits.badRequest('For trip type, a locamotive must be provided')
      }
      if (inputs.from) {
        from = await sails.helpers.geoCode(inputs.from).tolerate(e => { sails.log.warn(e) })
      }
      if (inputs.to) {
        to = await sails.helpers.geoCode(inputs.from).tolerate(e => { sails.log.warn(e) })
      }
      if (inputs.geoFrom) {
        from = parseLatLong(inputs.geoFrom)
      }
      if (inputs.geoTo) {
        to = parseLatLong(inputs.geoTo)
      }
      if (!from || !to) {
        return exits.serverError(new Error('Impossible to determine location\'s latitude and longetude'))
      }
      amount = coords2Distance(from.lat, from.lng, to.lat, to.lng)
      type = await Type.findOne({ name: `${inputs.type}_${inputs.locomotive}` })
      co2Amount = type.co2Rate * amount
      trees = type.rate * amount
      details = JSON.stringify({
        from,
        to,
        goeFrom: inputs.geoFrom,
        geoTo: inputs.goeTo,
        locomotive: inputs.locomotive
      })
    } else {
      return exits.badRequest('requested type was not found')
    }
    const pollution = await Pollution.create({
      unit,
      amount,
      co2Amount,
      trees,
      details,
      type: type.id,
      user: this.req.userId
    }).fetch()
    return exits.created(pollution)
  }
}
