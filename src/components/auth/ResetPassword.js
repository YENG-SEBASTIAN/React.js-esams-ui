
import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import validation from './validation/validation';
import { useNavigate } from 'react-router-dom';

import { connect } from 'react-redux';
import { password_reset } from '../../actions/auth';

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

const EMAIL_REG = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*$/;

const ResetPassword = ({ password_reset }) => {

  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [requestSent, setRequestSent] = useState(false);

  const [successMsg, setSuccessMsg] = useState('');


  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false)


  useEffect(() => {
    const result = EMAIL_REG.test(email);
    setValidEmail(result);
  }, [email])

  useEffect(() => {
    setErrors({});
  }, [email])


  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = { email }
    if (validEmail === true) {
      password_reset(email);
      setRequestSent(true)
      setSuccessMsg(' Successful')
    } else {
      setErrors(validation(formData));
    }
  };

  if (requestSent) {
    setInterval(() => {
      return navigate("/")
    }, 1000);
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
            Reset Password
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={(e) => setEmail(e.target.value)}
              helperText={errors.email}
              error={errors.email}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Reset Password
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/" variant="body2">
                  Go back
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
})
  ;
export default connect(mapStateToProps, { password_reset })(ResetPassword);