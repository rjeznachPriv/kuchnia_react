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

function JustCameraComponent(props) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const [takePictureOverlayClass, setTakePictureOverlayClass] = useState('');
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

        stopCameras();

        const newCamera = cameras[newIndex];
        await startCamera(newCamera.deviceId);
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
            console.error("TODO B³¹d dostêpu do kamery:", error);
        }
    }

    function stopCameras() {
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            setIsStreaming(false);
        }
    }

    function handleTakePictureButtonClick() {
        cameraSound.play();
        runSequence([
            () => setTakePictureOverlayClass('fadeInAndOut'),
            () => setTakePictureOverlayClass('')],
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

    return (
        <div className={`CameraComponent ${props.className}`}>
            <div className={`${takePictureOverlayClass} take-picture-overlay`}></div>

            <div className="container" onClick={() => { if (!isStreaming) startCamera() }}>
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

export default JustCameraComponent;

export function renderThumbnail(commonProps, value, onRemoveThumbnailButtonClicked, onCameraIconClicked) {
    return (
        <div>
            <label>{commonProps.label}</label>
            {
                value ?
                    <div className="TakenPictureThumbnailContainer">
                        <img alt="" src={value} className="TakenPictureThumbnail"></img>
                        <div className="top-bar-x-button button" onClick={onRemoveThumbnailButtonClicked}>
                            <IoMdCloseCircle></IoMdCloseCircle>
                        </div>
                    </div> :
                    <FaCamera role="button" tabIndex="0" onClick={onCameraIconClicked}></FaCamera>
            }
        </div>
    );
}