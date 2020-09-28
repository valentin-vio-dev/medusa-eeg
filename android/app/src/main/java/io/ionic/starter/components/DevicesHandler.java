package io.ionic.starter.components;

import com.getcapacitor.JSObject;

import java.util.ArrayList;

import io.ionic.starter.EEGBridge;

public class DevicesHandler {

    private ArrayList<Device> devices;
    private EEGBridge eegBridge;

    public DevicesHandler(EEGBridge eegBridge) {
        this.devices = new ArrayList<>();
        this.eegBridge = eegBridge;
    }

    public boolean containsDevice(Device check) {
        for (Device device: devices) {
            if (device.getUpperName().equals(check.getUpperName())) {
                return true;
            }
        }
        return false;
    }

    public boolean addDevice(Device device) {
        if (containsDevice(device)) return false;
        devices.add(device);
        eegBridge.notifyScannedDevices(device);
        return true;
    }

    public Device getDeviceByAddress(String address) {
        for (Device device: devices) {
            if (device.getAddress().equals(address)) {
                return device;
            }
        }
        return null;
    }

    public ArrayList<Device> getDevices() {
        return devices;
    }

    public void setDevices(ArrayList<Device> devices) {
        this.devices = devices;
    }

    public void clear() {
        devices.clear();
    }


}
