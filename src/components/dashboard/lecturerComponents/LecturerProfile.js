import * as React from 'react';
import { useEffect, useState } from 'react';
import CardMedia from '@mui/material/CardMedia';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { USERS_API_BASE_URL, REACT_API_BASE_URL } from '../../../actions/types';
import axios from 'axios';
import styled from '@emotion/styled';
import SetProfileModal from '../studentComponents/SetProfileModal';
import UpdateProfilleModal from '../studentComponents/UpdateProfilleModal';

const defaultTheme = createTheme();

const Item = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'left',
  color: theme.palette.text.secondary,
}));

export default function LecturerProfile() {
  const [user, setUser] = useState([]);
  const [profile, setProfile] = useState([]);

  useEffect(() => {
    const userInfo = async () => {
      try {
        const response = await axios.get(USERS_API_BASE_URL + 'getUser/', {
          headers: {
            Authorization: `JWT ${localStorage.getItem('access')}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    const userProfile = async () => {
      try {
        const response = await axios.get(USERS_API_BASE_URL + 'getProfile/', {
          headers: {
            Authorization: `JWT ${localStorage.getItem('access')}`,
          },
        });
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    userInfo();
    userProfile();
  }, []);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <CardMedia
              component="img"
              image={REACT_API_BASE_URL + profile.picture}
              alt={user.fullName}
              height={300}
              width={400}
            />
          </Grid>
          <Grid item xs={6}>
            <Item>
              <h6>ID: {user.username}</h6>
              <h6>Role: {user.role}</h6>
              <h6>Name: {user.fullName}</h6>
              <h6>Program: {profile.programme}</h6>
              <h6>Contact: {profile.contact}</h6>
              <h6>Email: {user.email}</h6>
              <h6>About: {profile.about}</h6>
            </Item>
            {
              profile.length === 0 ? 
              <> 
              <SetProfileModal />
              </> : 
              <>
              <UpdateProfilleModal />
              </>
            }
            
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
