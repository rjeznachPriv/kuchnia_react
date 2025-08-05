import React, { useEffect, useRef, useState } from "react";
import './../Styles/CameraComponent.css';
import { runSequence } from './../utils/utils.js';

import { FaCameraRotate } from "react-icons/fa6";
import { FaCamera } from "react-icons/fa6";
import { IoMdCloseCircle } from "react-icons/io";

import config from "./../Configuration/scannerComponentConfig.json";
import names from "./../Configuration/VitalHTMLids.json";
import captions from "./../Configuration/LocalizedCaptionsPL.json";

const cameraSound = new Audio('./camera.mp3');

function CameraComponent2(props) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const [takePictureClass, setTakePictureClass] = useState('');
    const [cameras, setCameras] = useState();
    const [cameraIndex, setCameraIndex] = useState(0);
    const [isStreaming, setIsStreaming] = useState(false);

    useEffect(() => {
        function getConnectedDevices(type, callback) {
            navigator.mediaDevices.enumerateDevices()
                .then(devices => {
                    const filtered = devices.filter(device => device.kind === type);
                    callback(filtered);
                });
        }

        startCamera();

        getConnectedDevices('videoinput', (cameras) => setCameras(cameras));

        return () => {
            stopCameras();
        };
    }, []);

    async function handleSwitchCameraButtonClick() {
        if (!cameras || cameras.length === 0) return;

        const newIndex = (cameraIndex + 1) % cameras.length;
        setCameraIndex(newIndex);
        const newCamera = cameras[newIndex];
        stopCameras();
        try {
            const newStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    deviceId: { exact: newCamera.deviceId }
                }
            });

            if (videoRef.current) {
                videoRef.current.srcObject = newStream;
                setIsStreaming(true);
            }
        } catch (error) {
            console.error("TODO B³¹d podczas prze³¹czania kamery:", error);
        }
    }

    function handleTakePictureButtonClick() {
        cameraSound.play();
        runSequence([
            () => setTakePictureClass('fadeInAndOut'),
            () => setTakePictureClass('')],
            config.flashOverlayTime);
        const video = videoRef.current;
        const canvas = canvasRef.current;

        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        let image_data_url = canvas.toDataURL('image/jpeg', config.takenPictureQuality);
        props.callback(image_data_url);
    }

    function handleCloseCameraButtonClick() {
        props.setClassName('fadeOut');
        stopCameras();
    }

    async function startCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsStreaming(true);
            }
        } catch (error) {
            console.error("TODO B³¹d dostêpu do kamery:", error);
            alert("TODO Nie mo¿na uzyskaæ dostêpu do kamery.");
        }
    }

    function stopCameras() {
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            setIsStreaming(false);
        }
    }

    return (
        <div className={`CameraComponent ${props.className}`}>
            <div className={`${takePictureClass} take-picture-overlay`}></div>

            <div className="container" onClick={() => { if (!isStreaming) startCamera()  }}>
                <video
                    id="camera-component-video"
                    ref={videoRef}
                    autoPlay
                    playsInline
                >

                </video>
                <div className="camera-scanner-info">{isStreaming ? "" : captions.camera_scanner_activate}</div>
                <div className="top-bar-x-button button" onClick={handleCloseCameraButtonClick}>
                    <IoMdCloseCircle></IoMdCloseCircle>
                </div>
                <div className="take-picture button" onClick={handleTakePictureButtonClick}>
                    <FaCamera></FaCamera>
                </div>
                <div className="switch-camera button" onClick={handleSwitchCameraButtonClick}>
                    <FaCameraRotate></FaCameraRotate>
                </div>
                <canvas ref={canvasRef} id={names["camera-component-canvas"]}></canvas>
            </div>
        </div>
    );
}

export default CameraComponent2;