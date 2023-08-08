
import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CardMedia from '@mui/material/CardMedia';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Title from '../dashboard/Title';
import axios from 'axios';
import * as faceapi from 'face-api.js';
import sabs from '../../../asset/sabs2.jpg';
import './attendancePage.css';
import { USERS_API_BASE_URL, REACT_API_BASE_URL } from '../../../actions/types';
import { useState, useEffect, useRef } from 'react';



const defaultTheme = createTheme();

export default function AttendancePage() {

  const [initializing, setInitializing] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const videoHight = 440;
  const videoWidth = 600;

  useEffect(() => {
    startVideo();

    videoRef && loadModels();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((currentStream) => {
        videoRef.current.srcObject = currentStream;
        // return () => {
        //   if (currentStream) {
        //     currentStream.getTracks().forEach((track) => track.stop());
        //     console.log(currentStream)
        //   }
        // };
      }).catch((err) => {
        console.error(err)
      });
  }

  const loadModels = () => {
    setInitializing(true);
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('/models'),
    ]).then(() => {
      faceDetection();
    })
  };

  const faceDetection = async () => {
    setInterval(async () => {
      if (initializing) {
        setInitializing(false);
      }
      const detections = await faceapi.detectAllFaces
        (videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks().withFaceDescriptors().withFaceExpressions();
      // console.log(detections)

      canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(videoRef.current);
      faceapi.matchDimensions(canvasRef.current, {
        width: videoWidth,
        height: videoHight,
      })
      const resized = faceapi.resizeResults(detections, {
        width: videoWidth,
        height: videoHight,
      });
      // draw the detection onto the detected face i.e the box
      faceapi.draw.drawDetections(canvasRef.current, resized);
      //draw the the points onto the detected face
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);
      //to analyze and output the current expression by the detected face
      faceapi.draw.drawFaceExpressions(canvasRef.current, resized);

      if (detections && detections.length > 0) {
        const faceDescriptor = detections[0].descriptor;
        // const response = await axios.post('/api/compare_faces/', {
        //   encoding: faceDescriptor,
        // });
        // console.log(response.data);
        console.log(faceDescriptor);
      }
      requestAnimationFrame(faceDetection);

    }, 1000)
  }




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
              <Title>Take Attendace</Title>
            </Typography>
            <span>{initializing ? 'Initializing' : 'Capturing'}  </span>

            <div className='videoCapture displayFlex'>
              {/* <video
                // component='video'
                crossOrigin='anonymous'
                height={videoHight}
                width={videoWidth}
                // onPlay={handleVideoPlay}
                autoPlay
                muted
                ref={videoRef}
              /> */}
              {/* <canvas className='videoCapture' ref={canvasRef} /> */}

              <video ref={videoRef} height={videoHight} width={videoWidth} autoPlay />
              <canvas ref={canvasRef} className='videoCapture' />
            </div>




          </Box>
        </Container>
      </ThemeProvider>
    </React.Fragment>
  );
}