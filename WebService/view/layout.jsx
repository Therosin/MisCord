import React from 'react'
import Head from 'next/head'
import { NavBar } from '../components/Navigation'
import 'bootstrap/dist/css/bootstrap.css';

export default function Layout(props) {
  return <div>
    <Head>
      <title>MisCord</title>
      <link rel='icon' href='/favicon.png' />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>
      <meta name="description" content="MisCord the Miscreated Community Server Discord Administration Tool"/>
      <meta name="keywords" content="Miscreated,Discord,community,server,administration,admin,serverowner,utilities,rcon"/>
      <meta name="author" content="Theros"/>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
    </Head>
    <NavBar/>
    <div style={{
      width: "70%",
      margin: "auto",
      paddingTop: "16px"
    }}>
      {props.children}
    </div>
  </div>
}
