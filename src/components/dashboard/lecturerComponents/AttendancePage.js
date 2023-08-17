
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
  const [profile, setProfile] = React.useState([]);


  const userProfileInfo = async () => {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `JWT ${localStorage.getItem("access")}`,
      }
    };
    await axios.get(USERS_API_BASE_URL + `get_all_userProfileInfo/`, config)
      .then(res => setProfile(res.data))
  }

  useEffect(() => {
    startVideo();
    getLabelFaceDescriptor();
    videoRef && loadModels();
  }, []);

  React.useEffect(() => {
    userProfileInfo()
  }, [])

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((currentStream) => {
        videoRef.current.srcObject = currentStream;
      
      })
      .catch((err) => {
        console.error(err)
      });
  }

  const stopStream = () => {
    const stream = videoRef.current.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    return window.location.href = "/dashboard/dashboard";
  };


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
    const loadFaceDescriptors = await getLabelFaceDescriptor();
    const faceMatcher = faceapi.FaceMatcher(loadFaceDescriptors)


    setInterval(async () => {

      const detections = await faceapi.detectAllFaces
        (videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks().withFaceDescriptors().withFaceExpressions();
        if (detections) {
          setInitializing(false);
        }
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

      const results = resized.map((d) => {
        return faceMatcher.findBestMatch(d.descriptor);
      })
      results.forEach((result, i) => {
        const box = resized[i].detection.box;
        const drawBox = new faceapi.draw.DrawBox(box, {label: result});
        drawBox.draw(canvasRef.current)
      })

      if (detections && detections.length > 0) {


        const faceDescriptor = detections[0].descriptor;
        const faceEncoding = JSON.stringify(faceDescriptor);
        const faceParse = JSON.parse(faceEncoding);
        const valuesArray = Object.values(faceParse);
        console.log("valuesArray", valuesArray)
        // sendFaceDescriptorToBackend(valuesArray)

      }

    }, 1000)
  }

  const sendFaceDescriptorToBackend = async (faceDescriptor) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
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
      console.log(response)
      console.log(faceDescriptor); // Server response message
    } catch (error) {
      console.error('Error sending face descriptor:', error);
    }
  };


  const getLabelFaceDescriptor = async () => {
    const labeledDescriptors = await Promise.all(
      profile.map(async (user) => {
        const descriptions = [];
        const imageResponse = await fetch(REACT_API_BASE_URL + user.picture);
        const imageBlob = await imageResponse.blob();
        const image = await faceapi.bufferToImage(imageBlob);
  
        const detection = await faceapi.detectSingleFace(image, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptor();
  
        if (detection) {
          descriptions.push(detection.descriptor);
        }
  
        return new faceapi.LabeledFaceDescriptors(user.contact, descriptions);
      })
    );
  
    return labeledDescriptors;
  };
  

  // const getLabelFaceDescriptor = () => {
  //   Promise.all(
  //     profile.map( async (user) => {
  //       const descriptions = [];
  //         const image = await faceapi.fetchImage(REACT_API_BASE_URL + user.picture)
  //         const detection = faceapi.detectSingleFace(sabs, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();
  //         descriptions.push(detection.descriptor);
  //         console.log(detection)

  //         return new faceapi.LabeledFaceDescriptors(user, descriptions)
  //     })
  //   )
  // }


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

              <video ref={videoRef} height={videoHight} width={videoWidth} autoPlay />
              <canvas ref={canvasRef} className='videoCapture' />

            </div>
            {
              startVideo ?
                <>
                  <Button
                    color='error'
                    variant="contained"
                    onClick={stopStream}>
                    Stop
                  </Button>
                  {
                    profile.map((user) => {
                      return(
                        <p>{user.contact}</p>
                      )
                    })
                  }
                </> : ''
            }



          </Box>
        </Container>
      </ThemeProvider>
    </React.Fragment>
  );
}