var beepSound = new Audio('./beep.mp3');

var quaggaConfig = {
    numOfWorkers: 4,    //Cores amount
	frequency: 4,
	locate: true,
    inputStream: {
        name: "Live",
        type: "LiveStream",
        target: document.querySelector('#cameraCanvas'),
    },
    decoder: {
        readers: ["ean_reader"],
        //debug: {
        //    drawBoundingBox: true,
        //    showFrequency: true,
        //    drawScanline: true,
        //    showPattern: true
        //}
    },
    locate: true,
};

var InitializeQuagga = function (callbackOnDetection) {
    Quagga.init(quaggaConfig, function (err) {
        if (err) {
            console.log('error:', err);
            alert('Blad inicjalizacji kamery.');
            return;
        }

        console.log("Initialization finished. Ready to start");
        Quagga.start();
        cameraActive = true;
        Quagga.onProcessed(function (data) {
            //draw rectange here?
        });
        Quagga.onDetected(function (data) {
            codeDetected(data, callbackOnDetection);
        });
    });
};

var codeDetected = function (data, callbackOnDetection) {
    beepSound.play();

    // console.log(data);
    // console.log(data.codeResult.code);
	// console.log()
	callbackOnDetection(data.codeResult.code);
    Quagga.pause();
    setTimeout(
        function () {
            Quagga.start();
        }, 2000);

};


//possible code types
//ode_128_reader(default )
//ean_reader
//ean_8_reader
//code_39_reader
//code_39_vin_reader
//codabar_reader
//upc_reader
//upc_e_reader
//i2of5_reader
//2of5_reader
//code_93_reader