// services/TrackMetadataService.js

import { NativeModules, NativeEventEmitter } from 'react-native';

const { IcyMetaModule } = NativeModules;


if (!IcyMetaModule) {
    console.error(
        'Критическая ошибка: Нативный модуль IcyMetaModule не найден. ' +
        'Убедитесь, что вы пересобрали приложение (npx expo run:android) после добавления нативного кода.'
    );
}

const eventEmitter = IcyMetaModule ? new NativeEventEmitter(IcyMetaModule) : null;

let metadataListener = null;
let errorListener = null;

export const startListening = (streamUrl, onTitleUpdate) => {

    return new Promise((resolve, reject) => {
        if (!eventEmitter) return;
        stopListening();

        metadataListener = eventEmitter.addListener('onMetadataReceived', (title) => {
            if (onTitleUpdate) {
                if (title && title.trim() !== '') {
                    onTitleUpdate(title);
                }
            }
        });

        errorListener = eventEmitter.addListener('onError', (error) => {
            if (
                error.includes('Canceled') ||
                error.includes('Socket closed') ||
                error.includes('Socket is closed') ||
                error.includes('does not support ICY metadata')){
                return
            }
            console.error(`Ошибка в нативном стриме:, ${error}`);
        });

        IcyMetaModule.startStreaming(streamUrl)
            .then(res => {
                console.log('[TrackMetadataService] Стриминг успешно запущен, метаданные ожидаются.', res);
                if (res === null) {
                    resolve({status: 'NO_METADATA', hasMetadata: false, nameTrack: null});
                    return;
                }
                resolve({status: 'SUCCESS', hasMetadata: true, nameTrack: res});
            })
            .catch(e => {
                if ( e.message.includes('Canceled') ||
                    e.message.includes('Socket closed') ||
                    e.message.includes('Socket is closed') ||
                    e.message.includes('does not support ICY metadata')) {
                    resolve({status: 'NO_METADATA', hasMetadata: false, nameTrack: null});
                } else {
                    reject(e);
                }
            });
    });
};

export const stopListening = () => {
    if (!IcyMetaModule) return;

    if (metadataListener) {
        metadataListener.remove();
        metadataListener = null;
    }
    if (errorListener) {
        errorListener.remove();
        errorListener = null;
    }

    IcyMetaModule.stopStreaming();
};