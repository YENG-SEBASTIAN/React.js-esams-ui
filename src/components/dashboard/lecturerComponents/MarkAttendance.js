import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Title from '../dashboard/Title';
import axios from 'axios';
import * as faceapi from 'face-api.js';
import { USERS_API_BASE_URL } from '../../../actions/types';


const defaultTheme = createTheme();

export default function AttendancePage() {
  const [initializing, setInitializing] = React.useState(false);
  const videoRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const videoHeight = 440;
  const videoWidth = 600;
  const [stream, setStream] = React.useState(null);
  const [detectingFace, setDetectingFace] = React.useState(false);
  const [cameraActive, setCameraActive] = React.useState(false); // New state

  const loadModels = async () => {
    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        // Load other face-api.js models here as needed
      ]);
      setInitializing(true);
    } catch (error) {
      console.error('Error loading models:', error);
    }
  };

  React.useEffect(() => {
    loadModels();
  }, []);

  const handleCameraAction = () => {
    if (cameraActive) {
      stopCamera();
    } else {
      startCameraAndDetection();
    }
  };

  const stopCamera = () => {
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setStream(null);
      setCameraActive(false);
      setDetectingFace(false);
      window.location.reload();
    }
  };

  const startCameraAndDetection = async () => {
    if (detectingFace) return;

    const currentStream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = currentStream;
    setStream(currentStream);
    setDetectingFace(true);
    setCameraActive(true);

    let faceDetectionInterval = setInterval(async () => {
      const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions());
      if (detections && detections.length > 0) {
        clearInterval(faceDetectionInterval);
        captureAndSendImage(currentStream);
        startCameraAndDetection();
      }
    }, 3000);

    setTimeout(() => {
      if (detectingFace) {
        clearInterval(faceDetectionInterval);
        stopCamera();
        startCameraAndDetection();
      }
    }, 5000);
  };

  const captureAndSendImage = (stream) => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);
    const imgData = canvas.toDataURL();

    stopCamera();
    setDetectingFace(false);

    detectFaceAndSend(imgData);
  };

  const detectFaceAndSend = async (imgData) => {
    const img = new Image();
    img.src = imgData;

    img.onload = async () => {
      const detections = await faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions());

      if (detections && detections.length > 0) {
        console.log("Send to backend");
        sendImageToBackend(imgData);
      } else {
        console.error("No face detected in the captured image.");
      }
    }
  };

  const sendImageToBackend = async (image) => {
    const config = {
      headers: {
        "Content-Type": "application/json",  // Change to 'application/json'
        "Authorization": `JWT ${localStorage.getItem("access")}`
      }
    };

    try {
      const response = await axios.post(
        USERS_API_BASE_URL + `compare_faces_api/`,
        {
          imgData: image, // Assuming 'faceDescriptor' is the 128-dimensional descriptor
        },
        config
      );
      console.log(response.data)
    } catch (error) {
      console.error('Error sending face descriptor:', error);
    }
  };

  return (
    <React.Fragment>
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h1" variant="h5">
              <Title>Take Attendance</Title>
            </Typography>

            <div className='videoCapture displayFlex'>
              <video ref={videoRef} height={videoHeight} width={videoWidth} autoPlay />
              <div ref={canvasRef} className='videoCapture' />
            </div>

            {initializing ? (
              <Button color={cameraActive ? 'error' : 'primary'} variant="contained" onClick={handleCameraAction}>
                {cameraActive ? 'Stop Camera' : 'Start Attendance'}
              </Button>
            ) : (
              <Typography variant="body1">Loading models...</Typography>
            )}
          </Box>
        </Container>
      </ThemeProvider>
    </React.Fragment>
  );
}