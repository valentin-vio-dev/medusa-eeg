package io.ionic.starter.components;

import android.os.Build;
import androidx.annotation.RequiresApi;

public class Data {

    private int counter1, counter2;
    private byte[] packet1, packet2;
    private boolean packet1Arrived, packet2Arrived;

    public Data() {
        packet1Arrived = false;
        packet2Arrived = false;
        counter1 = -1;
        counter2 = -2;
    }

    /**
     * Returns true if packet added.
     */
    public boolean addBytes(byte[] values) {
        if (allPacketsArrived()) return false;
        if (!isEEGBrainData(values)) return false;

        int counter = packetCounter(values);
        int interpolate = interpolateValue(values);

        if (interpolate == 1) {
            packet1 = values;
            packet1Arrived = true;
            counter1 = counter;
            return true;
        } else if (interpolate == 2) {
            if (!packet1Arrived) {
                // if the first packet does not arrived before the second
                clearAll();
            } else {
                if (counter1 != counter) {
                    // if the first packet arrived but the packet counters are different
                    clearAll();
                } else {
                    // all OK
                    packet2 = values;
                    packet2Arrived = true;
                    counter2 = counter;
                    return true;
                }
            }
        }
        return false;
    }

    public boolean allPacketsArrived() {
        return packet1Arrived && packet2Arrived;
    }

    public byte[][] getData() {
        if (!allPacketsArrived()) return null;
        return new byte[][]{ trim(packet1), trim(packet2) };
    }

    public byte[] getPacket(int packet) {
        if (!allPacketsArrived()) return null;
        return new byte[][]{ trim(packet1), trim(packet2) }[packet - 1];
    }

    public long[] concatenatePackets(long[] p1, long[] p2) {
        long[] concatenated = new long[p1.length + p2.length];
        int index = 0;

        for (int i=0; i<p1.length; i++) {
            concatenated[index] = p1[i];
            index++;
        }

        for (int i=0; i<p2.length; i++) {
            concatenated[index] = p2[i];
            index++;
        }
        return concatenated;
    }

    public void clearAll() {
        counter1 = -1;
        counter2 = -2;
        packet1Arrived = false;
        packet2Arrived = false;
        packet1 = null;
        packet2 = null;
    }

    private byte[] trim(byte[] data) {
        int index = 0;
        byte[] trimmed = new byte[16];
        for (int i=2; i<18; i++) {
            trimmed[index] = data[i];
            index++;
        }
        return trimmed;
    }

    private int interpolateValue(byte[] values) {
        // 1 or 2
        return values[1];
    }

    private static int interpolateValueSM(byte[] values) {
        // 1 or 2
        return values[1];
    }

    private int packetCounter(byte[] values) {
        // 0...127
        return values[0];
    }

    public long[] pushZerosBack(long[] packet) {
        long[] result = new long[packet.length];

        int index = 0;
        for (int i=2; i<16; i++) {
            result[index] = packet[i];
            index++;
        }

        result[result.length - 2] = packet[0];
        result[result.length - 1] = packet[1];

        return result;
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    public long[] getPreparedData(Device device) {
        long[] decrypted1 = byteArrayToUnsigned(device.decrypt(getPacket(1)));
        long[] decrypted2 = byteArrayToUnsigned(device.decrypt(getPacket(2)));
        decrypted2 = pushZerosBack(decrypted2);
        return concatenatePackets(decrypted1, decrypted2);
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    public long[] byteArrayToUnsigned(byte[] values) {
        long[] unsigned = new long[values.length];
        for (int i=0; i<unsigned.length; i++) {
            unsigned[i] = Byte.toUnsignedLong(values[i]);
        }
        return unsigned;
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    public static long[] byteArrayToUnsignedSM(byte[] values) {
        long[] unsigned = new long[values.length];
        for (int i=0; i<unsigned.length; i++) {
            unsigned[i] = Byte.toUnsignedLong(values[i]);
        }
        return unsigned;
    }

    public int getBatteryValue(Device device, long[] values) {
        if (values[0] == 127) {
            return device.battery(values[30]);
        }
        return -1;
    }

    private boolean isEEGBrainData(byte[] values) {
        return interpolateValue(values) == 32 ? false : true;
    }

    public static boolean isGyroData(byte[] values) {
        return interpolateValueSM(values) == 32 ? true : false;
    }
}
