require('dotenv').load();

import mongoose from 'mongoose';

let db = {};
const server = process.env.DB_SERVER;
const database = process.env.DB_NAME || 'legit';
const user = process.env.DB_USER;
const pass = process.env.DB_PASS;

mongoose.connect(`mongodb://${user}:${pass}@${server}/${database}`, { useNewUrlParser: true })
    .then(() => {
        console.log('connected to database');

        init();
    })
    .catch(err => {
        console.error(err);
    });

function init() {
    if (db.init) db.init();
}

export default db;