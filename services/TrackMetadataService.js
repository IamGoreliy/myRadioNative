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
    if (!eventEmitter) return;
    stopListening();

    metadataListener = eventEmitter.addListener('onMetadataReceived', (title) => {
        if (onTitleUpdate) {
            onTitleUpdate(title);
        }
    });

    errorListener = eventEmitter.addListener('onError', (error) => {
        if ( error.includes('Canceled') || error.includes('Socket closed') ) {
            return
        }
        console.error('Ошибка в нативном стриме:', error);
    });

    IcyMetaModule.startStreaming(streamUrl)
        .then(status => console.log('Статус запуска стриминга:', status))
        .catch(e => {
            if ( e.message.includes('Canceled') || e.message.includes('Socket closed') ) {
                return;
            }
            console.error('Ошибка при запуске стриминга:', e.message)
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