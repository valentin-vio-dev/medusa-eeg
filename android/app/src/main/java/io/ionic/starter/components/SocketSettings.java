package io.ionic.starter.components;

public class SocketSettings {

    private String host;
    private int port;

    public SocketSettings(String host, int port) {
        this.host = host;
        this.port = port;
    }

    public String getHost() {
        return host;
    }

    public int getPort() {
        return port;
    }
}
