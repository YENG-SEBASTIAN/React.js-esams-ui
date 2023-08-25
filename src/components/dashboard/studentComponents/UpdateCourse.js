import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Title from '../dashboard/Title';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import { update_sudent_courses } from './studentService/service';
import { useNavigate, useParams } from 'react-router-dom';
import { STUDENTS_API_BASE_URL } from '../../../actions/types';

const defaultTheme = createTheme();

export default function UpdateCourse() {
  const navigate = useNavigate();
  const params = useParams();

  const [query, setQuery] = useState({
    courseName: '',
    courseCode: '',
    creditHours: '',
    lecturerID: '',
  });
  const [updating, setUpdating] = useState(false);

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setQuery((prevQuery) => ({
      ...prevQuery,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      query.courseName !== '' &&
      query.courseCode !== '' &&
      query.creditHours !== '' &&
      query.lecturerID !== ''
    ) {
      setUpdating(true); // Show circular progress
      try {
        await update_sudent_courses(
          params.id,
          query.courseName,
          query.courseCode,
          query.creditHours,
          query.lecturerID
        );
        setUpdating(false); // Hide circular progress
        return navigate('/dashboard/studentDashboard');
      } catch (error) {
        console.error('Update course error:', error);
        setUpdating(false); // Hide circular progress on error
      }
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${localStorage.getItem('access')}`,
          accept: 'application/json',
        },
      };
      try {
        const response = await axios.get(
          STUDENTS_API_BASE_URL + `getCourse/${params.id}/`,
          config
        );
        setQuery(response.data);
      } catch (error) {
        console.error('Error fetching course:', error);
      }
    };
    fetchCourses();
  }, [params.id]);

  return (
    <React.Fragment>
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
              <Title>Update your courses</Title>
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="courseName"
                label="Course Name"
                name="courseName"
                autoComplete="courseName"
                value={query.courseName}
                onChange={handleUpdateChange}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="courseCode"
                label="Course Code"
                id="courseCode"
                value={query.courseCode}
                onChange={handleUpdateChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="creditHours"
                label="Credit Hours"
                id="creditHours"
                type="number"
                value={query.creditHours}
                onChange={handleUpdateChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="lecturerID"
                label="Lecturer Full Name"
                id="lecturerID"
                value={query.lecturerID}
                onChange={handleUpdateChange}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={updating} // Disable the button while updating
              >
                {updating ? <CircularProgress size={24} /> : 'Update Course'}
              </Button>
            </Box>
          </Box>
          {/* <Copyright sx={{ mt: 8, mb: 4 }} /> */}
        </Container>
      </ThemeProvider>
    </React.Fragment>
  );
}
