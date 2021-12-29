// Copyright (C) 2021 Theros [SvalTek|MisModding]
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

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Discord;

function Discord(options) {
    return {
        id: "discord",
        name: "Discord",
        type: "oauth",
        authorization: "https://discord.com/api/oauth2/authorize?scope=identify+email+guilds+guilds.members.read",
        token: "https://discord.com/api/oauth2/token",
        userinfo: "https://discord.com/api/users/@me",
        
        profile(profile) {
            if (profile.avatar === null) {
                const defaultAvatarNumber = parseInt(profile.discriminator) % 5;
                profile.image_url = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
            } else {
                const format = profile.avatar.startsWith("a_") ? "gif" : "png";
                profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`;
            }

            return {
                id: profile.id,
                name: profile.username,
                email: profile.email,
                image: profile.image_url
            };
        },

        options
    };
}