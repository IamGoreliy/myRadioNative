package com.india3.myapp;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

public class IcyMetaModule extends ReactContextBaseJavaModule {
    private volatile boolean isStreaming = false;
    private HttpURLConnection connection;

    public IcyMetaModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "IcyMetaModule";
    }

    // ... (метод getIcyMetaInt можно оставить без изменений) ...

    @ReactMethod
    public void startStreaming(String streamUrl, Promise promise) {
        if (isStreaming) {
            promise.resolve("Streaming is already active.");
            return;
        }
        isStreaming = true;

        new Thread(() -> {
            try {
                // --- НАЧАЛО ИЗМЕНЕНИЙ ---
                URL currentUrl = new URL(streamUrl);
                int redirectCount = 0;
                final int MAX_REDIRECTS = 5; // Ограничение на количество перенаправлений, чтобы избежать бесконечных циклов

                while (redirectCount < MAX_REDIRECTS) {
                    connection = (HttpURLConnection) currentUrl.openConnection();
                    connection.setInstanceFollowRedirects(false); // Отключаем автоматический редирект, чтобы управлять им вручную
                    connection.setRequestProperty("Icy-MetaData", "1");
                    connection.connect();

                    int responseCode = connection.getResponseCode();

                    // Проверяем, является ли код перенаправлением (301, 302, 303, 307, 308)
                    if (responseCode == HttpURLConnection.HTTP_MOVED_PERM || responseCode == HttpURLConnection.HTTP_MOVED_TEMP || responseCode == HttpURLConnection.HTTP_SEE_OTHER || responseCode == 307 || responseCode == 308) {
                        redirectCount++;
                        // Получаем новый URL из заголовка Location
                        String newUrl = connection.getHeaderField("Location");
                        if (newUrl == null) {
                            throw new Exception("Redirect response missing Location header.");
                        }
                        // Разрываем старое соединение и создаем новое по новому адресу
                        connection.disconnect();
                        currentUrl = new URL(newUrl);
                        continue; // Переходим на следующую итерацию цикла
                    }

                    // Если код не 200 (OK), значит что-то пошло не так
                    if (responseCode != HttpURLConnection.HTTP_OK) {
                        throw new Exception("Server returned HTTP " + responseCode);
                    }

                    // Если мы дошли сюда, значит код 200 и можно начинать парсинг
                    break; // Выходим из цикла редиректов
                }

                if (redirectCount >= MAX_REDIRECTS) {
                    throw new Exception("Too many redirects.");
                }
                // --- КОНЕЦ ИЗМЕНЕНИЙ ---


                String metaIntHeader = connection.getHeaderField("icy-metaint");
                if (metaIntHeader == null) {
                    throw new Exception("Stream does not support ICY metadata.");
                }
                int metaInt = Integer.parseInt(metaIntHeader);
                if (metaInt <= 0) {
                    throw new Exception("Invalid icy-metaint value: " + metaInt);
                }

                promise.resolve("Streaming started successfully.");

                InputStream inputStream = connection.getInputStream();
                // ... (остальная логика парсинга остается без изменений) ...
                byte[] buffer = new byte[4096];
                int bytesRead;
                int bytesUntilMetadata = metaInt;

                while (isStreaming && (bytesRead = inputStream.read(buffer)) != -1) {
                    int currentByteIndex = 0;
                    while (currentByteIndex < bytesRead) {
                        int bytesToSkip = Math.min(bytesUntilMetadata, bytesRead - currentByteIndex);
                        currentByteIndex += bytesToSkip;
                        bytesUntilMetadata -= bytesToSkip;

                        if (bytesUntilMetadata == 0) {
                            int metadataLengthByte = inputStream.read();
                            if (metadataLengthByte == -1) break;

                            int metadataLength = metadataLengthByte * 16;
                            if (metadataLength > 0) {
                                ByteArrayOutputStream metadataStream = new ByteArrayOutputStream();
                                byte[] metadataBuffer = new byte[metadataLength];
                                int totalMetaBytesRead = 0;
                                while (totalMetaBytesRead < metadataLength) {
                                    int metaBytesRead = inputStream.read(metadataBuffer, 0, metadataLength - totalMetaBytesRead);
                                    if (metaBytesRead == -1) break;
                                    metadataStream.write(metadataBuffer, 0, metaBytesRead);
                                    totalMetaBytesRead += metaBytesRead;
                                }

                                String metadataString = new String(metadataStream.toByteArray(), StandardCharsets.UTF_8).trim();
                                String title = parseStreamTitle(metadataString);
                                if (title != null && !title.isEmpty()) {
                                    sendEvent("onMetadataReceived", title);
                                }
                            }
                            bytesUntilMetadata = metaInt;
                        }
                    }
                }

            } catch (Exception e) {
                promise.reject("STREAM_ERROR", e.getMessage(), e);
                sendEvent("onError", e.getMessage());
            } finally {
                if (connection != null) {
                    connection.disconnect();
                }
                isStreaming = false;
                sendEvent("onStreamStopped", null);
            }
        }).start();
    }

    // ... (остальные методы stopStreaming, sendEvent, parseStreamTitle остаются без изменений) ...
    @ReactMethod
    public void stopStreaming() {
        isStreaming = false;
        if (connection != null) {
            new Thread(() -> connection.disconnect()).start();
        }
    }

    private void sendEvent(String eventName, @Nullable String params) {
        getReactApplicationContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    private String parseStreamTitle(String metadata) {
        String key = "StreamTitle='";
        int startIndex = metadata.indexOf(key);
        if (startIndex != -1) {
            startIndex += key.length();
            int endIndex = metadata.indexOf("';", startIndex);
            if (endIndex != -1) {
                return metadata.substring(startIndex, endIndex);
            }
        }
        return null;
    }
}