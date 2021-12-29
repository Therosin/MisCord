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

// import React from "react";
// 
// import Link from "next/link";


// export default function Navigation() {
//   return (
//     <header>
//     <div className="brand">
//       <h3>MisCord</h3>
//     </div>
//     <nav>
//       {navLinks.map((link) => {
//         return (
//            <NavLink href={link.path}>
//             {link.name}
//            </NavLink>
//         );
//       })}
//     </nav>
//   </header>
//   );
// }

/*  ./components/Navbar.jsx     */
import Link from 'next/link';
import { useState } from 'react';
import { useSession, signIn, signOut } from "next-auth/react"

import { navLinks } from '../data'
export const NavBar = () => {
  const [active, setActive] = useState(false);
  const { data: session } = useSession();

  const handleClick = () => {
    setActive(!active);
  };

  const UserForm = () => {
    if (session && session.user) {
      return (
        <div style={{ fontSize: "24px", color: 'white' }}>
          <img src={session.user.image} width="50" height="50"></img>
          {session.user.name} <button className='btn btn-warning me-2' onClick={() => signOut()}>Sign out</button>
        </div>
      )
    }
    return (
      <div style={{ fontSize: "24px" }}>
        Not signed in. <button className='btn btn-info' onClick={() => signIn()}>Sign in</button>
      </div>
    )
  }

  return (
    <header>
      <div style={{ background: "black", height: "70px", padding: "10px", width: "100%" }}>
        <div className='d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start'>
          <a
            href='#'
            className='d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none'
          >
            MisCord
          </a>

          <ul className='nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0'>
            {navLinks.map((link,index) => {
              return (
                <li key={index} className='nav-link px-2 text-secondary'>
                  <Link href={link.path} active={link.active}>
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className='text-end'>
            {UserForm()}
          </div>
        </div>
      </div>
    </header>
  );
};

