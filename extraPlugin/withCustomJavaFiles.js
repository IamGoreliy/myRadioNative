const fs = require('fs');
const path = require('path');
const {withDangerousMod} = require('@expo/config-plugins');

module.exports = withCustomJavaFiles = (config) => {
    return withDangerousMod(config, [
        'android',
        async (config) => {
            const projectRoot = config.modRequest.projectRoot;
            const sourceFile = ['IcyMetaModule.java', 'IcyMetaPackage.java', 'LibVLCModule.kt', 'LibVLCPackage.kt'];

            const sourceDir = path.join(projectRoot, 'extraPlugin', 'nativeCode');
            const targetDir = path.join(projectRoot, 'android', 'app', 'src', 'main', 'java', 'com', 'india3', 'worldwaves');

            fs.mkdirSync(targetDir, { recursive: true });

            for (const file of sourceFile) {
                const sourceFile = path.join(sourceDir, file);
                const targetFile = path.join(targetDir, file);

                if (fs.existsSync(sourceFile)) {
                    fs.copyFileSync(sourceFile, targetFile);
                    console.log(`копирование нативного файла в папку андроид ${file} успешна`);
                } else {
                    console.log(`копирование нативного файла ${file} в папку андроид несупешно`);
                }
            }
            return config;
        }])
}
