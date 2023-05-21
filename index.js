const { parse } = require('csv-parse')
const fs = require('fs')

const MINIMUM_FLUX = 0.36
const MAXIMUM_INSOLATION_FLUX = 1.11
const MINIMUM_PLANET_RADIUS = 1.6

function isHabitable (planet) {
  const planetStatus = planet.koi_disposition
  const insolationFlux = planet.koi_insol
  const planetRadius = planet.koi_prad
  return planetStatus === 'CONFIRMED' &&
    insolationFlux > MINIMUM_FLUX && insolationFlux < MAXIMUM_INSOLATION_FLUX &&
    planetRadius > MINIMUM_PLANET_RADIUS
}

function init () {
  const habitablePlanets = []

  fs.createReadStream(
    'kepler_data.csv'
  ).pipe(parse({
    comment: '#',
    columns: true,
  })
  ).on('data', (data) => {
    if (isHabitable(data)) {
      habitablePlanets.push(data) 
      console.log(data.kepler_name) 
    }
  }
  ).on('end', () => {
    console.log(`${habitablePlanets.length} habitable planets found!`) // logs the number of planets found once the event ends
  }
  ).on('error', (err) => {
    throw new Error(err)
  })
}

init()
