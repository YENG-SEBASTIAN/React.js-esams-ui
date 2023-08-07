
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
import { STUDENTS_API_BASE_URL } from '../../../actions/types';
import validation from '../../auth/validation/validation';
import { add_student_semester_courses } from './studentService/service';
import { useNavigate } from 'react-router-dom';


const defaultTheme = createTheme();

export default function Student() {

  const navigate = useNavigate();
  const [errors, setErrors] = React.useState({});
  const [courseName, setCourseName] = React.useState('');
  const [courseCode, setCourseCode] = React.useState('');
  const [creditHours, setCreditHours] = React.useState(2);
  const [lecturerID, setLecturerID] = React.useState('');


  React.useEffect(() => {
    setErrors({})
  }, [courseName])

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {courseName, courseCode, creditHours, lecturerID};
    if(courseName !== "" && courseCode !== "" && creditHours !== "" && lecturerID !== ""){
      add_student_semester_courses(courseName, courseCode, creditHours, lecturerID);
    
      return navigate("/dashboard/")
    }else{
      setErrors(validation(formData));
    }
    
  }

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
            <Title>Add your semester courses</Title>
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
              <TextField
                margin="normal"
                required
                fullWidth
                name="creditHours"
                label="Credit Hours"
                id="creditHours"
                type='number'
              onChange={(e) => setCreditHours(e.target.value)}

              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="lecturerID"
                label="Lecturer Full Name"
                id="lecturerID"
              onChange={(e) => setLecturerID(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                add courses
              </Button>
            </Box>
          </Box>
          {/* <Copyright sx={{ mt: 8, mb: 4 }} /> */}
        </Container>
      </ThemeProvider>
    </React.Fragment>
  );
}
