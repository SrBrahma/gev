// https://github.com/expo/expo/issues/11261#issuecomment-1014913200
// https://gist.github.com/Hirbod/d6bb5d0fc946a12ba9e3cf01120c604a
// disable forced dark mode to prevent weird color changes on
// certain android devices (Xiaomi MIUI and others enforcing dark mode with view analyzing)
// create a file like "plugins/withDisableForcedDarkModeAndroid.js". Insert this content and edit your app.config.js/app.json
// and add expo.plugins: [['./plugins/withDisableForcedDarkModeAndroid.js']]

const {
  createRunOncePlugin,
  withAndroidStyles,
  AndroidConfig
} = require('@expo/config-plugins');

function setForceDarkModeToFalse(styles) {
  styles = AndroidConfig.Styles.assignStylesValue(styles, {
      add: true,
      parent: AndroidConfig.Styles.getAppThemeLightNoActionBarGroup(),
      name: `android:forceDarkAllowed`,
      value: "false",
  });

  return styles;
}

const withDisableForcedDarkModeAndroid = (config) => {
  return withAndroidStyles(config, (config) => {
      config.modResults = setForceDarkModeToFalse(config.modResults);
      return config;
  });
};

module.exports = createRunOncePlugin(withDisableForcedDarkModeAndroid, 'disable-forced-dark-mode', '1.0.0');