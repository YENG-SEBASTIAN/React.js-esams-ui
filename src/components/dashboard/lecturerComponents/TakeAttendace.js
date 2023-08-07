
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import TextField from '@mui/material/TextField';
import { invigilator_add_courses } from './services/service';
import validation from '../../auth/validation/validation';
import { useNavigate } from 'react-router-dom';
import { USERS_API_BASE_URL } from '../../../actions/types';
import axios from 'axios';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function TakeAttendace() {

  const navigate = useNavigate();
  const [errors, setErrors] = React.useState({});
  const [open, setOpen] = React.useState(false);
  const [courseCode, setCourseCode] = React.useState(2);
  const [courseName, setCourseName] = React.useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = { courseCode, courseName };
    if (courseCode !== "" && courseName !== "") {
      invigilator_add_courses(courseCode, courseName);
      console.log(formData);
      handleClose()
      return navigate("/dashboard/attendancePage")
    } else {
      setErrors(validation(formData));
    }

  }

  const markAttendance = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `JWT ${localStorage.getItem("access")}`,
        "accept": "application/json"
      }
    };
    await axios.get(USERS_API_BASE_URL + `recognize/`, config)
      .catch(err => console.log(err))
  }

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Take Students Attendance
      </Button>
      <Button variant="contained" onClick={markAttendance}>
        Mark Attendance
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Enter course details"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <TextField
              margin="normal"
              required
              fullWidth
              name="courseName"
              label="Course Name"
              id="courseName"
              onChange={(e) => setCourseName(e.target.value)}

            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="courseCode"
              label="Course Code"
              id="courseCode"
              onChange={(e) => setCourseCode(e.target.value)}

            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color='error'
            variant="contained"
            onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            onClick={handleSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}