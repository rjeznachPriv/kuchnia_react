import React, { useEffect, useRef, useState } from "react";
import './../Styles/CameraComponent.css';
import { runSequence } from './../utils/utils.js';

import { FaCameraRotate } from "react-icons/fa6";
import { TbCrosshair } from "react-icons/tb";
import { IoMdCloseCircle } from "react-icons/io";

import config from "./../Configuration/scannerComponentConfig.json";
import names from "./../Configuration/VitalHTMLids.json";
import captions from "./../Configuration/LocalizedCaptionsPL.json";

const beepOkSound = new Audio('/beep-ok.mp3');
const beepNotOkSound = new Audio('/beep-not_ok.mp3');

function JustScannerComponent(props) {
    let lastDetectedTime = 0;
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const [scannerOverlayClass, setScannerOverlayClass] = useState('');
    const [cameras, setCameras] = useState([]);
    const [cameraIndex, setCameraIndex] = useState(0);
    const [isStreaming, setIsStreaming] = useState(false);
    const [isQuaggaRunning, setIsQuaggaRunning] = useState(false);

    useEffect(() => {


        initAndStart();
        return () => stopQuagga();
    }, []);

    useEffect(() => {
        if (props.className === 'fadeIn' && cameras.length > 0) {
            startQuagga(cameras[cameraIndex]?.deviceId);    //TODO: remember last camera? preferred camera?
        }
        if (props.className === 'fadeOut') {
            stopQuagga();
        }
    }, [props.className, cameras, cameraIndex]);

    async function initAndStart() {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            setCameras(videoDevices);

            if (videoDevices.length > 0) {
                setCameraIndex(0);
                await startQuagga(videoDevices[0].deviceId);
            }
        } catch (err) {
            console.error("Camera init error:", err);
        }
    }

    function attachOnDetected() {
        props.quagga.onDetected(result => {
            const now = Date.now();
            if (now - lastDetectedTime < config.debounceDelay) return;
            lastDetectedTime = now;

            props.quagga.pause();

            PassDetectedCode(result);
        });
    }

    async function startQuagga(deviceId) {
        if (isQuaggaRunning) {
            props.quagga.stop();
            setIsQuaggaRunning(false);
        }

        await startCamera(deviceId);

        if (!videoRef.current?.srcObject) {
            console.error("No video stream — cannot start Quagga");
            return;
        }

        await new Promise(resolve => {
            if (videoRef.current) {
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current.play().catch(err => {
                        console.warn("Video play interrupted:", err);
                    });
                    resolve();
                };
            } else {
                resolve();
            }
        });

        const newConfig = {
            ...config,
            inputStream: {
                ...config.inputStream,
                constraints: {
                    ...config.inputStream?.constraints,
                    deviceId: deviceId ? { exact: deviceId } : undefined
                }
            }
        };

        props.quagga.init(newConfig, err => {
            if (err) {
                console.error("Quagga init error:", err);
                return;
            }
            props.quagga.start();
            setIsQuaggaRunning(true);
            attachOnDetected();
        });
    }

    function stopQuagga() {
        if (isQuaggaRunning) {
            props.quagga.stop();
            setIsQuaggaRunning(false);
        }
        stopCameras();
    }

    async function startCamera(deviceId) {
        try {
            const constraints = deviceId
                ? { video: { deviceId: { exact: deviceId } } }
                : { video: true };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsStreaming(true);
            }
        } catch (error) {
            console.error("Error accessing camera:", error);
        }
    }

    function stopCameras() {
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            setIsStreaming(false);
        }
    }

    async function handleSwitchCameraButtonClick() {
        if (!cameras.length) return;

        const newIndex = (cameraIndex + 1) % cameras.length;
        setCameraIndex(newIndex);

        await startQuagga(cameras[newIndex].deviceId);
    }

    function handleCloseScannerButtonClick() {
        props.setClassName('fadeOut');
        stopQuagga();
    }

    function PassDetectedCode(result) {
        if (!result || !result.codeResult || !result.codeResult.code) {
            console.warn("PassDetectedCode: invalid result object", result);
            return;
        }
        runSequence(
            [
                () => setScannerOverlayClass('fadeInAndOut'),
                () => setScannerOverlayClass(''),
            ],
            config.flashOverlayTime);

        if (ValidateDetectedCode(result.codeResult.code, result).valid) {
            beepOkSound.play().catch(err => console.warn("Beep sound error:", err));
            props.callback(result.codeResult.code);
            handleCloseScannerButtonClick();
        } else {
            beepNotOkSound.play().catch(err => console.warn("Beep sound error:", err));
            console.log('error scanning');
            props.quagga.start()
        }
    }

    function ValidateDetectedCode(code, result) {
        let errorSum = 0;
        result.codeResult.decodedCodes.forEach(c => {
            errorSum += c.error ? c.error : 0;
        });
        return { code, valid: errorSum < config.errorLimit };
    }

    return (
        <div className={`CameraComponent ${props.className}`}>
            <div className={`${scannerOverlayClass} code-scanned-overlay`}></div>

            <div className="container" onClick={() => {
                if (!isStreaming && cameras.length > 0) {
                    startQuagga(cameras[cameraIndex]?.deviceId);
                }
            }}>
                <video
                    id="camera-component-video"
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                ></video>
                <div className="camera-scanner-info">
                    {isStreaming ?  cameras[cameraIndex]?.label  : captions.camera_scanner_activate}
                </div>
                <div className="top-bar-x-button button" onClick={handleCloseScannerButtonClick}>
                    <IoMdCloseCircle />
                </div>
                <div className="scanner-overlay">
                    <TbCrosshair />
                </div>
                <div className="switch-camera button" onClick={handleSwitchCameraButtonClick}>
                    <FaCameraRotate />
                </div>
                <canvas ref={canvasRef} id={names["camera-component-canvas"]}></canvas>
            </div>
        </div>
    );
}

export default JustScannerComponent;