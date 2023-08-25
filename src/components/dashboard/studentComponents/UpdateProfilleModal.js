import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { USERS_API_BASE_URL } from '../../../actions/types';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function UpdateProfileModal() {
  const [open, setOpen] = useState(false);
  const [picture, setPicture] = useState(null);
  const [query, setQuery] = useState({
    programme: '',
    level: '',
    contact: '',
    about: '',
    picture: '',
  });

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setQuery((prevQuery) => ({
      ...prevQuery,
      [name]: value,
    }));
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('programme', query.programme);
    formData.append('level', query.level);
    formData.append('about', query.about);
    formData.append('contact', query.contact);
    formData.append('picture', picture[0]);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `JWT ${localStorage.getItem('access')}`,
      },
    };

    try {
      await axios.put(USERS_API_BASE_URL + 'updateProfileInfo/', formData, config);
      handleClose();
    } catch (error) {
      console.error('Update profile error:', error);
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      const config = {
        headers: {
          Authorization: `JWT ${localStorage.getItem('access')}`,
        },
      };
      try {
        const response = await axios.get(USERS_API_BASE_URL + 'getProfile/', config);
        setQuery(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    fetchUserProfile();
  }, []);

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Update Profile
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Update profile"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <TextField
              margin="normal"
              required
              fullWidth
              name="programme"
              label="Program of study"
              id="programme"
              value={query.programme}
              onChange={handleUpdateChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="level"
              label="Level"
              id="level"
              value={query.level}
              onChange={handleUpdateChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="about"
              label="About"
              multiline
              id="about"
              value={query.about}
              onChange={handleUpdateChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="contact"
              label="Mobile Number"
              value={query.contact}
              onChange={handleUpdateChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="picture"
              label="Upload a picture with your full face"
              id="picture"
              type="file"
              onChange={(e) => setPicture(e.target.files)}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="error" variant="contained" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
