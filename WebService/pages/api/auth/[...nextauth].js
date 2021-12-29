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
import NextAuth from "next-auth"
import DiscordProvider from "../../../providers/Discord"
import getConfig from 'next/config'
const { serverRuntimeConfig } = getConfig()

export default NextAuth({
  callbacks: {
    jwt: async ({ token, user, account, profile }) => {
      // Add auth_time to token on signin in
      if (user) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.id = profile.id;
        token.profile = profile;
        token.discriminator = profile.discriminator;
      }
      return Promise.resolve(token);
    },

    session: async ({ session, token }) => {
      //BUG:nextAuth and Discord use different names for stuff. lets remap some values
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.profile = token.profile;
      session.user.id = token.id;
      //FIXME: Removed sub/email values from session - we dont need them
      delete session.sub;
      delete session.user.email;
      delete session.user.profile.email;
      return session;
    },
  },
  providers: [
    DiscordProvider({
      clientId: serverRuntimeConfig.DISCORD_CLIENT_ID,
      clientSecret: serverRuntimeConfig.DISCORD_CLIENT_SECRET
    })
  ],
})