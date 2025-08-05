# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# react-native-reanimated
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# Add any project specific keep options here:

# Правило для нашего IcyMetaModule, чтобы он не был удален или переименован
-keep class com.india3.myapp.IcyMetaModule { *; }

# Это более общее правило - хорошая практика на будущее.
# Оно сохраняет все публичные классы в твоем пакете, у которых есть методы,
# помеченные как @ReactMethod.
-keep public class com.india3.myapp.* {
    @com.facebook.react.bridge.ReactMethod
    public <methods>;
}