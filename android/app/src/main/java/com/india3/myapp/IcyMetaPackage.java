// /android/app/src/main/java/com/india3/myapp/IcyMetaPackage.java

package com.india3.myapp;

import androidx.annotation.NonNull;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class IcyMetaPackage implements ReactPackage {

    @NonNull
    @Override
    public List<NativeModule> createNativeModules(@NonNull ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        // Здесь мы добавляем наш модуль в список
        modules.add(new IcyMetaModule(reactContext));
        return modules;
    }

    @NonNull
    @Override
    public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactContext) {
        // Мы не создаем View-компоненты, поэтому возвращаем пустой список
        return Collections.emptyList();
    }
}