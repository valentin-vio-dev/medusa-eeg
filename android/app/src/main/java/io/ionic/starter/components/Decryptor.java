package io.ionic.starter.components;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;

public class Decryptor {

    private Device device;
    private String deviceSerial;
    private byte[] AESKey;

    public Decryptor(Device device) {
        this.device = device;
        if (device.hasBluetoothDevice()) {
            this.deviceSerial = getDeviceSerialFromName(device.getName());
            this.AESKey = generateAESKey(deviceSerial);
        }
    }

    private String getDeviceSerialFromName(String deviceName) {
        return deviceName.split(" ")[1].replace("(", "").replace(")", "");
    }

    private byte[] generateAESKey(String deviceSerialNumber) {
        int aseKeyLength = 16;
        byte[] key = new byte[aseKeyLength];

        String serial = device.getSerialFromSerialNumber(deviceSerialNumber);

        byte[] serialByteArray = hexStringToByteArray(serial);

        byte[] zeros = new byte[]{
            (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x00,
            (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x00,
            (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x00
        };

        byte[] serialNumber = new byte[zeros.length + serialByteArray.length];

        System.arraycopy(zeros, 0, serialNumber, 0, zeros.length);
        System.arraycopy(serialByteArray, 0, serialNumber, zeros.length, serialByteArray.length);

        int[] order = device.AESKeyOrder();

        for(int i=0; i<aseKeyLength; i++) {
            key[i] = serialNumber[serialNumber.length + order[i]];
        }

        return key;
    }

    private byte[] hexStringToByteArray(String s) {
        int len = s.length();
        byte[] data = new byte[len/2];
        for (int i=0; i<len; i+=2) {
            data[i / 2] = (byte) ((Character.digit(s.charAt(i), 16) << 4) + Character.digit(s.charAt(i+1), 16));
        }
        return data;
    }

    private byte[] decryptPacket(byte[] key, byte[] encrypted) throws Exception {
        SecretKeySpec secretKeySpec = new SecretKeySpec(key, "AES");
        Cipher cipher = Cipher.getInstance("AES/ECB/NoPadding");
        cipher.init(Cipher.DECRYPT_MODE, secretKeySpec);
        return cipher.doFinal(encrypted);
    }

    public byte[] decrypt(byte[] encrypted) {
        try {
            return decryptPacket(AESKey, encrypted);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
