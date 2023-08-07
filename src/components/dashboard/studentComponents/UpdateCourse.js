
import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Title from '../dashboard/Title';
import axios from 'axios';
import { update_sudent_courses } from './studentService/service';
import { useNavigate, useParams } from 'react-router-dom';
import { STUDENTS_API_BASE_URL } from '../../../actions/types';


const defaultTheme = createTheme();

export default function UpdateCourse() {

  const navigate = useNavigate();
  const params = useParams();
  const [errors, setErrors] = React.useState({});

  const [query, setQuery] = React.useState({
    courseName: "",
    courseCode: "",
    creditHours: "",
    lecturerID: ""
  })

  const handleUpdateChange = async (e) => {
    const queryClone = { ...query };
    queryClone[e.target.name] = e.target.value;
    setQuery(queryClone)
  }


  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.courseName !== "" && query.courseCode !== "" && query.creditHours !== "" && query.lecturerID !== "") {
      update_sudent_courses(params.id, query.courseName, query.courseCode, query.creditHours, query.lecturerID)
      return navigate("/dashboard/")
    }

  }

  React.useEffect(() => {
    const fetchCourses = async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `JWT ${localStorage.getItem("access")}`,
          "accept": "application/json"
        }
      };
      await axios.get(STUDENTS_API_BASE_URL + `getCourse/${params.id}/`, config)
        .then(res => setQuery(res.data))
    }
    fetchCourses();
  })

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
                autoFocus
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
                type='number'
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
              >
                Update Course
              </Button>
            </Box>
          </Box>
          {/* <Copyright sx={{ mt: 8, mb: 4 }} /> */}
        </Container>
      </ThemeProvider>
    </React.Fragment>
  );
}
