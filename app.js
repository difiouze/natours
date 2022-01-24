const express = require('express');
const app = express();
// Middleware//
app.use(express.json());

const fs = require('fs');

const port = 3000;

// la méthode 'parse' converti un json en objet javascript  
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

// Get request //

app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    });
})

// Get request by ID //

app.get('/api/v1/tours/:id', (req, res) => {
    console.log('get tour id', req.params);

    // Converti l'id qui est à la base une string en nombre
    // const id = req.params.id * 1;
    const id = parseInt(req.params.id);

    if(id > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })
    }

    const tour = tours.find(el => el.id === id);

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    });
})

// Post Request//

app.post('/api/v1/tours', (req, res) => {
    //console.log(req.body);

    // On crée un nouvel ID et on le stoque dans un nouvel objet
    // qui contient la requête envoyée
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({id: newId} ,req.body);

    // On pousse le nouvel objet dans le tableau
    tours.push(newTour);

    // la méthode 'stringify' converti un objet javascript en json
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: "success",
            data: {
                tour: newTour
            }
        })
    })

});

// Patch //

app.patch('/api/v1/tours/:id', (req, res) => {
    if(parseInt(req.params.id) > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })
    }

    res.status(200).json({
        status: "success",
        data: {
            tour: '<Updated tour here...>'
        }
    })
})


// Delete //

app.delete('/api/v1/tours/:id', (req, res) => {
    if(parseInt(req.params.id) > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })
    }

    res.status(204).json({
        status: "success",
        data: null
    })
})

// Listen //

app.listen(port, () => {
    console.log(`App running on port ${port}`);
})
