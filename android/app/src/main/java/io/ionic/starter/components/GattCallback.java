package io.ionic.starter.components;

import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothGattCallback;
import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothGattDescriptor;
import android.bluetooth.BluetoothGattService;
import android.bluetooth.BluetoothProfile;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;

import androidx.annotation.RequiresApi;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import io.ionic.starter.EEGBridge;

@RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN_MR2)
public class GattCallback extends BluetoothGattCallback {

    private static final int DATA_STREAM_DELAY = 1000;

    private Device device;
    private SocketSettings socketSettings;
    private List<BluetoothGattCharacteristic> characteristics;
    private Data data;
    private DataSocket dataSocket;
    private int battery = -1;

    private EEGBridge eegBridge;

    public GattCallback(EEGBridge eegBridge, Device device) {
        this.device = device;
        this.data = new Data();
        this.eegBridge = eegBridge;
        characteristics = new ArrayList<>();
    }

    public GattCallback(Device device, SocketSettings socketSettings) {
        this.device = device;
        this.data = new Data();
        this.socketSettings = socketSettings;
        characteristics = new ArrayList<>();
    }

    private void enableCharacteristicNotifications(BluetoothGatt gatt) {
        if (characteristics.size() == 0) return;

        BluetoothGattCharacteristic characteristic = characteristics.get(0);
        gatt.setCharacteristicNotification(characteristic, true);
        characteristic.setWriteType(BluetoothGattCharacteristic.WRITE_TYPE_DEFAULT);

        UUID uuidDescriptor = UUID.fromString("00002902-0000-1000-8000-00805f9b34fb");
        BluetoothGattDescriptor descriptor = characteristic.getDescriptor(uuidDescriptor);

        if (descriptor != null) {
            descriptor.setValue(BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE);
            gatt.writeDescriptor(descriptor);
        }
    }

    private void writeCharacteristicStreamByte(BluetoothGatt gatt) {
        if (characteristics.size() == 0) return;

        BluetoothGattCharacteristic characteristic = characteristics.get(0);
        characteristic.setValue(new byte[]{1, 1} );
        characteristics.remove(0);
        gatt.writeCharacteristic(characteristic);
        enableCharacteristicNotifications(gatt);
    }

    @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN_MR2)
    @Override
    public void onConnectionStateChange(BluetoothGatt gatt, int status, int newState) {
        super.onConnectionStateChange(gatt, status, newState);

        if (newState == BluetoothProfile.STATE_CONNECTED) {
            if (socketSettings != null) {
                dataSocket = new DataSocket(socketSettings);
            }

            gatt.discoverServices();
            new Handler(Looper.getMainLooper()).postDelayed(new Runnable() {
                @Override
                public void run() {
                    characteristics.add(gatt.getService(device.getUUIDDevice()).getCharacteristic(device.getUUIDEeg()));
                    //characteristics.add(gatt.getService(device.getUUIDDevice()).getCharacteristic(device.getUUIDGyro()));
                    enableCharacteristicNotifications(gatt);
                }
            }, DATA_STREAM_DELAY);
        } else if (newState == BluetoothProfile.STATE_DISCONNECTED) {
            gatt.close();
        }
    }

    @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN_MR2)
    @Override
    public void onServicesDiscovered(BluetoothGatt gatt, int status) {
        super.onServicesDiscovered(gatt, status);

        for (BluetoothGattService s: gatt.getServices()) {
            Utils.warning("Service " + s.getUuid());
            for (BluetoothGattCharacteristic c: s.getCharacteristics()) {
                Utils.warning("\t\t\tCharacteristic " + c.getUuid());
                for (BluetoothGattDescriptor d: c.getDescriptors()) {
                    Utils.warning("\t\t\t\t\t\tDescriptor " + d.getUuid());
                }
            }
        }
    }

    @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN_MR2)
    @Override
    public void onDescriptorWrite(BluetoothGatt gatt, BluetoothGattDescriptor descriptor, int status) {
        super.onDescriptorWrite(gatt, descriptor, status);
        writeCharacteristicStreamByte(gatt);
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    @Override
    public void onCharacteristicChanged(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic) {
        super.onCharacteristicChanged(gatt, characteristic);

        byte[] bytes = characteristic.getValue();

        //eegBridge.notifyEEGData(Utils.joinBytes(bytes, ","));

        if (Data.isGyroData(bytes)) {
            Utils.error(Arrays.toString(Data.byteArrayToUnsignedSM(bytes)));
        } else {
            Utils.info(Arrays.toString(Data.byteArrayToUnsignedSM(bytes)));
        }

        data.addBytes(bytes);
        if (data.allPacketsArrived()) {
            long[] decrypted = data.getPreparedData(device);
            double[] converted = device.convertEEG(decrypted);

            double[] end = new double[1];
            double sum = 0;
            for (int i=0; i<14; i++) {
                sum += converted[i];
            }
            sum /= converted.length;
            end[0] = sum;

            if (bytes[0] % 4 == 0) {
                eegBridge.notifyEEGData(Utils.joinData(converted));
            }



            data.clearAll();
            battery = data.getBatteryValue(device, decrypted) == -1 ? battery : data.getBatteryValue(device, decrypted);

            if (battery != -1) {
                Utils.warning(Arrays.toString(new int[]{battery}));
            }
        }
    }

}