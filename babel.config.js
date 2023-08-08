module.exports = {
  presets: [
    'module:metro-react-native-babel-preset',
    ['@babel/preset-typescript', {allowDeclareFields: true}], ],
   plugins: [
     ['@babel/plugin-transform-flow-strip-types', { allowDeclareFields: true }],
     ['react-native-reanimated/plugin']
  ],
};