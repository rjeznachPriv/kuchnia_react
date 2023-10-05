
import { useState } from 'react';
import React, { useEffect } from "react";
import Quagga from "quagga";
import $ from 'jquery';
import ChooseYourActionModalComponent from './ChooseYourActionModalComponent';

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
                config.flashOverlayTime);
            runSequence([
                () => HandleDetectedCode(result),
                () => Quagga.start()],
                config.scanningPauseAfterScan);
        });
    }, [Quagga]);

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

        return { code: code, valid: errorSum < config.errorLimit };
    }

    function handleTakePictureButtonClick() {
        cameraSound.play();
        runSequence([
            () => setTakePictureClass('fadeInAndOut'),
            () => setTakePictureClass('')],
            config.flashOverlayTime);

        const canvas = $('#cameraCanvas canvas.drawingBuffer')[0];
        const video = $('#cameraCanvas video')[0];
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        let image_data_url = canvas.toDataURL('image/jpeg', config.takenPictureQuality);

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
            <div className="camera-scanner-info">{captions.camera_scanner_info}</div>
            <div className="take-picture-button" onClick={handleTakePictureButtonClick}></div>
            <div className={`${scanClass} scan-overlay`}></div>
            <div className={`${takePictureClass} take-picture-overlay`}></div>

        </div>
    );
};

export default ScannerComponent;
