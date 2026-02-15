#!/usr/bin/env node
// One-time icon generation script. Run with: node generate-icons.js
// Creates simple PNG icons for the PWA manifest.
// These are placeholder icons — replace with properly designed ones later.

var fs = require("fs");
var zlib = require("zlib");

function createPNG(size) {
  // Create a simple PNG with brand blue (#205082) text area on white background
  // This creates a valid PNG with a solid white background and a centered blue square
  var width = size;
  var height = size;

  // PNG signature
  var signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  var ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type: RGB
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  var ihdrChunk = makeChunk("IHDR", ihdr);

  // IDAT chunk — raw pixel data
  // Each row: filter byte (0) + RGB pixels
  var rawRows = [];
  var brandR = 32, brandG = 80, brandB = 130;
  var whiteR = 255, whiteG = 255, whiteB = 255;

  // Create a simple design: white background with a centered blue rounded square
  var margin = Math.floor(size * 0.15);
  var innerSize = size - 2 * margin;

  for (var y = 0; y < height; y++) {
    var row = [0]; // filter byte: None
    for (var x = 0; x < width; x++) {
      var inInner = x >= margin && x < margin + innerSize && y >= margin && y < margin + innerSize;
      if (inInner) {
        row.push(brandR, brandG, brandB);
      } else {
        row.push(whiteR, whiteG, whiteB);
      }
    }
    rawRows.push(Buffer.from(row));
  }

  var rawData = Buffer.concat(rawRows);
  var compressed = zlib.deflateSync(rawData);
  var idatChunk = makeChunk("IDAT", compressed);

  // IEND chunk
  var iendChunk = makeChunk("IEND", Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function makeChunk(type, data) {
  var length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);

  var typeBuffer = Buffer.from(type, "ascii");
  var crcData = Buffer.concat([typeBuffer, data]);

  var crc = crc32(crcData);
  var crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE(crc >>> 0, 0);

  return Buffer.concat([length, typeBuffer, data, crcBuffer]);
}

function crc32(buf) {
  var table = [];
  for (var n = 0; n < 256; n++) {
    var c = n;
    for (var k = 0; k < 8; k++) {
      if (c & 1) {
        c = 0xEDB88320 ^ (c >>> 1);
      } else {
        c = c >>> 1;
      }
    }
    table[n] = c;
  }

  var crc = 0xFFFFFFFF;
  for (var i = 0; i < buf.length; i++) {
    crc = table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

// Generate icons
var icon192 = createPNG(192);
fs.writeFileSync("icon-192.png", icon192);
console.log("Created icon-192.png (" + icon192.length + " bytes)");

var icon512 = createPNG(512);
fs.writeFileSync("icon-512.png", icon512);
console.log("Created icon-512.png (" + icon512.length + " bytes)");

// Create a 32x32 icon for favicon (just a simple blue square)
var icon32 = createPNG(32);
// For favicon.ico, we'll just use the PNG directly
// Modern browsers support PNG favicons via <link rel="icon">
fs.writeFileSync("favicon.png", icon32);
console.log("Created favicon.png (" + icon32.length + " bytes)");

console.log("\nPlaceholder icons created. Replace with properly designed icons before launch.");
