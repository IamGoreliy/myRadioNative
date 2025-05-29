EXPO 52.0.40
для запуска проекта на андроид нужно после предилда изменить файл android/build.gradle
правильный файл build.gradle находится в корне проекта файле android-build-gradle
для правильного запуска нужно
запустить команду npx expo prebuild --clean --platform android
скопировать данные из файла android/build.gradle в файл android/build.gradle
