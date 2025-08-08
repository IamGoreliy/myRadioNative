package com.india3.worldwaves

import android.content.Context
import android.net.Uri
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import org.videolan.libvlc.LibVLC
import org.videolan.libvlc.Media
import org.videolan.libvlc.MediaPlayer

class LibVLCModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
  private val libVLC: LibVLC
  private val mediaPlayer: MediaPlayer

  init {
    val options = ArrayList<String>()
    libVLC = LibVLC(reactContext, options)
    mediaPlayer = MediaPlayer(libVLC)
  }

  override fun getName(): String {
    return "LibVLCModule"
  }

  @ReactMethod
  fun playStream(url: String) {
    val media = Media(libVLC, Uri.parse(url))
    mediaPlayer.media = media
    mediaPlayer.play()
  }

  @ReactMethod
  fun recordStream(url: String, filePath: String) {
    val media = Media(libVLC, Uri.parse(url))
    media.addOption(":sout=#file{dst=$filePath}")
    media.addOption(":no-sout-all")
    media.addOption(":sout-keep")

    mediaPlayer.media = media
    mediaPlayer.play()
  }

  @ReactMethod
  fun stop() {
    mediaPlayer.stop()
  }
}
