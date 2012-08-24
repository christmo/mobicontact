package com.app.mov;

import android.os.Bundle;
import android.view.KeyEvent;
import org.apache.cordova.DroidGap;

public class ContactUpdater extends DroidGap {

    /**
     * Called when the activity is first created.
     */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        super.loadUrl("file:///android_asset/www/index.html");
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK) {
            if (appView.canGoBack()) {
                appView.goBack();
                return true;
            }
        }
        return super.onKeyDown(keyCode, event);
    }
}
