const { parse } = require('csv-parse');
const fs = require('fs');

let result = [];

const isHabitable = (planet) => {
    return planet['koi_disposition'] === 'CONFIRMED' 
        && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6;
    }

const myFile = fs.createWriteStream('habitable-planets.txt');

fs.createReadStream('exoplanets.csv')
    .pipe(parse({
        comment: '#',
        columns: true
    }))
    .on('data', (data) => {
        if (isHabitable(data)) {
            result.push(data);
        }
    })
    .on('end', () => {
        result = result.map(planet => planet.kepler_name);
        console.log(result);
        console.log(result.length);

        try {
            myFile.write(result.toString());
        } catch (e) {
            console.log(e);
        } finally {
            myFile.close();
        }
    })
    .on('error', (err) => {
        console.log(err);
    });
