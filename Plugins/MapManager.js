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
const Canvas = require('canvas');

/**
 * calculate the difference between to numbers as a percentage value
 * @param {number} oldNumber 
 * @param {number} newNumber 
 * @returns {number} result
 */
function getPercentageChange(oldNumber, newNumber) {
    const change = (newNumber / oldNumber);
    return parseFloat(change.toFixed(2))
}
/**
 * apply a percantage change to a number
 * @param  {number} num number to change
 * @param {number} percentChange positive or negative percentage value to change by
 * @returns {number} result
 */
function applyPercentageChange(num, percentChange) {
    if (parseInt(percentChange) > 0.01) {
        return (percentChange * num);
    } else {
        return (num * percentChange);
    }
}

module.exports = class MapManager {
    constructor(width, height) {
        this.canvas = Canvas.createCanvas(width, height);
        this.width = width
        this.height = height
    }

    getImageBuffer() {
        return this.canvas.toBuffer()
    }

    async setBackgroundImage(source) {
        const context = this.canvas.getContext('2d');
        // Since the image takes time to load, we should await it
        const background = await Canvas.loadImage(source);
        // stretch the image to canvas dimensions
        context.drawImage(background, 0, 0, this.width, this.height);
    }

    async addImageToCanvas(source, posX, posY, width, height) {
        // FIX: flip y axis , canvas draws top to bottom, data is inverted
        posY = (this.height-posY) - 5
        const context = this.canvas.getContext('2d');
        // Since the image takes time to load, we should await it
        const img = await Canvas.loadImage(source);
        // draw image positioned and resized as per parameters
        context.drawImage(img, posX, posY, width, height);
    }

    addTextToCanvas(text, posX, posY, font, colourHex, width) {
        // FIX: flip y axis , canvas draws top to bottom, data is inverted
        posY = (this.height-posY) - 5
        const context = this.canvas.getContext('2d');
        context.font = font || '13px sans-serif';
        context.fillStyle = colourHex || '#ffffff';
        context.fillText(text, posX, posY, width)
    }

    scalePointsFromArray(pointsList, bounds) {
        if (!Array.isArray(pointsList)) { return false };
        const boundsX = (bounds["x"] || 8192)
        const boundsY = (bounds["y"] || 8192)
        console.log(`using bounds: x: ${boundsX}  y: ${boundsY}`)
        const scaleX = getPercentageChange(boundsX, this.width)
        const scaleY = getPercentageChange(boundsY, this.height)
        console.log(`scaling points for width: ${this.width}  height: ${this.height}`)
        let newPointsList = [];
        pointsList.forEach(point => {
            let newPoint = { "x": 0, "y": 0 }
            if (this.width != boundsX) {
                if (width < boundsX) {
                    console.log(`reducing point.x by ${scaleX}%`)
                    newPoint.x = applyPercentageChange(point.x, scaleX)
                } else {
                    console.log(`increasing point.x by ${-scaleX}%`)
                    newPoint.x = applyPercentageChange(point.x, scaleX)
                }
                newPoint.x = Math.ceil(newPoint.x)
            }
            else { newPoint.x = point.x }
            if (this.height != boundsY) {
                if (height < boundsY) {
                    console.log(`reducing point.y by ${scaleY}%`)
                    newPoint.y = applyPercentageChange(point.y, scaleY);
                } else {
                    console.log(`increasing point.y by ${-scaleY}%`)
                    newPoint.y = applyPercentageChange(point.y, scaleY)
                }
                newPoint.y = Math.ceil(newPoint.y)
            }
            else { newPoint.y = point.y }
            newPointsList.push(newPoint)
        })
        return newPointsList
    }

    scalePoint(point, bounds) {
        let boundsX = 8192
        if (bounds && bounds.x) {
            boundsX = bounds.x
        }
        let boundsY = 8192
        if (bounds && bounds.y) {
            boundsY = bounds.y
        }
        console.log(`using bounds: x: ${boundsX}  y: ${boundsY}`)
        const scaleX = getPercentageChange(boundsX, this.width)
        const scaleY = getPercentageChange(boundsY, this.height)
        console.log(`scaling points for width: ${this.width}  height: ${this.height}`)
        console.log(`using scale: x:${scaleX} y:${scaleY}`)
        point.x = applyPercentageChange(point.x, scaleX)
        point.y = applyPercentageChange(point.y, scaleY)
        console.log(`result  { "x": ${point.x}, "x": ${point.y} } `)
        return point
    }
};
