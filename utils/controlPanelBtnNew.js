import {Audio} from "expo-av";

export const createSong = async (sound, setSound, radioWave) => {
    try {
        if (sound) {
            await sound.unloadAsync();
        }
        const {sound: song} = await Audio.Sound.createAsync(
            {uri: radioWave},
        )
        setSound(song);
    } catch (e) {
        console.error(e)
        setSound(null);
        alert('не удалось создать проигрываемый файл');
    }
}

export const playOrPauseSong = async (isPlay, sound) => {
    const {isLoaded} = await sound.getStatusAsync();
    console.log(isLoaded)
    try {
            if (isLoaded) {
                await sound.playAsync();
            }
    } catch (e) {
        console.error(e);
        alert('не удалось воспроизвести файл');
    }
}

