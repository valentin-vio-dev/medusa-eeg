package io.ionic.starter.components;

import android.os.Build;
import android.util.Log;

import androidx.annotation.RequiresApi;

import java.util.Arrays;

public class Utils {

    public static void info(String msg) {
        Log.i("Info", msg);
    }

    public static void warning(String msg) {
        Log.w("Warning", msg);
    }

    public static void error(String msg) {
        Log.e("Error", msg);
    }

    public static void keyValueInfo(String key, String value) {
        Log.i(key, value);
    }

    public static String keyValue(String key, String value) {
        return key.toUpperCase() + "::" + value;
    }

    public static String joinArray(long[] values, String delimiter) {
        return Arrays.toString(values).replace("[", "").replace("]", "").replaceAll(", ", delimiter);
    }

    public static String joinArray(double[] values, String delimiter) {
        return Arrays.toString(values).replace("[", "").replace("]", "").replaceAll(", ", delimiter);
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    public static String joinBytes(byte[] bytes, String delimiter) {
        return Arrays.toString(Data.byteArrayToUnsignedSM(bytes)).replace("[", "").replace("]", "").replaceAll(", ", delimiter);
    }

    public static String joinData(double[] data) {
        return Arrays.toString(data).replace("[", "").replace("]", "").replaceAll(", ", ",");
    }

    public static String joinData(long[] data) {
        return Arrays.toString(data).replace("[", "").replace("]", "").replaceAll(", ", ",");
    }

}
