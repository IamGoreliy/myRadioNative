import withCustomJavaFiles from './extraPlugin/withCustomJavaFiles';
import withLibVlc from './extraPlugin/withLibVlc'
import withScopedStorage from './extraPlugin/withScopedStorage'


const config = {
  name: "World-Waves",
  slug: "my-radio",
  version: "1.0.1",
  orientation: "portrait",
  icon: "./assets/logoByGemini.png",
  userInterfaceStyle: "dark",
  newArchEnabled: true,
  splash: {
    image: "./assets/logoByGemini.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  assetBundlePatterns: [
    "**/*"
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.india3.worldwaves"
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/logoByGemini.png",
      backgroundColor: "#ffffff"
    },
    edgeToEdgeEnabled: true,
    package: "com.india3.worldwaves",
    foregroundService: true,
    permissions: [
      "FOREGROUND_SERVICE"
    ],
    queries: [
      {
        package: "com.shazam.android"
      },
      {
        package: "com.spotify.music"
      },
      {
        package: "com.apple.android.music"
      },
      {
        package: "com.google.android.youtube"
      }
    ]
  },
  web: {
    favicon: "./assets/logoByGemini.png"
  },
  plugins: [
    "expo-router",
    "./extraPlugin/withCustomJavaFiles.js", // <-- то, что копирует твои 4 файла
    "./extraPlugin/withScopedStorage.js",
    "./extraPlugin/withLibVlc.js"
  ],
  extra: {
    router: {
      origin: false
    },
    eas: {
      projectId: "84060433-fac8-491c-8bae-24213277053e"
    }
  }
}

export default () => withCustomJavaFiles(withLibVlc(withScopedStorage(config)));


