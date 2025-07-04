"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TIFF = void 0;
// based on http://www.compix.com/fileformattif.htm
// TO-DO: support big-endian as well
const fs = require("fs");
const utils_1 = require("./utils");
// Read IFD (image-file-directory) into a buffer
function readIFD(input, filepath, isBigEndian) {
    const ifdOffset = (0, utils_1.readUInt)(input, 32, 4, isBigEndian);
    // read only till the end of the file
    let bufferSize = 1024;
    const fileSize = fs.statSync(filepath).size;
    if (ifdOffset + bufferSize > fileSize) {
        bufferSize = fileSize - ifdOffset - 10;
    }
    // populate the buffer
    const endBuffer = new Uint8Array(bufferSize);
    const descriptor = fs.openSync(filepath, 'r');
    fs.readSync(descriptor, endBuffer, 0, bufferSize, ifdOffset);
    fs.closeSync(descriptor);
    return endBuffer.slice(2);
}
// TIFF values seem to be messed up on Big-Endian, this helps
function readValue(input, isBigEndian) {
    const low = (0, utils_1.readUInt)(input, 16, 8, isBigEndian);
    const high = (0, utils_1.readUInt)(input, 16, 10, isBigEndian);
    return (high << 16) + low;
}
// move to the next tag
function nextTag(input) {
    if (input.length > 24) {
        return input.slice(12);
    }
}
// Extract IFD tags from TIFF metadata
function extractTags(input, isBigEndian) {
    const tags = {};
    let temp = input;
    while (temp && temp.length) {
        const code = (0, utils_1.readUInt)(temp, 16, 0, isBigEndian);
        const type = (0, utils_1.readUInt)(temp, 16, 2, isBigEndian);
        const length = (0, utils_1.readUInt)(temp, 32, 4, isBigEndian);
        // 0 means end of IFD
        if (code === 0) {
            break;
        }
        else {
            // 256 is width, 257 is height
            // if (code === 256 || code === 257) {
            if (length === 1 && (type === 3 || type === 4)) {
                tags[code] = readValue(temp, isBigEndian);
            }
            // move to the next tag
            temp = nextTag(temp);
        }
    }
    return tags;
}
// Test if the TIFF is Big Endian or Little Endian
function determineEndianness(input) {
    const signature = (0, utils_1.toUTF8String)(input, 0, 2);
    if ('II' === signature) {
        return 'LE';
    }
    else if ('MM' === signature) {
        return 'BE';
    }
}
const signatures = [
    // '492049', // currently not supported
    '49492a00', // Little endian
    '4d4d002a', // Big Endian
    // '4d4d002a', // BigTIFF > 4GB. currently not supported
];
exports.TIFF = {
    validate: (input) => signatures.includes((0, utils_1.toHexString)(input, 0, 4)),
    calculate(input, filepath) {
        if (!filepath) {
            throw new TypeError("Tiff doesn't support buffer");
        }
        // Determine BE/LE
        const isBigEndian = determineEndianness(input) === 'BE';
        // read the IFD
        const ifdBuffer = readIFD(input, filepath, isBigEndian);
        // extract the tags from the IFD
        const tags = extractTags(ifdBuffer, isBigEndian);
        const width = tags[256];
        const height = tags[257];
        if (!width || !height) {
            throw new TypeError('Invalid Tiff. Missing tags');
        }
        return { height, width };
    },
};
