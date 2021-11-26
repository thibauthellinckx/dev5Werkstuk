const express = require('express');
require('dotenv').config({
    path: __dirname + '/../../.env'
});
const server = express();
const PORT = process.env.PORT || 3000;





const knex = require('knex')({
    client: 'pg',
    version: '7.2',
    connection: {
        host: process.env.POSTGRES_HOST ? process.env.POSTGRES_HOST : "localhost",
        port: 5432,
        user: process.env.POSTGRES_USER ? process.env.POSTGRES_USER : "test",
        password: process.env.POSTGRES_PASSWORD ? process.env.POSTGRES_PASSWORD : "test",
        database: process.env.POSTGRES_DATABASE ? process.env.POSTGRES_DATABASE : "test"
    }
});

async function instanciate() {
    await CreatingNewTables();
}

instanciate();


function CreatingNewTables() {
    try {
        knex.schema.hasTable('players').then(function (exists) {
            if (!exists) {
                return knex.schema.createTable('players', function (t) {
                    t.increments('id').primary();
                    t.string('username', 100);
                    t.string('password', 100);
                    t.text('email');

                });
            }

        });
    } catch (error) {
        console.log("error", error);
    }
}




server.use(express.json());

server.get('/players', (req, res) => {

    try {
        knex.select("*").from("players").then(function (data) {

            res.json(data);
        });

    } catch (err) {
        console.log(err.message);
    }
});

server.get('/', (req, res) => {

    try {

        res.send("welcome Players! ");
    } catch (err) {
        console.log(err.message);
    }
});

server.get('/players/:id', (req, res) => {

    try {
        const {
            id
        } = req.params;
        knex("players").select().where("id", id).then(function (data) {

            res.json(data);
        });

    } catch (err) {
        console.log(err.message);
    }
});

server.put('/players/:id', (req, res) => {

    try {
        const player = req.body;
        const {
            id
        } = req.params;

        knex("players").where("id", id).update({
            username: player.username
        }).then(function (data) {

            res.json(data);
        });

    } catch (err) {
        console.log(err.message);
    }
});


// server.delete('/players/:id', (req, res) => {

//     try {
//         const {
//             id
//         } = req.params;
//         const deleteUser = knex("players").where("user_id", id).del().then(function (data) {

//             res.json(data);
//         });

//     } catch (err) {
//         console.log(err.message);
//     }
// });
server.delete('/players/:name', (req, res) => {

    try {
        const {
            name
        } = req.params;
        knex("players").where("username", name).del().then(function (data) {
            res.json(data);
        });

    } catch (err) {
        console.log(err.message);
    }
});



server.post('/players', (req, res) => {

    try {
        const player = req.body;
        console.log(player);
        knex("players").insert({
            username: player.username,
            password: player.password,
            email: player.email
        }).then(function (data) {

            res.json(data);
        });

    } catch (err) {
        console.log(err.message);
    }
});

server.listen(PORT, () => {

    console.log(`listening to port ${PORT}`);
});

module.exports = {
    server
};
