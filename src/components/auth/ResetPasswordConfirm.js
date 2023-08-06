
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
import { useNavigate, useParams } from 'react-router-dom';

import { connect } from 'react-redux';
import { password_reset_confirm } from '../../actions/auth';

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

const PASSWORD_REG = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const ResetPasswordConfirm = ({ password_reset_confirm }) => {

  const params = useParams();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [requestSent, setRequestSent] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');


  const [new_password, setNewPassword] = useState('');
  const [validNewPassword, setValidNewPassword] = useState(false)

  const [re_new_password, setReNewPassword] = useState('');
  const [validReNewPassword, setValidReNewPassword] = useState(false)

  useEffect(() => {
    const result = PASSWORD_REG.test(new_password);
    setValidNewPassword(result);
  }, [new_password])

  useEffect(() => {
    const result = PASSWORD_REG.test(re_new_password);
    setValidReNewPassword(result);
  }, [re_new_password])

  useEffect(() => {
    setErrors({});
  }, [new_password, re_new_password])


  const handleSubmit = (event) => {
    event.preventDefault();
    const uid = params.uid;
    const token = params.token;
    const formData = { uid, token, new_password, re_new_password }
    if (validNewPassword === true && validReNewPassword === true) {
      password_reset_confirm(uid, token, new_password, re_new_password);
      setRequestSent(true)
      setSuccessMsg('Login Successful')
    } else {
      setErrors(validation(formData));
    }
  };

  if (requestSent) {
    return navigate("/")
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
            Set New Password
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="new_password"
              label="New Password"
              name="new_password"
              type="password"
              autoFocus
              onChange={(e) => setNewPassword(e.target.value)}
              helperText={errors.new_password}
              error={errors.new_password}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="re_new_password"
              label="Confirm new password"
              type="password"
              id="re_new_password"
              onChange={(e) => setReNewPassword(e.target.value)}
              helperText={errors.re_new_password}
              error={errors.re_new_password}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Reset
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


export default connect(null, { password_reset_confirm })(ResetPasswordConfirm);