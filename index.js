const { parse } = require('csv-parse')
const fs = require('fs')
const habitablePlanets = []

function isHabitable (planet) { 
  return planet.koi_disposition === 'CONFIRMED' &&
    planet.koi_insol > 0.36 && planet.koi_insol < 1.11 &&
    planet.koi_prad > 1.6
}

fs.createReadStream( // transforms the kepler_data.csv file into a readable stream
  'kepler_data.csv'
).pipe(parse({ // parses the stream into JSON
  comment: '#',
  columns: true
})
).on('data', (data) => {
  if (isHabitable(data)) {
    habitablePlanets.push(data) // filters the data based on the habitability criteria and pushes each chunk into the habitablePlanets array
    console.log(data.kepler_name) // logs each 'kepler_name' property from the stream, which corresponds to the planet name
  }
}
).on('end', () => {
  console.log(`${habitablePlanets.length} habitable planets found!`) // logs the number of planets found once the event ends
}
)
  .on('error', (err) => {
    console.log(err) // logs any error that may occur
  })
