const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const express = require('express');
const router = express.Router();


const spec = swaggerJsDoc({
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Vidly',
            version: '1.0.0',
            description: 'A  movie rentals service developed during Mosh\'s NodeJS tutorial'
        },
        securityDefinitions: {
            jwt: {
              type: 'apiKey',
              name: 'x-auth-token',
              in: 'header',
            },
          },
          servers:[
              {
                  url: 'http://localhost:3000'
              }
          ]
    },
    apis:['./routes/*.js', './models/*.js']
})

router.get('/json', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(spec)
  })
router.use('/', swaggerUi.serve, swaggerUi.setup(spec));

module.exports = router;