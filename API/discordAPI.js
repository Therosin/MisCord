// Copyright (C) 2021 Theros @[MisModding|SvalTek]
// 
// This file is part of MisCord.
// 
// MisCord is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// MisCord is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with MisCord.  If not, see <http://www.gnu.org/licenses/>.

const client = require('../Plugins/discord-oauth');
const express = require('express');
const router = express.Router();

const verify = async function (req, res, next) {
    if (req.cookies['user-key']) {
        try {
            const keyValidity = client.checkValidity(req.cookies['user-key']);
            if (keyValidity.expired) {
                const newKey = await client.refreshToken(req.cookies['user-key']);
                res.cookie('user-key', newKey);
                next();
            } else {
                next();
            }
        } catch (err) {
            console.error(err);
            const { link, state } = client.auth;
            res.cookie('user-key', 'deleted', { maxAge: -1 });
            res.cookie('user-state', state);
            res.render('discord/login',{ title: 'Disco-OAuth', link });
        }
    } else {
        const { link, state } = client.auth;
        res.cookie('user-state', state);
        res.render('discord/login',{ pageTitle: 'Disco-OAuth', link });
    }
}

router.get('/', verify, async (req, res) => {
    console.info('Request recieved')
    const user = await client.users.fetch(req.cookies['user-key']);
    res.render('discord/user', { title: 'Disco-OAuth User', user });
});

router.get('/login', async (req, res) => {
    if (req.query.state && req.query.code && req.cookies['user-state']) {
        if (req.query.state === req.cookies['user-state']) {
            const userKey = await client.getAccess(req.query.code).catch(console.error);
            res.cookie('user-state', 'deleted', { maxAge: -1 });
            res.cookie('user-key', userKey);
            res.redirect('/');
        } else {
            res.send('States do not match. Nice try hackerman!');
        }
    } else {
        res.send('Invalid login request.');
    }
});

router.get('/logout', verify, (req, res) => {
    res.cookie('user-key', 'deleted', { maxAge: -1 });
    res.redirect('/');
});

router.get('/guilds', verify, async (req, res) => {
    const guilds = await client.guilds.fetch(req.cookies['user-key'], true);
    res.render('discord/guilds', { title: 'Disco-OAuth Guilds', guilds })
});

module.exports = router;