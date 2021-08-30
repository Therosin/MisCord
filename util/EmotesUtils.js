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


module.exports = class EmotesUtils {
    static GetConnectionEmoteFromCurrentPing(value) {
        if (value <= 90) { return "<:net_high:827461252057661442>" };
        if (value <= 150) { return "<:net_mid:827461237688238080>" };
        if (value <= 200) { return "<:net_low:827461224065269760>" };
        return "<:warningMC:827460865941831690>"
    }
}