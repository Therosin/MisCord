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

// pages/_app.js
import React, { useEffect } from 'react'
import { SessionProvider, useSession, getSession } from "next-auth/react"
import { fetchDiscordUserData } from "../lib/discordUtils.js"
import Layout from '../view/layout.jsx'
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <Layout>
        {Component.auth ? (
          <Auth>
            <Component {...pageProps} />
          </Auth>
        ) : (
          <Component {...pageProps} />
        )}
      </Layout>
    </SessionProvider>
  )
}

function Auth({ children }) {
  const { data: session, status } = useSession()
  const isUser = !!session?.user
  useEffect(() => {
    if (status === "loading") return // Do nothing while loading
    if (!isUser) signIn() // If not authenticated, force log in
  }, [isUser, status])

  if (isUser) {
    console.log(session)
    return children
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return <div>Loading...</div>
}

/**
 * Fetch Extra Discord information needed by nextjs
*/
App.getInitialProps = async ({ ctx }) => {
  const session = await getSession(ctx)
  const { req, res } = ctx

  const currentAction = (res?.query || req?.query)?.action || null
  const currentGuild = (res?.query || req?.query)?.guild || null
  const currentServer = (res?.query || req?.query)?.server || null
  let guildInfo = null
  let roleInfo = null
  if (session?.user) {
    if (currentGuild != null) {
      const data = await fetchDiscordUserData(session, currentGuild)
      if (data?.guildInfo && data?.roleInfo) {
        guildInfo = data['guildInfo']
        roleInfo = data['roleInfo']
      }
    }
  }


  return {
    pageProps: {
      action: currentAction,
      guildId: currentGuild,
      serverId: currentServer,
      guildInfo: guildInfo,
      roleInfo: roleInfo
    }
  }
}