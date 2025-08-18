const {withAndroidManifest} = require('@expo/config-plugins');

module.exports = function withScopedStorage (config) {
    return withAndroidManifest(config,  (config) => {
        const manifest = config.modResults.manifest;
        manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';
        return config;
    });
}