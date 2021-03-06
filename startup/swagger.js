const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const express = require('express');
const router = express.Router();

/**
 * @swagger
 *   components:
 *      securitySchemes:
 *        JWTAuth:
 *          type: apiKey
 *          in: header
 *          name: x-auth-token
 *          description: json web token given when logged in
 */

const spec = swaggerJsDoc({ // defining swagger spec
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Vidly',
            version: '1.0.0',
            description: 'An imaginary  movie rentals service used to learn NodeJS. You need to use the register/logIn to get a valid jwt to use for authorization. Give user admin rights by setting "isAdmin: true" in db.',
            contact: {
                name: "Ilozulu Chuka",
                url: 'https://github.com/Veekthor'
            }
        }
    },
    apis:['./routes/*.js', './models/*.js','./startup/*.js']
})

router.get('/json', (req, res) => {
    res.header('Content-Type', 'application/json').send(spec);
  })
router.use('/', swaggerUi.serve, swaggerUi.setup(spec)); //implementing swagger UI

module.exports = router;