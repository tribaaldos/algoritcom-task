// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Aseguramos que todas las extensiones estén correctamente registradas
["js", "jsx", "json", "ts", "tsx", "cjs", "mjs"].forEach((ext) => {
  if (!config.resolver.sourceExts.includes(ext)) {
    config.resolver.sourceExts.push(ext);
  }
});

["glb", "gltf", "png", "jpg"].forEach((ext) => {
  if (!config.resolver.assetExts.includes(ext)) {
    config.resolver.assetExts.push(ext);
  }
});
config.resolver.assetExts.push('glb', 'gltf');


module.exports = config;
