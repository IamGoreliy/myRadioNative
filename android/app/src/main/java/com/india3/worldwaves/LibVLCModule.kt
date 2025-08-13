package com.india3.worldwaves

import android.content.ContentResolver
import android.net.Uri
import android.os.Environment
import android.provider.DocumentsContract
import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import org.videolan.libvlc.LibVLC
import org.videolan.libvlc.Media
import org.videolan.libvlc.MediaPlayer
import java.io.File
import java.io.FileInputStream
import java.io.FileOutputStream
import android.media.MediaScannerConnection

class LibVLCModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private var libVLC: LibVLC? = null
    private var mediaPlayer: MediaPlayer? = null
    private var tempFilePath: String? = null
    private var targetFolderUri: String? = null

    override fun getName(): String {
        return "VlcRecordingModule" // Имя для JavaScript
    }

    @ReactMethod
    fun initialize(promise: Promise) {
        promise.resolve("LibVLC работает")
    }

    @ReactMethod
    fun startRecording(streamUrl: String, fileName: String, folderUri: String?, promise: Promise) {
        if (mediaPlayer != null) {
            promise.reject("RECORDING_IN_PROGRESS", "Запись уже идет.")
            return
        }
        try {
            val tempDir = reactApplicationContext.getExternalFilesDir(Environment.DIRECTORY_MUSIC)
            if (tempDir == null) {
                promise.reject("STORAGE_UNAVAILABLE", "Не удалось получить доступ к хранилищу.")
                return
            }
            if (!tempDir.exists()) {
                tempDir.mkdirs()
            }
            val tempFile = File(tempDir, fileName)
            tempFilePath = tempFile.absolutePath
            targetFolderUri = folderUri

            val vlcOptions = arrayListOf("--verbose=2")
            libVLC = LibVLC(reactApplicationContext, vlcOptions)

            val media = Media(libVLC, Uri.parse(streamUrl))

            // Главное — говорим VLC записывать в файл и не выводить звук
            media.addOption(":noaudio")
            media.addOption(":sout=#transcode{acodec=mp3,ab=128,channels=2}:standard{access=file,mux=mp3,dst=$tempFilePath}")
            media.addOption(":no-sout-all")
            media.addOption(":sout-keep")

            mediaPlayer = MediaPlayer(libVLC)
            mediaPlayer?.media = media
            media.release()

            mediaPlayer?.play()

            promise.resolve("Запись успешно началась (тихий режим): $tempFilePath")
        } catch (e: Exception) {
            promise.reject("RECORDING_FAILED", e.message)
        }
    }

    @ReactMethod
    fun stopRecording(promise: Promise) {
        try {
            mediaPlayer?.stop()
            Thread.sleep(500) // ждём, чтобы VLC дописал буфер
            mediaPlayer?.release()
            libVLC?.release()
            mediaPlayer = null
            libVLC = null

            if (tempFilePath != null) {
                val tempFile = File(tempFilePath)
                if (tempFile.exists() && tempFile.length() > 0) {
                    if (!targetFolderUri.isNullOrEmpty()) {
                        val contentResolver = reactApplicationContext.contentResolver
                        val treeUri = Uri.parse(targetFolderUri)
                        val documentId = DocumentsContract.getTreeDocumentId(treeUri)
                        val parentUri = DocumentsContract.buildDocumentUriUsingTree(treeUri, documentId)

                        val newFileUri = DocumentsContract.createDocument(
                            contentResolver,
                            parentUri,
                            "audio/mpeg",
                            tempFile.name
                        )
                        if (newFileUri != null) {
                            contentResolver.openOutputStream(newFileUri)?.use { outputStream ->
                                FileInputStream(tempFile).use { inputStream ->
                                    inputStream.copyTo(outputStream)
                                }
                            }
                        }
                    }
                } else {
                    promise.reject("FILE_EMPTY", "Файл пустой или не найден")
                    return
                }
            }

            promise.resolve("Запись остановлена")
        } catch (e: Exception) {
            promise.reject("STOP_RECORDING_FAILED", e.message)
        } finally {
            tempFilePath = null
            targetFolderUri = null
        }
    }


}