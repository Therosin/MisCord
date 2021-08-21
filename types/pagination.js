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

import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js'

// Constants

const backId = 'back'
const forwardId = 'forward'
const backButton = new MessageButton({
    style: 'SECONDARY',
    label: 'Back',
    emoji: '⬅️',
    customId: backId
})
const forwardButton = new MessageButton({
    style: 'SECONDARY',
    label: 'Forward',
    emoji: '➡️',
    customId: forwardId
})

/**
 * Creates an embed with guilds starting from an index.
 * @param {number} start The index to start from.
 * @returns {Promise<MessageEmbed>}
 */
const generatePagedEmbed = async (title, data, start) => {
    if (!Array.isArray(data)) { return };

    const current = data.slice(start, start + 10)

    // You can of course customise this embed however you want
    return new MessageEmbed({
        title: `${title} ${start + 1}-${start + current.length} of ${guilds.length}`,
        fields: await Promise.all(
            current.map(async entry => ({
                name: entry.prefix,
                value: entry.value
            }))
        )
    })
}

const sendPagedEmbed = (message,title, data) => {

    const {channel,user} = message

    // Send the embed with the first 10 entries
    const canFitOnOnePage = data.length <= 10
    const embedMessage = await channel.send({
        embeds: [await generatePagedEmbed(title,data, 0)],
        components: canFitOnOnePage
            ? []
            : [new MessageActionRow({ components: [forwardButton] })]
    })

    // Stop if only one page of data
    if (canFitOnOnePage) return

    // Collect interactions by message author
    const collector = embedMessage.createMessageComponentCollector({
        filter: ({ user }) => user.id === author.id
    })

    let currentIndex = 0
    collector.on('collect', async interaction => {
        // Resize index
        interaction.customId === backId ? (currentIndex -= 10) : (currentIndex += 10)
        // Respond to interaction by updating message
        await interaction.update({
            embeds: [await generatePagedEmbed(currentIndex)],
            components: [
                new MessageActionRow({
                    components: [
                        // back button
                        ...(currentIndex ? [backButton] : []),
                        // forward button
                        ...(currentIndex + 10 < data.length ? [forwardButton] : [])
                    ]
                })
            ]
        })
    })
}