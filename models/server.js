const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { createServer } = require('http');

const { dbConnection } = require('../database/config');
const { socketController } = require('../sockets/constrollers');

class Server {

    constructor() {
        this.app    = express();
        this.port   = process.env.PORT;
        this.server = createServer( this.app );
        this.io     = require('socket.io')( this.server );
        
        this.paths = {
            auth:       '/api/auth',
            categories: '/api/categories',
            products:   '/api/products',
            search:     '/api/search',
            uploads:    '/api/uploads',
            user:       '/api/user'
        }

        // connectar a la base de datos
        this.connectDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicacion
        this.routes();

        // Sockets
        this.sockets();
    }

    async connectDB() {
        await dbConnection();
    }

    middlewares() {

        // CORS
        this.app.use( cors() );

        // Lectura y parseo del body
        this.app.use( express.json() );
        
        // Directorio publico
        this.app.use( express.static('public') );

        // Fileupload - Carga de Archivos
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));
    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.categories, require('../routes/categories'));
        this.app.use(this.paths.products, require('../routes/products'));
        this.app.use(this.paths.search, require('../routes/search'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));
        this.app.use(this.paths.user, require('../routes/user'));
    }

    sockets() {
        this.io.on( 'connection', ( socket ) => socketController( socket, this.io ) );
    }

    listen() {
        this.server.listen( this.port, () =>{
            console.log('Servidor Corriendo en el puerto:', this.port);
        });
    }

}

module.exports = Server;
