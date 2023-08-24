

import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import CardMedia from '@mui/material/CardMedia';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Title from '../dashboard/Title';
import axios from 'axios';
import { USERS_API_BASE_URL, REACT_API_BASE_URL } from '../../../actions/types';
import styled from '@emotion/styled';
import SetProfileModal from '../studentComponents/SetProfileModal';
import UpdateProfilleModal from '../studentComponents/UpdateProfilleModal';

const defaultTheme = createTheme();

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'left',
  color: theme.palette.text.secondary,
}));

export default function LecturerProfile() {

  const [user, setUser] = React.useState([]);
  const [profile, setProfile] = React.useState([]);

  const userInfo = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `JWT ${localStorage.getItem("access")}`,
        "accept": "application/json"
      }
    };
    await axios.get(USERS_API_BASE_URL + `getUser/`, config)
      .then(res => setUser(res.data))
  }

  const userProfile = async () => {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `JWT ${localStorage.getItem("access")}`,
      }
    };
    await axios.get(USERS_API_BASE_URL + `getProfile/`, config)
      .then(res => setProfile(res.data))
  }

  React.useEffect(() => {
    userInfo()
  }, [])

  React.useEffect(() => {
    userProfile()
  }, [])



  return (
    <React.Fragment>
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Grid item>

          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <CardMedia
                component='img'
                image={REACT_API_BASE_URL + profile.picture}
                alt={user.fullName}
                height={300}
                width={400}
              />
            </Grid>

            {
              profile || user ?

                <>
                  <Grid item xs={6}>
                    {/* <Item> */}
                    <Title>
                      <h6>ID: {user.username}</h6>
                    </Title>
                    <Title>
                      <h6>Role: {user.role}</h6>
                    </Title>
                    <Title>
                      <h6>Role: {user.level}</h6>
                    </Title>
                    <Title>
                      <h6>Name: {user.fullName}</h6>
                    </Title>
                    <Title>
                      <h6>Program: {profile.programme}</h6>
                    </Title>
                    <Title>
                      <h6>Contact: {profile.contact}</h6>
                    </Title>
                    <Title>
                      <h6>Email: {user.email}</h6>
                    </Title>
                    <Title>
                      <h6>About: {profile.about}</h6>
                    </Title>
                    {/* </Item> */}

                    {
                      // profile ? <UpdateProfilleModal /> : <SetProfileModal />
                      <SetProfileModal />
                    }

                  </Grid>
                </> : ""
            }

          </Grid>
        </Container>
      </ThemeProvider>
    </React.Fragment>
  );
}
