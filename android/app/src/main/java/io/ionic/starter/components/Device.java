package io.ionic.starter.components;

import android.annotation.SuppressLint;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothGattCallback;
import android.bluetooth.BluetoothManager;
import android.os.Build;

import androidx.annotation.RequiresApi;

import java.util.UUID;

public abstract class Device {

    private BluetoothDevice bluetoothDevice;
    private BluetoothGatt bluetoothGatt;
    private Decryptor decryptor;

    private UUID UUIDDevice, UUIDEeg, UUIDGyro;

    public Device(BluetoothDevice bluetoothDevice) {
        this.bluetoothDevice = bluetoothDevice;
        this.decryptor = new Decryptor(this);
    }

    @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN_MR2)
    public void connect(BluetoothGattCallback bluetoothGattCallback) {
        bluetoothGatt = bluetoothDevice.connectGatt(null, false, bluetoothGattCallback);
    }

    @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN_MR2)
    public void disconnect() {
        bluetoothGatt.close();
        bluetoothGatt.disconnect();
        bluetoothGatt = null;
    }

    public static Device create(BluetoothDevice bluetoothDevice) {
        String deviceName = bluetoothDevice.getName().toUpperCase();
        if (deviceName.contains("EPOC+")) {
            return new EpocPlus(bluetoothDevice);
        }
        return null;
    }

    public boolean hasBluetoothDevice() {
        return bluetoothDevice != null;
    }

    public String getDeviceType() {
        return this.bluetoothDevice.getName().split(" ")[0];
    }

    public String getAddress() {
        return this.bluetoothDevice.getAddress();
    }

    public String getName() {
        return this.bluetoothDevice.getName();
    }

    public String getUpperName() {
        return this.bluetoothDevice.getName().toUpperCase();
    }

    public BluetoothDevice getBluetoothDevice() {
        return bluetoothDevice;
    }

    public void setBluetoothDevice(BluetoothDevice bluetoothDevice) {
        this.bluetoothDevice = bluetoothDevice;
    }

    public boolean isConnected() {
        return bluetoothGatt != null;
    }

    public void setUUIDDevice(UUID UUIDDevice) {
        this.UUIDDevice = UUIDDevice;
    }

    public void setUUIDEeg(UUID UUIDEeg) {
        this.UUIDEeg = UUIDEeg;
    }

    public void setUUIDGyro(UUID UUIDGyro) {
        this.UUIDGyro = UUIDGyro;
    }

    public UUID getUUIDDevice() {
        return UUIDDevice;
    }

    public UUID getUUIDEeg() {
        return UUIDEeg;
    }

    public UUID getUUIDGyro() {
        return UUIDGyro;
    }

    public Decryptor getDecryptor() {
        return decryptor;
    }

    public void setDecryptor(Decryptor decryptor) {
        this.decryptor = decryptor;
    }

    abstract public byte[] decrypt(byte[] data);
    abstract public double[] convertEEG(long[] data);
    abstract public double[] convertGyro(long[] data);
    abstract public int battery(long value);
    abstract public int[] AESKeyOrder();
    abstract public String getSerialFromSerialNumber(String serialNumber);
}
