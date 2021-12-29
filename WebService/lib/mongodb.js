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

// import getConfig from 'next/config'
// const { serverRuntimeConfig } = getConfig()
// const MONGOCFG = {
//   URI: serverRuntimeConfig.MONGO_URI,
//   DBNAME: serverRuntimeConfig.MONGO_DBNAME,
//   USER: serverRuntimeConfig.MONGO_USER,
//   PASSWORD: serverRuntimeConfig.MONGO_PASSWORD
// }

// const MONGODB_URI = `mongodb+srv://${MONGOCFG.USER}:${MONGOCFG.PASSWORD}@${MONGOCFG.URI}/${MONGOCFG.DBNAME}?retryWrites=true&w=majority`

/** 
 Source : 
 https://github.com/vercel/next.js/blob/canary/examples/with-mongodb-mongoose/utils/dbConnect.js 
 **/

 // /lib/dbConnect.js
import mongoose from 'mongoose'


async function dbConnect() {
  mongoose.set('bufferCommands', false);
  return mongoose.connection
}

export default dbConnect