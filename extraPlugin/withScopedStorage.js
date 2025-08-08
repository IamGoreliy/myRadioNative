const {withAndroidManifest} = require('@expo/config-plugins');

module.exports = function withScopedStorage (config) {
    return withAndroidManifest(config,  (config) => {
        const manifest = config.modResults.manifest;
        const permissions = manifest['uses-permission'] || [];
        const alreadyExists = permissions.some(
            (p) => p.$['android:name'] === 'android.permission.MANAGE_EXTERNAL_STORAGE'
        );
        if (!alreadyExists) {
            permissions.push({
                $: {
                    'android:name': 'android.permission.MANAGE_EXTERNAL_STORAGE',
                    'tools:ignore': 'ScopedStorage'
                }
            });
            manifest['uses-permission'] = permissions;
        }
        manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';
        return config;
    });
}