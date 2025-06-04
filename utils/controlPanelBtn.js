import {Audio} from "expo-av";

export const playRadio = async (url = '', isPlaying, setIsPlaying, sound, setSound, setIsLoading) => {
    try {
        //проверка-предохранитель от 2-го нажатия кнопки играть
        if (isPlaying) return;
        setIsLoading(true);
        //проверка и сброс и размонтирования соунда если он есть
        if (sound) {
            console.log('iam here delete cache sound')
            await sound.unloadAsync();
            setSound(null);
        }
        //создание нового соунда. url приходит из вне.
        const {sound: newSound, status} = await Audio.Sound.createAsync(
            {
                uri: url,
            },
            {shouldPlay: true}
        );
        setSound(newSound);
        setIsPlaying(status.isPlaying);
        setIsLoading(false);

    } catch (error) {
        setIsPlaying(false);
        setSound(null);
    }
}

const pauseRadio = async (isPlaying, sound, setIsPlaying, setSound) => {
    try {
        if (!isPlaying) return;
        if (sound) {
            await sound.pauseAsync();
            setIsPlaying(false);
        }
    } catch (error) {
        console.log(error);
        setIsPlaying(false);
        setSound(null);

    }
}

export const togglePlayRadio = async (url = '', playerOption = []) => {
    const [isPlaying, setIsPlaying, sound, setSound, setIsLoading] = playerOption;
    if (isPlaying) {
        await pauseRadio(isPlaying, sound, setIsPlaying, setSound);
    } else {
        await playRadio(url, isPlaying, setIsPlaying, sound, setSound, setIsLoading);
    }
}