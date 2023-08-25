import React, { useState } from 'react';
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
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { signup, isAuthenticated } from '../../actions/auth';
import validation from './validation/validation';
import Alert from '@mui/material/Alert';

function SignUp({ signup, isAuthenticated }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    level: 100,
    role: 'Student',
    password: '',
    re_password: '',
  });
  const [errors, setErrors] = useState({});
  const [signingUp, setSigningUp] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');

  const defaultTheme = createTheme();
  const USERNAME_REG = /^[a-zA-Z0-9]/;
  const FULLNAME_REG = /^[a-zA-Z0-9]/;
  const EMAIL_REG = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*$/;
  const PASSWORD_REG = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = { username, fullName, email, level, role, password, re_password };

    if (
      validUsername &&
      validFullName &&
      validEmail &&
      validPassword &&
      validRe_password
    ) {
      setSigningUp(true); // Show circular progress

      try {
        const response = await signup(username.toUpperCase(), fullName, email, level, role, password, re_password);

        if (response.success) {
          setAccountCreated(true);
          setAlertSeverity('success');
          setAlertMessage(response.message); // Use Django server's success message
        } else {
          setErrors(validation(formData));
          setAlertSeverity('error');
          setAlertMessage(response.message); // Use Django server's error message
        }
      } catch (error) {
        console.error('Signup error:', error);
        setAlertSeverity('error');
        setAlertMessage('An error occurred. Please try again later.');
      } finally {
        setSigningUp(false); // Hide circular progress
        setAlertOpen(true); // Display the alert
      }
    } else {
      setErrors(validation(formData));
      setAlertSeverity('error');
      setAlertMessage('Invalid input. Please check your inputs.');
      setAlertOpen(true); // Display the alert
    }
  };

  const { username, fullName, email, level, role, password, re_password } = formData;

  const validUsername = USERNAME_REG.test(username);
  const validFullName = FULLNAME_REG.test(fullName);
  const validEmail = EMAIL_REG.test(email);
  const validPassword = PASSWORD_REG.test(password);
  const validRe_password = PASSWORD_REG.test(re_password);

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
            Sign up
          </Typography>
          {/* Display Alert */}
          {alertOpen && (
            <Alert
              severity={alertSeverity}
              onClose={() => setAlertOpen(false)}
              sx={{ mt: 2 }}
            >
              {alertMessage}
            </Alert>
          )}
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="Index Number/Lecturer ID"
                  name="username"
                  autoComplete="username"
                  value={username}
                  onChange={handleChange}
                  helperText={errors.username}
                  error={errors.username}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="fullName"
                  label="Full Name"
                  name="fullName"
                  autoComplete="fullName"
                  value={fullName}
                  onChange={handleChange}
                  helperText={errors.fullName}
                  error={errors.fullName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={handleChange}
                  helperText={errors.email}
                  error={errors.email}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id="level">Level</InputLabel>
                  <Select
                    labelId="level"
                    id="level"
                    value={level}
                    label="Level"
                    name="level"
                    onChange={handleChange}
                  >
                    <MenuItem value={100}>100</MenuItem>
                    <MenuItem value={200}>200</MenuItem>
                    <MenuItem value={300}>300</MenuItem>
                    <MenuItem value={400}>400</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id="role">Role</InputLabel>
                  <Select
                    labelId="role"
                    id="role"
                    value={role}
                    label="Role"
                    name="role"
                    onChange={handleChange}
                  >
                    <MenuItem value='Student'>Student</MenuItem>
                    <MenuItem value='Lecturer'>Lecturer</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  value={password}
                  onChange={handleChange}
                  helperText={errors.password}
                  error={errors.password}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  name="re_password"
                  label="Confirm Password"
                  type="password"
                  id="re_password"
                  value={re_password}
                  onChange={handleChange}
                  helperText={errors.re_password}
                  error={errors.re_password}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={signingUp} // Disable the button while signing up
            >
              {signingUp ? <CircularProgress size={24} /> : 'Sign Up'}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { signup })(SignUp);
