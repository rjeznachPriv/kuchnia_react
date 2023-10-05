
import { useState } from 'react';
import React, { useEffect } from "react";
import Quagga from "quagga";
import $ from 'jquery';

import './../Styles/ScannerComponent.css';
import config from "./../Configuration/scannerComponentConfig.json";
import names from "./../Configuration/VitalHTMLids.json";
import captions from "./../Configuration/LocalizedCaptionsPL.json";

const ScannerComponent = props => {
    var [takePictureClass, setTakePictureClass] = useState('');
    var [scanClass, setScanClass] = useState('');

    const beepOkSound = new Audio('./beep-ok.mp3');
    const beepNotOkSound = new Audio('./beep-not_ok.mp3');
    const cameraSound = new Audio('./camera.mp3');

    const SCANNING_PAUSE_AFTER_SCAN = 2000;     //Move all this to scannerConfig
    const FLASH_OVERLAY_PERIOD = 400;
    const ERROR_LIMIT = 1.45;
    const TAKEN_PICTURE_QUALITY = 0.3;
    const CAMERA_SCANNER_INFO = captions.camera_scanner_info;

    var localStyle = { display: props.activeTab === names.camera_tab ? 'block' : 'none' };

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
            runSequence([
                () => setScanClass('fadeInAndOut'),
                () => setScanClass('')],
                FLASH_OVERLAY_PERIOD);
            runSequence([
                () => HandleDetectedCode(result),
                () => Quagga.start()],
                SCANNING_PAUSE_AFTER_SCAN);
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
        runSequence([
            () => setTakePictureClass('fadeInAndOut'),
            () => setTakePictureClass('')],
            FLASH_OVERLAY_PERIOD);

        const canvas = $('#cameraCanvas canvas.drawingBuffer')[0];
        const video = $('#cameraCanvas video')[0];
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        let image_data_url = canvas.toDataURL('image/jpeg', TAKEN_PICTURE_QUALITY);

        props.onPictureTaken(image_data_url); //blob
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
            <div className="camera-scanner-info">{CAMERA_SCANNER_INFO}</div>
            <div className="take-picture-button" onClick={handleTakePictureButtonClick}></div>
            <div className={`${scanClass} scan-overlay`}></div>
            <div className={`${takePictureClass} take-picture-overlay`}></div>
        </div>
    );
};

export default ScannerComponent;
