package io.ionic.starter.components;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.le.BluetoothLeScanner;
import android.bluetooth.le.ScanCallback;
import android.bluetooth.le.ScanFilter;
import android.bluetooth.le.ScanResult;
import android.bluetooth.le.ScanSettings;
import android.os.Build;
import android.os.Handler;
import android.os.ParcelUuid;

import androidx.annotation.RequiresApi;

import com.getcapacitor.PluginCall;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import io.ionic.starter.EEGBridge;

public class BluetoothScanner {

    private final UUID[] UUIDs = new UUID[]{EpocPlus.UUID_DEVICE};

    private long scanPeriod;
    private boolean scanning;
    private Handler handler;
    private BluetoothLeScanner bluetoothLeScanner;
    private DevicesHandler devicesHandler;

    private PluginCall pluginCall;

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    public BluetoothScanner(DevicesHandler devicesHandler, long scanPeriod, PluginCall pluginCall) {
        this.scanPeriod = scanPeriod;
        this.scanning = false;
        this.handler = new Handler();
        this.devicesHandler = devicesHandler;
        this.bluetoothLeScanner = BluetoothAdapter.getDefaultAdapter().getBluetoothLeScanner();
        this.pluginCall = pluginCall;
    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    public void start() {
        devicesHandler.clear();
        scan(true);
    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    public void stop() {
        scan(false);
    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    private void scan(boolean enable) {
        List<ScanFilter> filters = new ArrayList<>();
        for (UUID uuid : UUIDs) {
            ScanFilter filter = new ScanFilter.Builder().setServiceUuid(new ParcelUuid(uuid)).build();
            filters.add(filter);
        }

        if (enable && !scanning) {
            handler.postDelayed(() -> {
                scanning = false;
                pluginCall.resolve();
                bluetoothLeScanner.stopScan(scanCallback);
            }, scanPeriod);

            scanning = true;
            ScanSettings settings = new ScanSettings.Builder().build();
            bluetoothLeScanner.startScan(filters, settings, scanCallback);
        } else {
            scanning = false;
            bluetoothLeScanner.stopScan(scanCallback);
            pluginCall.resolve();
        }
    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    private ScanCallback scanCallback = new ScanCallback() {

        @Override
        public void onScanResult(int callbackType, ScanResult result) {
            BluetoothDevice bluetoothDevice = result.getDevice();
            Device device = Device.create(bluetoothDevice);
            devicesHandler.addDevice(device);
            // TODO - notifiy devices
        }

        @Override
        public void onBatchScanResults(List<ScanResult> results) {
            for (ScanResult sr : results) {
                Utils.keyValueInfo("onBatchScanResults", sr.toString());
            }
        }

        @Override
        public void onScanFailed(int errorCode) {
            Utils.error("onScanFailed - " + errorCode);
        }
    };

    public boolean isScanning() {
        return scanning;
    }
}
