
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
            <span>{initializing ? 'Initializing' : 'Capturing'}</span>

            <div className='videoCapture displayFlex'>
              {/* <video
                // component='video'
                crossOrigin='anonymous'
                height={videoHight}
                width={videoWidth}
                onPlay={handleVideoPlay}
                autoPlay
                muted
                ref={videoRef}
              /> */}
              {/* <canvas className='videoCapture' ref={canvasRef} /> */}
            </div>




          </Box>
        </Container>
      </ThemeProvider>
    </React.Fragment>
  );
}