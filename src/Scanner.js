import React, { useEffect } from "react";
import config from "./scannerConfig.json";
import Quagga from "quagga";

const Scanner = props => {
    const { onDetected, activeTab } = props;

    var beepOk = new Audio('./beep-ok.mp3');
    var beepNotOk = new Audio('./beep-not_ok.mp3');

    var localStyle = { display: props.activeTab == "bb3" ? 'block' : 'none'};

    useEffect(() => {
        Quagga.init(config, err => {
            if (err) {
                console.log(err, "error msg");
            }
            Quagga.start();
            return () => {
                Quagga.stop()
            }
        });


        Quagga.onDetected(function (result) {
            Quagga.pause();
            console.log(result.codeResult.code);
            if (props.onBarcodeScanned(result.codeResult.code, result).valid) {
                beepOk.play();
            }
            else {
                beepNotOk.play();
            }
            setTimeout(
                function () {
                    Quagga.start();
                }, 2000);   // pause after successfull scan
        });
    }, []);

    return (
        // If you do not specify a target,
        // QuaggaJS would look for an element that matches
        // the CSS selector #interactive.viewport
        <div id="cameraCanvas" style={localStyle} />
    );
};

export default Scanner;
