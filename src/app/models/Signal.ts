export default class Signal {
    eeg: number[];
    eegConverted: number[];
    gyro: number[];
    gyroConverted: number[];
    time: number;

    constructor() {
        this.time = Date.now();
    }

    arrayFromString(arr: string) {
        return arr.split(',').map((value) => {
            return parseFloat(value);
        });
    }

    addPluginPacket(packet: string) {
        this.eeg = this.arrayFromString(packet);
        // TODO
    }
}