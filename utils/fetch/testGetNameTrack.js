import {NativeModules, NativeEventEmitter} from "react-native";
const {IcyMetaModule} = NativeModules;
const eventEmitter = new NativeEventEmitter(IcyMetaModule);

export const testGetNameTrack = async () => {
    console.log('i am work')
    if (!IcyMetaModule) {
        console.error('Нативный модуль IcyMetaModule не найден')
        return  null;
    }
    try {
        const res = await IcyMetaModule.getIcyMetaInt('http://stream.live.vc.bbcmedia.co.uk/bbc_world_service')
        console.log('icy-metaint:', res);
    } catch (e) {
        console.log(e)
    }
    return 'hello'

}
//парсинг метаинт
//const response = await fetch('http://stream.url:port/stream', { method: 'GET' });
// const metaint = response.headers.get('icy-metaint');
// const reader = response.body.getReader();
// let buffer = new Uint8Array();
// while (true) {
//   const { done, value } = await reader.read();
//   if (done) break;
//   buffer = new Uint8Array([...buffer, ...value]);
//   if (buffer.length >= metaint) {
//     const metadataLength = buffer[metaint] * 16; // Длина метаданных
//     const metadata = new TextDecoder().decode(buffer.slice(metaint + 1, metaint + 1 + metadataLength));
//     console.log('Metadata:', metadata);
//     buffer = buffer.slice(metaint + 1 + metadataLength); // Сброс буфера
//   }
// }