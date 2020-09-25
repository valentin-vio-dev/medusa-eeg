package io.ionic.starter.components;

import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothGattCallback;
import android.os.Build;

import androidx.annotation.RequiresApi;

import java.util.UUID;

public class EpocPlus extends Device {

    public static final UUID UUID_DEVICE =        UUID.fromString("81072F40-9F3D-11E3-A9DC-0002A5D5C51B");
    public static final UUID UUID_EEG = UUID.fromString("81072F41-9F3D-11E3-A9DC-0002A5D5C51B");
    public static final UUID UUID_GYRO = UUID.fromString("81072F42-9F3D-11E3-A9DC-0002A5D5C51B");

    public EpocPlus(BluetoothDevice bluetoothDevice) {
        super(bluetoothDevice);
        super.setUUIDDevice(UUID_DEVICE);
        super.setUUIDEeg(UUID_EEG);
        super.setUUIDGyro(UUID_GYRO);
    }

    @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN_MR2)
    public void connect(BluetoothGattCallback bluetoothGattCallback) {
        super.connect(bluetoothGattCallback);
    }

    @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN_MR2)
    public void disconnect() {
        super.disconnect();
    }

    public boolean isConnected() {
        return super.isConnected();
    }

    @Override
    public byte[] decrypt(byte[] data){
        return super.getDecryptor().decrypt(data);
    }

    @Override
    public double[] convertEEG(long[] data) {
        double[] converted = new double[16];
        int index = 0;

        for(int i=2;i<16;i+=2) {
            converted[index] = (((data[i] * .128205128205129) + 4201.02564096001) + ((data[i+1] - 128) * 32.82051289));
            index++;
        }

        for(int i=16;i<data.length - 2;i+=2) {
            converted[index] = (((data[i] * .128205128205129) + 4201.02564096001) + ((data[i+1] - 128) * 32.82051289));
            index++;
        }

        return converted;
    }

    @Override
    public double[] convertGyro(long[] data) {
        return null;
    }

    @Override
    public int battery(long value) {
        return Math.max(0, Math.min(100, (int) (((value - 55) + 10) * 10)));
    }

    @Override
    public int[] AESKeyOrder() {
        return new int[]{ -1, -2, -2, -3, -3, -3, -2, -4, -1, -4, -2, -2, -4, -4, -2, -1 };
    }

    @Override
    public String getSerialFromSerialNumber(String serialNumber) {
        return "" + serialNumber.charAt(6) + serialNumber.charAt(7) + serialNumber.charAt(4) + serialNumber.charAt(5) + serialNumber.charAt(2) + serialNumber.charAt(3) + serialNumber.charAt(0) + serialNumber.charAt(1);
    }
}