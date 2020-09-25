package io.ionic.starter.components;

import android.os.AsyncTask;

import java.io.PrintWriter;
import java.net.Socket;

public class DataSocket extends AsyncTask<String, Void, Void> {

    private Socket socket;
    private PrintWriter printWriter;
    private SocketSettings socketSettings;

    public DataSocket(SocketSettings socketSettings) {
        this.socketSettings = socketSettings;
    }

    @Override
    protected Void doInBackground(String... strings) {
        String message = strings[0];
        try {
            socket = new Socket(socketSettings.getHost(), socketSettings.getPort());
            printWriter = new PrintWriter(socket.getOutputStream());
            printWriter.write(message);
            printWriter.flush();
            printWriter.close();
            socket.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public String createData(String type, String values) {
        return "[type="+type+"]#"+values;
    }
}
