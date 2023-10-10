import { useState, useEffect, useRef } from 'react';
import { runSequence } from './../utils/utils.js';
import React from "react";
import $ from 'jquery';
import { FaCameraRotate } from "react-icons/fa6";
import { FaCamera } from "react-icons/fa6";

import './../Styles/CameraComponent.css';
import names from "./../Configuration/VitalHTMLids.json";
import captions from "./../Configuration/LocalizedCaptionsPL.json";

const ScannerTabComponent = props => {
    var [takePictureClass, setTakePictureClass] = useState('');
    var [cameras, setCameras] = useState();
    var [cameraIndex, setCameraIndex] = useState(0);

    const currentState = useRef();
    const cameraSound = new Audio('./camera.mp3');

    useEffect(() => {
        currentState.current = {
            'cameras': cameras,
        };
    }, [cameras]);

    function ShowLiveCameraPicture() {
        props.quagga.CameraAccess.release()
        getConnectedDevices('videoinput', (cameras) => InitializeCamera(cameras));
    }

    function getConnectedDevices(type, callback) {
        navigator.mediaDevices.enumerateDevices()
            .then(devices => {
                const filtered = devices.filter(device => device.kind === type);
                callback(filtered);
            });
    }

    function InitializeCamera(cameras) {
        setCameras(cameras);
        var All_mediaDevices = navigator.mediaDevices;
        var camera = cameras[cameraIndex];

        if (!All_mediaDevices || !All_mediaDevices.getUserMedia) {
            alert(captions.message_no_camera_available);
            return;
        }
        All_mediaDevices.getUserMedia({
            video: {
                'deviceId': camera.deviceId,
            }
        })
            .then(function (videoStream) {
                props.setCameraStream(videoStream);
                var video = document.getElementById('camera-component-video');
                if ("srcObject" in video) {
                    video.srcObject = videoStream;
                } else {
                    video.src = window.URL.createObjectURL(videoStream);
                }
                video.onloadedmetadata = function (e) {
                    video.play();
                };
            })
            .catch(function (e) {
                alert('error:' + e.message);
            });
    }

    function handleSwitchCameraButtonClick() {
        if (cameraIndex + 1 < currentState.current.cameras?.length)
            setCameraIndex(cameraIndex + 1);
        else {
            setCameraIndex(0);
        }

        ShowLiveCameraPicture();
    }

    function handleTakePictureButtonClick() {
        cameraSound.play();
        runSequence([
            () => setTakePictureClass('fadeInAndOut'),
            () => setTakePictureClass('')],
            500);

        const canvas = $('#camera-component-canvas')[0];
        const video = $('#camera-component-video')[0];
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        let image_data_url = canvas.toDataURL('image/jpeg', 0.3);

        //setPictureData(image_data_url);
        //props.onPictureTaken(image_data_url);
        // overwrite video content with taken picture? or hide video, leave just canvas
    }

    return (
        <div className="CameraComponent">
            <div className="container">
                <video
                    id="camera-component-video"
                    onClick={ShowLiveCameraPicture}>
                </video>
                <div className={`${takePictureClass} take-picture-overlay`}></div>
                <div className="take-picture button" onClick={handleTakePictureButtonClick}>
                    <FaCamera></FaCamera>
                </div>
                <div className="switch-camera button" onClick={handleSwitchCameraButtonClick}>
                    <FaCameraRotate></FaCameraRotate>
                </div>
                <canvas id="camera-component-canvas"></canvas>
            </div>
        </div>
    );
};

export default ScannerTabComponent;
