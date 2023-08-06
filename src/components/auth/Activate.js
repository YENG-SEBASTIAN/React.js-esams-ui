
import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { connect } from 'react-redux';
import { verify } from '../../actions/auth';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="">
        eSams.com
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

const Activate = ({ verify }) => {

  const navigate = useNavigate();
  const params = useParams();
  const [verified, setVerified] = useState(false);

  const handle_verify_Submit = (event) => {
    event.preventDefault();
    const uid = params.uid;
    const token = params.token;

    verify(uid, token);
    setVerified(true);

  };

  if (verified) {
    setInterval(() => {
      return window.location.href = "/"
    }, 100);
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >

          <Typography component="h1" variant="h5">
            Verify your account
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handle_verify_Submit}
            >
              Verify Account
            </Button>

          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}

export default connect(null, { verify })(Activate);