// JSX tranform so `import React from 'react'` isnt required:
// https://aryan-mittal.medium.com/enable-the-new-jsx-transform-in-react-native-0-64-aea4f686a640
// https://github.com/facebook/metro/issues/646#issuecomment-799174473
module.exports = {
  presets: [['module:metro-react-native-babel-preset', { useTransformReactJSXExperimental: true }]],
  plugins: [
    [
      '@babel/plugin-transform-react-jsx',
      {
        runtime: 'automatic',
      },
    ],
  ],
};