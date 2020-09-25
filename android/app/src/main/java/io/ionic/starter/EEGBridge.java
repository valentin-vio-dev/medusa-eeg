package io.ionic.starter;

import com.getcapacitor.JSObject;
import com.getcapacitor.NativePlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;

import io.ionic.starter.components.BluetoothScanner;
import io.ionic.starter.components.Device;
import io.ionic.starter.components.DevicesHandler;
import io.ionic.starter.components.GattCallback;

@NativePlugin()
public class EEGBridge extends Plugin {

    private DevicesHandler devicesHandler = new DevicesHandler(this);
    private BluetoothScanner bluetoothScanner;

    @PluginMethod
    public void scan(PluginCall call) {
        int time = call.getInt("time");
        devicesHandler.clear();
        bluetoothScanner = new BluetoothScanner(devicesHandler, time, call);
        bluetoothScanner.start();
    }

    @PluginMethod
    public void connect(PluginCall call) {
        Device device = devicesHandler.getDeviceByAddress(call.getString("device_address"));
        if (device != null) {
            device.connect(new GattCallback(this, device));
            call.resolve();
        } else {
            call.reject("Error while connecting...");
        }
    }

    @PluginMethod
    public void disconnect(PluginCall call) {
        Device device = devicesHandler.getDeviceByAddress(call.getString("device_address"));
        if (device != null) {
            device.disconnect();
            call.resolve();
        } else {
            call.reject("Error while disconnecting...");
        }
    }

    public void notifyScannedDevices(Device device) {
        JSObject ret = new JSObject();
        ret.put("name", device.getName());
        ret.put("address", device.getAddress());
        notifyListeners("device_scan_result", ret);
    }

    public void notifyEEGData(String data) {
        JSObject ret = new JSObject();
        ret.put("data", data);
        notifyListeners("eeg_data", ret);
    }
}
