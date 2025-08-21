package com.india3.worldwaves;

import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.ServiceConnection;
import android.os.IBinder;

import androidx.annotation.Nullable;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class RadioModule extends ReactContextBaseJavaModule {
    private RadioService radioService;
    private boolean isBound = false;
    private ReactApplicationContext reactContext;

    RadioModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
        registerMediaButtonReceiver();
    }

    @Override
    public String getName() {
        return "RadioModule";
    }

    private BroadcastReceiver mediaButtonReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            String action = intent.getAction();
            if (RadioService.ACTION_NEXT.equals(action)) {
                sendEvent("onNextTrack", null);
            } else if (RadioService.ACTION_PREVIOUS.equals(action)) {
                sendEvent("onPrevTrack", null);
            } else if (RadioService.ACTION_PLAYBACK_STATE_CHANGED.equals(action)) {
                String state = intent.getStringExtra(RadioService.EXTRA_PLAYBACK_STATE);
                WritableMap params = Arguments.createMap();
                params.putString("state", state);
                sendEvent("onPlaybackStateChanged", params);
            }
        }
    };

    private void registerMediaButtonReceiver() {
        IntentFilter filter = new IntentFilter();
        filter.addAction(RadioService.ACTION_NEXT);
        filter.addAction(RadioService.ACTION_PREVIOUS);
        filter.addAction(RadioService.ACTION_PLAYBACK_STATE_CHANGED);
        LocalBroadcastManager.getInstance(getReactApplicationContext()).registerReceiver(mediaButtonReceiver, filter);
    }

    private ServiceConnection connection = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName className, IBinder service) {
            RadioService.RadioServiceBinder binder = (RadioService.RadioServiceBinder) service;
            radioService = binder.getService();
            isBound = true;
        }

        @Override
        public void onServiceDisconnected(ComponentName arg0) {
            isBound = false;
        }
    };

    @ReactMethod
    public void startService() {
        Intent intent = new Intent(reactContext, RadioService.class);
        reactContext.startForegroundService(intent);
        reactContext.bindService(intent, connection, Context.BIND_AUTO_CREATE);
    }

    @ReactMethod
    public void startPlayback(String url) {
        if (isBound) {
            radioService.startPlayback(url);
        }
    }

    @ReactMethod
    public void stopPlayback() {
        if (isBound) {
            radioService.stopPlayback();
        }
    }

    @ReactMethod
    public void updateMetadata(String stationName, String trackName) {
        if (isBound) {
            radioService.updateMetadata(stationName, trackName);
        }
    }

    @ReactMethod
    public void stopService() {
        if (isBound) {
            reactContext.unbindService(connection);
            isBound = false;
        }
        reactContext.stopService(new Intent(reactContext, RadioService.class));
    }

    @Override
    public void onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy();
        LocalBroadcastManager.getInstance(getReactApplicationContext()).unregisterReceiver(mediaButtonReceiver);
    }

    private void sendEvent(String eventName, @Nullable WritableMap params) {
        getReactApplicationContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
}