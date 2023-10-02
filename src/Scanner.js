import './Scanner.css';
import { useState } from 'react';
import React, { useEffect } from "react";
import config from "./scannerConfig.json";
import Quagga from "quagga";

const Scanner = props => {
    var [takePictureClass, setTakePictureClass] = useState('');
    var [scanClass, setScanClass] = useState('');

    const beepOkSound = new Audio('./beep-ok.mp3');
    const beepNotOkSound = new Audio('./beep-not_ok.mp3');
    const cameraSound = new Audio('./camera.mp3');

    const SCANNING_PAUSE_AFTER_SCAN = 2000;
    const FLASH_OVERLAY_PERIOD = 400;
    const ERROR_LIMIT = 1.45;

    var localStyle = { display: props.activeTab == "bb3" ? 'block' : 'none' };

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
            runSequence(Array(() => setScanClass('fadeInAndOut'), () => setScanClass('')), FLASH_OVERLAY_PERIOD);
            runSequence(Array(() => HandleDetectedCode(result), () => Quagga.start()), SCANNING_PAUSE_AFTER_SCAN);
        });
    }, []);

    function HandleDetectedCode(result) {                                       //TODO: rename me, to be without 'handle'
        if (ValidateDetectedCode(result.codeResult.code, result).valid) {
            beepOkSound.play();
            props.onBarcodeScanned(result.codeResult.code);
        }
        else {
            beepNotOkSound.play();
        }
    }

    function ValidateDetectedCode(code, result) {
        var errorSum = 0;
        result.codeResult.decodedCodes.forEach(code => {
            errorSum += code.error ? code.error : 0;
        })

        return { code: code, valid: errorSum < ERROR_LIMIT };
    }

    function handleTakePictureButtonClick() {
        cameraSound.play();
        runSequence(Array(() => setTakePictureClass('fadeInAndOut'), () => setTakePictureClass('')), FLASH_OVERLAY_PERIOD);
    }

    function runSequence(sequence, delay, counter = 0) {    //TODO: move to some module
        if (counter < sequence.length) {
            sequence[counter]();
            setTimeout(
                function () {
                    runSequence(sequence, delay, counter + 1);
                }, delay);
        }
    }

    return (
        <div id="cameraCanvas" style={localStyle} >
            <div className="take-picture-button" onClick={handleTakePictureButtonClick}></div>
            <div className={`${scanClass} scan-overlay`}></div>
            <div className={`${takePictureClass} take-picture-overlay`}></div>
        </div>
    );
};

export default Scanner;
