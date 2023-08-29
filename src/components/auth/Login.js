import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USERS_API_BASE_URL } from '../../actions/types';
import { connect } from 'react-redux';
import { login, load_user } from '../../actions/auth';
import validation from './validation/validation';

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
const PASSWORD_REG = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const Login = ({ login, load_user }) => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [password, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(false);
  const [userType, setUserType] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');

  const userTypeInfo = async () => {
    const config = {
      headers: {
        'Authorization': `JWT ${localStorage.getItem('access')}`,
      },
    };
    try {
      const response = await axios.get(USERS_API_BASE_URL + 'getUser/', config);
      setUserType(response.data);
    } catch (error) {
      console.error('Error fetching user profile info:', error);
    }
  };

  useEffect(() => {
    userTypeInfo();
  }, []);

  useEffect(() => {
    const result = EMAIL_REG.test(email);
    setValidEmail(result);
  }, [email]);

  useEffect(() => {
    const result = PASSWORD_REG.test(password);
    setValidPassword(result);
  }, [password]);

  useEffect(() => {
    setErrors({});
  }, [email, password]);

  const handleLoginSuccess = (message) => {
    setLoggedIn(false); // Hide circular progress
    setAlertSeverity('success');
    setAlertMessage(message);
    setAlertOpen(true);
  };

  const handleLoginError = (message) => {
    setLoggedIn(false); // Hide circular progress on error
    setAlertSeverity('error');
    setAlertMessage(message);
    setAlertOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = { email, password };

    if (validEmail && validPassword) {
      try {
        setLoggedIn(true); // Show circular progress
        const response = await login(email, password);
        
        if (userType && userType.role === 'Student') {
            return navigate('/dashboard/studentDashboard');
          } else if (userType && userType.role === 'Lecturer') {
            return navigate('/dashboard/dashboard/');
          }
      
      } catch (error) {
        console.error('Login error:', error);
        setErrors(validation(formData));
      }
    } else {
      setErrors(validation(formData));
      handleLoginError('Invalid email or password.');
    }
  };

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
            Smart E-Attendance
          </Typography>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          {alertOpen && (
            <Alert severity={alertSeverity} onClose={() => setAlertOpen(false)}>
              <AlertTitle>{alertSeverity === 'success' ? 'Success' : 'Error'}</AlertTitle>
              {alertMessage}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              helperText={errors.email}
              error={errors.email}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              helperText={errors.password}
              error={errors.password}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loggedIn} // Disable the button while waiting
            >
              {loggedIn ? <CircularProgress size={24} /> : "Sign In"}
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/reset-password" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
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
});
export default connect(mapStateToProps, { login, load_user })(Login);
