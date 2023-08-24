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
import './attendancePage.css';
import { USERS_API_BASE_URL, REACT_API_BASE_URL } from '../../../actions/types';
import { useState, useEffect, useRef } from 'react';
import sabs from '../../../asset/sabs2.jpg'

const defaultTheme = createTheme();

export default function AttendancePage() {
  const [initializing, setInitializing] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const videoHeight = 440;
  const videoWidth = 600;
  const [profile, setProfile] = React.useState([]);

  const userProfileInfo = async () => {
    const config = {
      headers: {
        'Authorization': `JWT ${localStorage.getItem('access')}`,
      },
    };
    try {
      const response = await axios.get(USERS_API_BASE_URL + 'get_all_userProfileInfo/', config);
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching user profile info:', error);
    }
  };

  useEffect(() => {
    userProfileInfo();
  }, []);

  useEffect(() => {
    loadModels();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((currentStream) => {
        videoRef.current.srcObject = currentStream;
        setStreaming(true);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const stopStream = () => {
    const stream = videoRef.current.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setStreaming(false);
    return window.location.href = "attendancePage";
  };

  const loadModels = async () => {
    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('/models'),
      ]).then((streaming) => {
        if (streaming) {
          startFaceDetection();
          // getLabelFaceDescriptor()
        }
      })
    } catch (error) {
      console.error('Error loading models:', error);
    }
  };

  const startFaceDetection = () => {
    setInterval(async () => {
      const detections = await faceapi.detectAllFaces(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions()
      )
        .withFaceLandmarks()
        .withFaceDescriptors()
        .withFaceExpressions();

      canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(videoRef.current);
      faceapi.matchDimensions(canvasRef.current, {
        width: videoWidth,
        height: videoHeight,
      });

      const resizedDetections = faceapi.resizeResults(detections, {
        width: videoWidth,
        height: videoHeight,
      });

      faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
      faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);

      // const labeledDescriptor = await getLabelFaceDescriptor();
      // const faceMatcher = new faceapi.FaceMatcher(labeledDescriptor);

      // resizedDetections.forEach((detection) => {
      //   const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
      //   const box = detection.detection.box;
      //   const drawBox = new faceapi.draw.DrawBox(box, { label: bestMatch.toString() });
      //   drawBox.draw(canvasRef.current);
      // });

      if (detections && detections.length > 0) {
        const faceDescriptor = detections[0].descriptor;
        // Convert the face descriptor array to a JSON string
        const faceDescriptorString = JSON.stringify(faceDescriptor);
        console.log(faceDescriptorString)
        // Send the JSON string to your Django backend using an API call
        sendFaceDescriptorToBackend(faceDescriptorString);
      }
    }, 1000);
  };



  const getLabelFaceDescriptor = async () => {
    const labeledDescriptors = await Promise.all(
      profile.map(async (user) => {
        try {
          const descriptions = [];
          const image = await faceapi.fetchImage(REACT_API_BASE_URL + user.picture);

          const detection = await faceapi.detectSingleFace(image, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptor();

          if (detection) {
            descriptions.push(detection.descriptor);

            // Print detection details to console
            console.log('Detection for user:', user.contact);
            console.log('Detection:', detection);
          } else {
            console.log('No face detected for user:', user.contact);
          }

          const labeledDescriptor = new faceapi.LabeledFaceDescriptors(
            user.contact, // Label
            descriptions // Descriptors
          );

          return labeledDescriptor;
        } catch (error) {
          console.error('Error detecting face:', error);
          return null; // Return null for this user if face detection fails
        }
      })
    );

    // Remove any entries with null values (failed detections)
    const filteredDescriptors = labeledDescriptors.filter(descriptor => descriptor !== null);

    return filteredDescriptors;
  };

  const sendFaceDescriptorToBackend = async (faceDescriptor) => {
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
          encoding: faceDescriptor, // Assuming 'faceDescriptor' is the 128-dimensional descriptor
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
            {/* <span>{initializing ? 'Initializing' : 'Capturing'}</span> */}

            <div className='videoCapture displayFlex'>
              <video ref={videoRef} height={videoHeight} width={videoWidth} autoPlay />
              <canvas ref={canvasRef} className='videoCapture' />
            </div>

            {streaming ? (
              <Button color='error' variant="contained" onClick={stopStream}>
                Stop Streaming
              </Button>
            ) : (
              <Button color='primary' variant="contained" onClick={startVideo}>
                Start Streaming
              </Button>
            )}


          </Box>
        </Container>
      </ThemeProvider>
    </React.Fragment>
  );
}
