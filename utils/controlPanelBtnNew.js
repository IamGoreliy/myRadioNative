import {Audio} from "expo-av";

export const createSong = async (sound, setSound, radioWave, setIsLoading, setIsPlay) => {
    try {
        setIsLoading(true);
        if (sound) {
            await sound.unloadAsync();
        }

        const {sound: song,} = await Audio.Sound.createAsync(
            {uri: radioWave},
            {shouldPlay: true}
        );

        setSound(song);
        setIsPlay(true);
        setIsLoading(false);

    } catch (e) {
        console.error(e, radioWave)
        setSound(null);
        alert('не удалось создать проигрываемый файл');
    }
}

export const playOrPauseSong = async (isPlay, sound) => {
    try {
        if (isPlay) {
            await sound.playAsync();
        } else {
            await sound.pauseAsync();
        }
    } catch (e) {
        console.error(e);
        alert('не удалось воспроизвести файл');
    }
}

