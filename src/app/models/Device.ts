import { Plugins } from "@capacitor/core";

export default class Device {
    name: string;
    address: string;
    connected: boolean;

    constructor(name: string, address: string) {
        this.name = name;
        this.address = address;
        this.connected = false;
    }

    connect() {
        return new Promise(async (resolve, reject) => {
            await Plugins.EEGBridge.connect({name}).then(() => {
                this.connected = true;
                resolve();
            }).catch((err) => {
                this.connected = false;
                reject(err);
            });
        });
    }

    disconnect() {
        return Plugins.EEGBridge.disconnect();
    }
}