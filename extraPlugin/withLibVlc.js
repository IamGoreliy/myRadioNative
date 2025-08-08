const { withAppBuildGradle } = require('@expo/config-plugins');

function withLibVlc(config) {
    return withAppBuildGradle(config, (config) => {
        // Проверяем, есть ли уже dependencies в содержимом Gradle-файла
        const dependency = `implementation 'org.videolan.android:libvlc-all:3.5.1'`;
        if (!config.modResults.contents.includes(dependency)) {
            // Находим блок dependencies и добавляем новую зависимость
            config.modResults.contents = config.modResults.contents.replace(
                /dependencies\s*{/,
                `dependencies {\n    ${dependency}`
            );
        }
        return config;
    });
}

module.exports = withLibVlc;