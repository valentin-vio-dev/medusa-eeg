GraphMode = {
    live: "LIVE",
    static: "STATIC"
}

DisplayModes = {
    separate: "SEPARATE", 
    stack: "STACK"
}

class EEGPlot {

    constructor(graphMode, canvasName, width, height, numberOfChannels) {
        console.log("Graph mode: " + graphMode)
        this.graphMode = graphMode;
        this.numberOfChannels = numberOfChannels;
        this.maxLength = 128;
        this.lower = 0;
        this.upper = 100;
        this.channels = this.graphMode === GraphMode.static ? [] : this.generateEmptyChannels(numberOfChannels);
        this.ffts = null;
        this.fftEnabled = false;
        this.fftPrepared = false;
        this.tempChannels = [];
        this.channelNames = [];
        this.lineColors = this.generateRandomLineColors(numberOfChannels);
        this.displayMode = DisplayModes.separate;
        this.canvas = document.getElementById(canvasName);
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = this.canvas.getContext("2d");
        this.graphGap = (this.canvas.height / numberOfChannels) / 2;
        this.resolution = 1;
        this.canvasOptions = { backgroundColor: "#000000", baselineColor: "#111111", lineWidth: 1 };
        this.mouseDown = false;
        this.mouseLastPos = { x: 0, y: 0 };
        
        this.canvas.addEventListener("dblclick", (event) => {
            if (this.graphMode === GraphMode.live) return;
            this.zoom("IN", 20);
        });

        this.canvas.addEventListener("mousedown", (event) => {
            this.mouseDown = true;
        });

        this.canvas.addEventListener("mouseup", (event) => {
            this.mouseDown = false;
        });

        window.addEventListener("mouseup", (event) => {
            this.mouseDown = false;
        });

        this.canvas.addEventListener("mousemove", (event) => {
            if (this.graphMode === GraphMode.live) return;
            if (this.mouseDown) {
                let chmin = document.getElementById("chmin");
                let chmax = document.getElementById("chmax");

                let dx = -event.movementX * ((parseFloat(chmax.value) - parseFloat(chmin.value)) / 500);

                this.lower = parseFloat(this.lower) + parseFloat(dx);
                this.upper = parseFloat(this.upper) + parseFloat(dx);

                this.calculateRangeData();

                chmin.value = this.lower;
                chmax.value = this.upper;

                this.mouseLastPos.x = event.clientX;
                this.mouseLastPos.y = event.clientY;
            }
        });

    }

    /**
     * @param {string} mode "IN" for zoom in or "OUT" for zoom out.
     * @param {number} times The number of the iteration of the zoom.
     */
    zoom(mode, times) {
        let chmin = document.getElementById("chmin");
        let chmax = document.getElementById("chmax");

        if (chmax.value - chmin.value < 20) return; 

        this.lower = parseFloat(this.lower) - parseFloat(mode === "IN" ? -2 : 2);
        this.upper = parseFloat(this.upper) + parseFloat(mode === "IN" ? -2 : 2);

        this.calculateRangeData();

        chmin.value = this.lower;
        chmax.value = this.upper;

        if (times != 0) {
            setTimeout(() => {
                this.zoom(mode, times - 1);
            }, 10);
        } 
    }

    /**
     * Generates empty channels.
     * @param {number} numberOfChannels Number of the channels.
     */
    generateEmptyChannels(numberOfChannels) {
        let channels = [];
        for (let i=0; i<numberOfChannels; i++) {
            channels.push([]);
        }
        return channels;
    }

    /**
     * Generates random line colors.
     * @param {number} numberOfChannels Number of the channels.
     */
    generateRandomLineColors(numberOfChannels) {
        let colors = [];
        for (let i=0; i<numberOfChannels; i++) {
            let r = Math.floor(Math.random() * 255);
            let g = Math.floor(Math.random() * 255);
            let b = Math.floor(Math.random() * 255);
            colors.push("rgb(" + r + ", " + g + ", " + b +")");
        }
        return colors;
    }

    /**
     * Sets the colors of the lines.
     * @param {string[]} colors 
     */
    setLineColors(colors) {
        if (!Array.isArray(colors)) return;
        this.colors = colors;
    }

    toggleStackMode() {
        this.displayMode = DisplayModes.stack;
        this.graphGap = this.canvas.height / 2;
    }

    toggleSeparateMode() {
        this.displayMode = DisplayModes.separate;
        this.graphGap = (this.canvas.height / this.channels.length) / 2;
    }

    addLiveData(data) {
        if (this.graphMode !== GraphMode.live) return;
        if (!Array.isArray(data)) return;
        if (data.length != this.channels.length) return;
        
        for (let i=0; i<this.channels.length; i++) {
            this.channels[i].push(data[i]);
        }
    
        if (this.fftEnabled) {
            this.ffts = this.generateEmptyChannels(this.numberOfChannels);
        }

        for (let i=0; i<this.channels.length; i++) {
            if (this.channels[i].length >= this.maxLength) {
                if (this.fftEnabled) {
                    this.fftPrepared = true;
                    let fft = new FFT(this.maxLength, 128);
                    fft.forward(this.channels[i]);
                    let spectrum = fft.spectrum;
                    this.ffts[i].push(spectrum);
                }
                this.channels[i].shift();
            }
        }
        this.show();
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = this.canvasOptions.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    show() {
        this.clearCanvas();
        let resolX = 0;

        // Compute resolX
        if (this.fftEnabled && this.fftPrepared) {
            if (this.channelNames.length > 0) {
                resolX = (this.canvas.width - 60) / (this.ffts[0][0].length - 1);
            } else {
                resolX = (this.canvas.width) / (this.ffts[0][0].length - 1);
            }
        } else {
            resolX = this.canvas.width / (this.channels[0].length - 1);
        }

        // stack baseline
        if (this.displayMode === DisplayModes.stack) {
            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = this.canvasOptions.baselineColor;
            this.ctx.beginPath();
            let ay = this.canvas.height / 2;
            this.ctx.moveTo(0, ay);
            this.ctx.lineTo(canvas.width, ay);
            this.ctx.stroke();
        }

        for (let i=0; i<this.channels.length; i++) {
            // Separate Baseline
            if (this.displayMode === DisplayModes.separate) {
                this.ctx.lineWidth = 1;
                this.ctx.strokeStyle = this.canvasOptions.baselineColor;
                this.ctx.beginPath();
                let ay = i * (this.canvas.height / this.channels.length) + this.graphGap;
                this.ctx.moveTo(0, ay);
                this.ctx.lineTo(canvas.width, ay);
                this.ctx.stroke();
            }

            let isFFT = this.fftEnabled && this.fftPrepared;
            let to = (isFFT ? this.ffts[i][0].length - 1 : this.channels[i].length - 1);
            let offsetXCausedLabels = (isFFT ? (this.channelNames.length > 0 ? 60 : 0) : 0);

            for (let j=0; j<to; j++) {
                let average = (isFFT ? this.avg(this.ffts[i][0]) * 10: this.avg(this.channels[i]));
                let linesLength = (isFFT ? this.ffts.length : this.channels.length);
                let val1 = (isFFT ? this.ffts[i][0][j] * 10 : this.channels[i][j]);
                let val2 = (isFFT ? this.ffts[i][0][j+1] * 10 : this.channels[i][j+1]);

                this.ctx.lineWidth = this.canvasOptions.lineWidth;
                this.ctx.strokeStyle = this.lineColors[i];
                this.ctx.beginPath();
                this.ctx.lineCap = "round";
                let x1 = resolX * j;
                let y1 = (this.displayMode === DisplayModes.separate ? (i * (this.canvas.height / linesLength)) : 0) + (average - val1) * this.resolution + this.graphGap;
                let x2 = resolX * j + resolX;
                let y2 = (this.displayMode === DisplayModes.separate ? (i * (this.canvas.height / linesLength)) : 0) + (average - val2) * this.resolution + this.graphGap;
                this.ctx.moveTo(offsetXCausedLabels + x1, y1);
                this.ctx.lineTo(offsetXCausedLabels + x2, y2);
                this.ctx.stroke();
            }
        }

        // Channel names
        let n = (this.channels.length <= this.channelNames.length) ? this.channels.length : this.channelNames.length;
        for (let i=0; i<n; i++) {
            let gap = (this.canvas.height / this.channels.length) / 2;
            this.ctx.fillStyle = this.lineColors[i];
            let yR = (i * (this.canvas.height / this.channels.length));
            this.ctx.fillRect(0, yR, 50, gap * 2);

            this.ctx.beginPath();
            this.ctx.lineWidth = 10;
            this.ctx.strokeStyle = this.canvasOptions.backgroundColor;
            this.ctx.rect(0, yR, 50, gap * 2);
            this.ctx.stroke();
            this.ctx.fillStyle = this.invertColor(this.rgbToHex(this.lineColors[i]), true);
            this.ctx.font = "12px Arial";
            let yT = (i * (this.canvas.height / this.channels.length)) + gap;
            this.ctx.textAlign = "center";
            this.ctx.fillText(this.channelNames[i], 25, yT + 5);
        }
    }

    avg(data) {
        let avg = 0;
        for (let i=0; i<data.length; i++) {
            avg += data[i];
        }
        return avg / data.length;
    }

    setResolution(resolution) {
        this.resolution = resolution;
    }

    setChannelNames(channelNames) {
        this.channelNames = channelNames;
    }

    setStaticModeData(channels) {
        if (this.graphMode !== GraphMode.static) return;
        if (this.numberOfChannels != channels.length) return;
        this.tempChannels = channels;
        this.channels = this.tempChannels;
        this.calculateRangeData();
    }

    setLower(lower) {
        if (this.graphMode === GraphMode.live) return;
        this.lower = lower;
        this.calculateRangeData();
    }

    setUpper(upper) {
        if (this.graphMode === GraphMode.live) return;
        this.upper = upper;
        this.calculateRangeData();
    }

    calculateRangeData() {
        this.channels = this.generateEmptyChannels(this.numberOfChannels);
        let jumps = Math.floor((this.upper - this.lower) / 250) < 1 ? 1 : Math.floor((this.upper - this.lower) / 250);

        for (let i=0; i<this.tempChannels.length; i++) {
            for (let j=0; j<this.tempChannels[i].length; j+=jumps) {
                // average between the jump space
                let sum = 0;
                for (let k=j; k<(j+jumps); k++) {
                    sum += this.tempChannels[i][k];
                }

                sum /= jumps;

                if (j >= this.lower && j <= this.upper) {
                    this.channels[i].push(sum);
                }
            }
        }

        this.show();
    }

    enableLiveFFT() {
        this.fftEnabled = true;
    }

    disableLiveFFT() {
        this.fftEnabled = true;
    }

    setLivePlotMaxLength(maxLength) {
        this.maxLength = maxLength;
    }

    invertColor(hex, bw) {
        if (hex.indexOf('#') === 0) {
            hex = hex.slice(1);
        }
        // convert 3-digit hex to 6-digits.
        if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        if (hex.length !== 6) {
            throw new Error('Invalid HEX color.');
        }
        var r = parseInt(hex.slice(0, 2), 16), g = parseInt(hex.slice(2, 4), 16), b = parseInt(hex.slice(4, 6), 16);
        if (bw) {
            // http://stackoverflow.com/a/3943023/112731
            return (r * 0.299 + g * 0.587 + b * 0.114) > 186
                ? '#000000'
                : '#FFFFFF';
        }
        // invert color components
        r = (255 - r).toString(16);
        g = (255 - g).toString(16);
        b = (255 - b).toString(16);
        // pad each with zeros and return
        return "#" + this.padZero(r) + this.padZero(g) + this.padZero(b);
    }

    componentToHex(c) {
        let hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
      
    rgbToHex(rgbString) {
        let formated = rgbString.replace("rgb", "").replace("(", "").replace(")", "").replaceAll(" ", "").split(",");
        return "#" + this.componentToHex(parseInt(formated[0])) + this.componentToHex(parseInt(formated[1])) + this.componentToHex(parseInt(formated[2]));
    }

    padZero(str, len) {
        len = len || 2;
        var zeros = new Array(len).join('0');
        return (zeros + str).slice(-len);
    }
}