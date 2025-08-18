package com.india3.worldwaves;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.IBinder;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class RadioModule extends ReactContextBaseJavaModule {
    private RadioService radioService;
    private boolean isBound = false;
    private ReactApplicationContext reactContext;

    RadioModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
    }

    @Override
    public String getName() {
        return "RadioModule";
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
}