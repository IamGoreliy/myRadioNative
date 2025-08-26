package com.india3.worldwaves

import android.app.PendingIntent
import android.app.Service
import android.content.Intent
import android.os.Binder
import android.os.IBinder
import androidx.core.app.NotificationCompat
import androidx.media.app.NotificationCompat.MediaStyle
import android.app.NotificationChannel
import android.app.NotificationManager
import android.os.Build
import androidx.media.session.MediaButtonReceiver
import android.support.v4.media.session.MediaSessionCompat
import androidx.localbroadcastmanager.content.LocalBroadcastManager
import android.support.v4.media.MediaMetadataCompat
import android.support.v4.media.session.PlaybackStateCompat
import org.videolan.libvlc.LibVLC
import org.videolan.libvlc.Media
import org.videolan.libvlc.MediaPlayer
import android.net.Uri
import android.os.Handler
import android.os.Looper
import android.util.Log

class RadioService : Service() {
    private val binder = RadioServiceBinder()
    private lateinit var mediaSession: MediaSessionCompat
    private var isPlaying = false
    private var stationName: String = "Internet Radio"
    private var trackName: String = "Live"
    private var currentUrl: String? = null
    private var isForegroundStarted = false
    private lateinit var placeholderNotification: NotificationCompat.Builder

    private val mainHandler = Handler(Looper.getMainLooper())
    private lateinit var libVLC: LibVLC
    private lateinit var mediaPlayer: MediaPlayer

    companion object {
        const val NOTIFICATION_CHANNEL_ID = "media_playback_channel"
        private const val TAG = "RadioService"
        const val ACTION_NEXT = "com.india3.worldwaves.ACTION_NEXT"
        const val ACTION_PREVIOUS = "com.india3.worldwaves.ACTION_PREVIOUS"
        const val ACTION_PLAYBACK_STATE_CHANGED = "com.india3.worldwaves.ACTION_PLAYBACK_STATE_CHANGED"
        const val EXTRA_PLAYBACK_STATE = "com.india3.worldwaves.EXTRA_PLAYBACK_STATE"
    }

    override fun onCreate() {
        super.onCreate()
        Log.d(TAG, "Service created")

        val placeholderNotification = NotificationCompat.Builder(this, NOTIFICATION_CHANNEL_ID)
            .setContentTitle("Запуск радио…")
            .setContentText("Подключение к станции")
            .setSmallIcon(android.R.drawable.ic_media_play)
            .setPriority(NotificationCompat.PRIORITY_LOW)


        if (!isForegroundStarted) {
            startForeground(1, placeholderNotification.build())
            isForegroundStarted = true
        }

        // Создание канала уведомлений
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                NOTIFICATION_CHANNEL_ID,
                "Media Playback",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Channel for media playback notifications"
            }
            val notificationManager = getSystemService(NotificationManager::class.java)
            notificationManager.createNotificationChannel(channel)
        }

        // Инициализация LibVLC и MediaPlayer
        try {
            libVLC = LibVLC(this)
            mediaPlayer = MediaPlayer(libVLC)
        } catch (e: Exception) {
            Log.e(TAG, "Failed to initialize LibVLC or MediaPlayer: ${e.message}")
            stopSelf()
            return
        }

        // Инициализация MediaSession
        mediaSession = MediaSessionCompat(this, TAG).apply {
            setCallback(object : MediaSessionCompat.Callback() {
                override fun onPlay() {
                    Log.d(TAG, "MediaSession: onPlay called")
                    mainHandler.post {
                        currentUrl?.let {
                            try {
                                if (!mediaPlayer.isPlaying) {
                                    startPlayback(it)
                                    setPlaybackState(PlaybackStateCompat.STATE_PLAYING)
                                }
                            } catch (e: Exception) {
                                Log.e(TAG, "Error in onPlay: ${e.message}")
                            }
                        }
                    }
                }

                override fun onPause() {
                    Log.d(TAG, "MediaSession: onPause called")
                    mainHandler.post {
                        try {
                            if (mediaPlayer.isPlaying) {
                                mediaPlayer.pause()
                                setPlaybackState(PlaybackStateCompat.STATE_PAUSED)
                            }
                        } catch (e: Exception) {
                            Log.e(TAG, "Error in onPause: ${e.message}")
                        }
                    }
                }

                override fun onSkipToNext() {
                    Log.d(TAG, "MediaSession: onSkipToNext called")
                    val intent = Intent(ACTION_NEXT)
                    LocalBroadcastManager.getInstance(this@RadioService).sendBroadcast(intent)
                }

                override fun onSkipToPrevious() {
                    Log.d(TAG, "MediaSession: onSkipToPrevious called")
                    val intent = Intent(ACTION_PREVIOUS)
                    LocalBroadcastManager.getInstance(this@RadioService).sendBroadcast(intent)
                }

                override fun onStop() {
                    Log.d(TAG, "MediaSession: onStop called")
                    mainHandler.post {
                        try {
                            if (mediaPlayer.isPlaying) {
                                mediaPlayer.stop()
                            }
                            setPlaybackState(PlaybackStateCompat.STATE_STOPPED)
                            stopForeground(true)
                            stopSelf()
                        } catch (e: Exception) {
                            Log.e(TAG, "Error in onStop: ${e.message}")
                        }
                    }
                }
            })
            setPlaybackState(
                PlaybackStateCompat.Builder()
                    .setState(PlaybackStateCompat.STATE_NONE, 0, 1f)
                    .setActions(
                        PlaybackStateCompat.ACTION_PLAY or
                                PlaybackStateCompat.ACTION_PAUSE or
                                PlaybackStateCompat.ACTION_PLAY_PAUSE or
                                PlaybackStateCompat.ACTION_STOP or
                                PlaybackStateCompat.ACTION_SKIP_TO_NEXT or
                                PlaybackStateCompat.ACTION_SKIP_TO_PREVIOUS
                    )
                    .build()
            )
            setMetadata(
                MediaMetadataCompat.Builder()
                    .putString(MediaMetadataCompat.METADATA_KEY_TITLE, trackName)
                    .putString(MediaMetadataCompat.METADATA_KEY_ARTIST, stationName)
                    .build()
            )
            isActive = true
        }

        // Запуск foreground service с уведомлением
        updateNotification()

        mediaPlayer.setEventListener { event ->
            mainHandler.post {
                when (event.type) {
                    MediaPlayer.Event.Playing -> {
                        Log.d(TAG, "MediaPlayer: Playing")
                        setPlaybackState(PlaybackStateCompat.STATE_PLAYING)
                    }
                    MediaPlayer.Event.Paused, MediaPlayer.Event.Stopped, MediaPlayer.Event.EncounteredError -> {
                        Log.d(TAG, "MediaPlayer: Paused/Stopped/Error")
                        setPlaybackState(PlaybackStateCompat.STATE_PAUSED)
                    }
                }
            }
        }
    }

    private fun updateNotification() {
        val state = mediaSession.controller?.playbackState?.state ?: PlaybackStateCompat.STATE_NONE
        val isPlayingNow = state == PlaybackStateCompat.STATE_PLAYING

        val playPauseAction = if (isPlayingNow) {
            NotificationCompat.Action(
                android.R.drawable.ic_media_pause, "Pause",
                MediaButtonReceiver.buildMediaButtonPendingIntent(this, PlaybackStateCompat.ACTION_PAUSE)
            )
        } else {
            NotificationCompat.Action(
                android.R.drawable.ic_media_play, "Play",
                MediaButtonReceiver.buildMediaButtonPendingIntent(this, PlaybackStateCompat.ACTION_PLAY)
            )
        }

        val prevAction = NotificationCompat.Action(
            android.R.drawable.ic_media_previous, "Previous",
            MediaButtonReceiver.buildMediaButtonPendingIntent(this, PlaybackStateCompat.ACTION_SKIP_TO_PREVIOUS)
        )

        val nextAction = NotificationCompat.Action(
            android.R.drawable.ic_media_next, "Next",
            MediaButtonReceiver.buildMediaButtonPendingIntent(this, PlaybackStateCompat.ACTION_SKIP_TO_NEXT)
        )

        val notification = NotificationCompat.Builder(this, NOTIFICATION_CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_media_play)
            .setContentTitle(stationName)
            .setContentText(trackName)
            .addAction(prevAction)
            .addAction(playPauseAction)
            .addAction(nextAction)
            .setStyle(
                MediaStyle()
                    .setMediaSession(mediaSession.sessionToken)
                    .setShowActionsInCompactView(0, 1, 2) // prev, play/pause, next
            )
            .setDeleteIntent(
                MediaButtonReceiver.buildMediaButtonPendingIntent(this, PlaybackStateCompat.ACTION_STOP)
            )
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .build()

        val notificationManager = getSystemService(NOTIFICATION_SERVICE) as NotificationManager

        mainHandler.post {
            try {
                when (state) {
                    PlaybackStateCompat.STATE_PLAYING -> {
                        startForeground(1, notification)
                    }
                    PlaybackStateCompat.STATE_PAUSED -> {
                        notificationManager.notify(1, notification)
                        stopForeground(false)
                    }
                    PlaybackStateCompat.STATE_STOPPED, PlaybackStateCompat.STATE_NONE -> {
                        stopForeground(true)
                        notificationManager.cancel(1)
                    }
                }
            } catch (e: Exception) {
                Log.e(TAG, "Error updating notification: ${e.message}")
            }
        }
    }

    private fun setPlaybackState(state: Int) {
        mainHandler.post {
            try {
                isPlaying = state == PlaybackStateCompat.STATE_PLAYING
                val stateBuilder = PlaybackStateCompat.Builder()
                    .setActions(
                        PlaybackStateCompat.ACTION_PLAY or
                                PlaybackStateCompat.ACTION_PAUSE or
                                PlaybackStateCompat.ACTION_PLAY_PAUSE or
                                PlaybackStateCompat.ACTION_STOP or
                                PlaybackStateCompat.ACTION_SKIP_TO_NEXT or
                                PlaybackStateCompat.ACTION_SKIP_TO_PREVIOUS
                    )
                    .setState(state, 0, 1f)
                mediaSession.setPlaybackState(stateBuilder.build())

                // ЭТО ГЛАВНОЕ ИЗМЕНЕНИЕ: Отправляем событие об изменении состояния
                val intent = Intent(ACTION_PLAYBACK_STATE_CHANGED)
                val stateString = when (state) {
                    PlaybackStateCompat.STATE_PLAYING -> "PLAYING"
                    PlaybackStateCompat.STATE_PAUSED -> "PAUSED"
                    else -> "STOPPED"
                }
                intent.putExtra(EXTRA_PLAYBACK_STATE, stateString)
                LocalBroadcastManager.getInstance(this@RadioService).sendBroadcast(intent)

                updateNotification()
            } catch (e: Exception) {
                Log.e(TAG, "Error setting playback state: ${e.message}")
            }
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {

        Log.d(TAG, "onStartCommand: Received intent $intent")
        try {
            MediaButtonReceiver.handleIntent(mediaSession, intent)
        } catch (e: Exception) {
            Log.e(TAG, "Error handling intent: ${e.message}")
        }
        return START_STICKY
    }

    fun startPlayback(url: String?) {
        mainHandler.post {
            try {
                if (url == null) {
                    Log.w(TAG, "startPlayback: URL is null")
                    return@post
                }
                this.currentUrl = url
                val media = Media(libVLC, Uri.parse(url))
                mediaPlayer.media = media
                media.release()
                mediaPlayer.play()
                Log.d(TAG, "startPlayback: Playing $url")
            } catch (e: Exception) {
                Log.e(TAG, "Error in startPlayback: ${e.message}")
            }
        }
    }

    fun stopPlayback() {
        mainHandler.post {
            try {
                if (mediaPlayer.isPlaying) {
                    mediaPlayer.pause()
                    Log.d(TAG, "stopPlayback: Paused")
                }
            } catch (e: Exception) {
                Log.e(TAG, "Error in stopPlayback: ${e.message}")
            }
        }
    }

    fun updateMetadata(newStationName: String, newTrackName: String) {
        mainHandler.post {
            try {
                this.stationName = newStationName
                this.trackName = newTrackName
                mediaSession.setMetadata(
                    MediaMetadataCompat.Builder()
                        .putString(MediaMetadataCompat.METADATA_KEY_TITLE, trackName)
                        .putString(MediaMetadataCompat.METADATA_KEY_ARTIST, stationName)
                        .build()
                )
                updateNotification()
                Log.d(TAG, "updateMetadata: Station=$newStationName, Track=$newTrackName")
            } catch (e: Exception) {
                Log.e(TAG, "Error updating metadata: ${e.message}")
            }
        }
    }

    override fun onBind(intent: Intent?): IBinder = binder

    inner class RadioServiceBinder : Binder() {
        fun getService(): RadioService = this@RadioService
    }

    override fun onDestroy() {
        Log.d(TAG, "Service destroyed")
        try {
            mediaSession.release()
            mediaPlayer.release()
            libVLC.release()
            stopForeground(true)
        } catch (e: Exception) {
            Log.e(TAG, "Error in onDestroy: ${e.message}")
        }
        super.onDestroy()
    }
}