package com.india3.worldwaves

import android.net.Uri
import android.os.Environment
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import org.videolan.libvlc.LibVLC
import org.videolan.libvlc.Media
import org.videolan.libvlc.MediaPlayer
import java.io.File

import android.util.Log // Для Log.d/e
import android.media.MediaScannerConnection // Для MediaScannerConnection
import android.media.MediaScannerConnection.OnScanCompletedListener // Для OnScanCompletedListener

class LibVLCModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
 private var libVLC: LibVLC? = null
 private var mediaPlayer: MediaPlayer? = null
 private var lastKnownOutputFilePath: String? = null


  override fun getName(): String {
    return "VlcRecordingModule"
  }

@ReactMethod
fun initialize(promise: Promise) {
  promise.resolve("LibVLC работает")
}

  @ReactMethod
  fun startRecording(streamUrl: String, fileName: String, promise: Promise) {
    if (mediaPlayer !== null) {
        promise.reject("RECORDING_IN_PROGRESS", "Запись уже идет.")
        return
    }
    try{
        val musicDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_MUSIC)
        if (!musicDir.exists()) {
            musicDir.mkdirs()
        }
        val outputFile = File(musicDir, fileName)
        val outputFilePath = outputFile.absolutePath
        lastKnownOutputFilePath = outputFilePath


        Log.d("VlcRecordingModule", "Попытка сохранения файла по пути: $outputFilePath")

        val options = ArrayList<String>()
        // VLC options for streaming/recording
        // This line specifies transcoding to mp3 and saving to a file.
        // Be careful with raw muxer, it might not be suitable for all cases.
        // You might want to use ":mux=mp3" or ":mux=ogg" if you want a proper container.
        // For simple MP3, raw might be okay, but check VLC documentation for best practices.
        val sout = ":sout=#transcode{acodec=mp3,ab=128}:std{access=file,mux=mp3,dst=$outputFilePath}"
        options.add(sout)

        libVLC = LibVLC(reactApplicationContext, options)
        // Corrected: Use the instance of libVLC, not the class itself
        val media = Media(libVLC, Uri.parse(streamUrl)) // <-- Исправлено здесь
        mediaPlayer = MediaPlayer(libVLC)
        mediaPlayer?.let {
            it.media = media
            media.release()
            it.play()
            promise.resolve("Запись успешно началась, сохранение в $outputFilePath")
        }
    } catch (e: Exception) {
        promise.reject("RECORDING_FAILED", "Не удалось начать запись: ${e.message}")
    }
  }

  @ReactMethod
  fun stopRecording(promise: Promise) {
   mediaPlayer?.stop()
   mediaPlayer?.release() // <-- Исправлена опечатка здесь: mediaPLayer -> mediaPlayer
   libVLC?.release()
   mediaPlayer = null
   libVLC = null

   if (lastKnownOutputFilePath !== null) {
        Log.d("VlcRecordingModule", "Попытка сканирования файла по пути: $lastKnownOutputFilePath")
   }

   promise.resolve("Запись остановлена, ресурсы очищены.")
  } // <-- Добавлена недостающая закрывающая скобка здесь
}