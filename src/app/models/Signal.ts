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
        return arr.split(', ').map((value) => {
            return parseFloat(value);
        });
    }

    splitPluginPacket(packet: string) {
        /* Format: rawEEG::convertedEEG::rawGyro::convertedGyro */
        let slices = packet.split('::');
        this.eeg = this.arrayFromString(slices[0]);
        this.eegConverted = this.arrayFromString(slices[1]);
        this.gyro = this.arrayFromString(slices[2]);
        this.gyroConverted = this.arrayFromString(slices[3]);
    }
}