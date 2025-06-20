import {Audio} from "expo-av";

export const createSong = async (sound, setSound, radioWave, setIsLoading, setIsPlay) => {
    console.log('create sound', sound)
    try {
        setIsLoading(true);
        if (sound) {
            await sound.unloadAsync();
            setSound(null);
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
        // await sound.unloadAsync();
        alert('не удалось создать проигрываемый файл');
    }
}

export const playOrPauseSong = async (isPlay, sound, setSound) => {
    try {
        if (isPlay) {
            await sound.playAsync();
        } else {
            sound.unloadAsync();
            setSound(null);
        }
    } catch (e) {
        console.error(e);
        alert('не удалось воспроизвести файл');
    }
}

