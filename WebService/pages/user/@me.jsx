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
import React from 'react'
import Layout from '../../view/layout.jsx'
import { useSession,signIn, signOut } from "next-auth/react"

export default function UserInfo(props) {
    const { data: session } = useSession()
    if (session) {
        console.log(session)
        console.log(props)
        return (
            <div style={{ fontSize: "24px" }}>
                <img src={session.user.image}/><br/>
                Signed in as {session.user.name} <br />
                DiscordId: {session.user.id} <br />
                <button onClick={() => signOut()}>Sign out</button>
            </div>
        )
    }
    return (
        <div style={{ fontSize: "24px" }}>Not signed in <br />
            <button onClick={() => signIn()}>Sign in</button>
        </div>
    )
}