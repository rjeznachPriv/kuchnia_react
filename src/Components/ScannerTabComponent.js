
import { useState } from 'react';
import React, { useEffect } from "react";
import { runSequence } from './../utils/utils.js';
import $ from 'jquery';
import ChooseYourActionModalComponent from './ChooseYourActionModalComponent';

import './../Styles/ScannerTabComponent.css';
import config from "./../Configuration/scannerComponentConfig.json";
import names from "./../Configuration/VitalHTMLids.json";
import captions from "./../Configuration/LocalizedCaptionsPL.json";

const ScannerTabComponent = props => {
    var [takePictureClass, setTakePictureClass] = useState('');
    var [scanClass, setScanClass] = useState('');
    var [barcode, setBarcode] = useState('');
    var [pictureData, setPictureData] = useState();

    const beepOkSound = new Audio('./beep-ok.mp3');
    const beepNotOkSound = new Audio('./beep-not_ok.mp3');
    const cameraSound = new Audio('./camera.mp3');

    var localStyle = { display: props.activeTab === names.camera_tab ? 'block' : 'none' };

    function InitializeQuagga() {
        props.quagga.init(config, err => {
            if (err) {
                console.log(err, "error msg");
            }
     
            props.quagga.start();
            return () => { props.quagga.stop() }
        });

        props.registerBarcodeListener(onBarcodeScannedWhenCameraActive);

        props.quagga.onDetected(function (result) {
            props.quagga.pause();

            runSequence([
                () => PassDetectedCode(result),
                () => props.quagga.start()],
                config.scanningPauseAfterScan);
        });
    }

    function PassDetectedCode(result) {
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

        setPictureData(image_data_url);
        props.onPictureTaken(image_data_url);
        props.activateTabWithId(names.choose_tab)
    }

    function onBarcodeScannedWhenCameraActive(barcode) {
        setBarcode(barcode);
        runSequence([
            () => setScanClass('fadeInAndOut'),
            () => setScanClass(''),
            () => props.activateTabWithId(names.choose_tab)],
            config.flashOverlayTime);
    }

    return (
        <div className="ScannerTabComponent">
            <ChooseYourActionModalComponent
                pictureData={pictureData}
                barcode={barcode}
                activeTab={props.activeTab}
            ></ChooseYourActionModalComponent>
            <div id="cameraCanvas" style={localStyle} onClick={InitializeQuagga} >
                <div className="camera-scanner-info">{props.quagga.CameraAccess.getActiveTrack() ? captions.camera_scanner_info : captions.camera_scanner_activate}</div>
                <div className="take-picture-button" onClick={handleTakePictureButtonClick}></div>
                <div className={`${scanClass} scan-overlay`}></div>
                <div className={`${takePictureClass} take-picture-overlay`}></div>

            </div>
        </div>
    );
};

export default ScannerTabComponent;
