
import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Title from '../dashboard/Title';
import { update_lecture_courses } from './services/service';
import { useNavigate, useParams } from 'react-router-dom';
import { LECTURERS_API_BASE_URL } from '../../../actions/types';
import axios from 'axios';


const defaultTheme = createTheme();

export default function UpdateLectureCourse() {

    const navigate = useNavigate();
    const params = useParams();
    
    const [query, setQuery] = React.useState({
        level: "",
        className: "",
        courseCode: "",
        courseName: "",
        creditHours: ""
      })
    
      const handleUpdateChange = async (e) => {
        const queryClone = { ...query };
        queryClone[e.target.name] = e.target.value;
        setQuery(queryClone)
      }


    const handleSubmit = (e) => {
        e.preventDefault();
        const id = params.id;
        if (query.level !== "" && query.className !== "" && query.courseCode !== "" && query.courseName !== "" && query.creditHours !== "") {
            update_lecture_courses(id, query.level, query.className, query.courseCode, query.courseName, query.creditHours);
            return navigate("/dashboard/dashboard")
        } 

    }

    React.useEffect(() => {
        const fetchLecturerCourses = async () => {
          const config = {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `JWT ${localStorage.getItem("access")}`,
              "accept": "application/json"
            }
          };
          await axios.get(LECTURERS_API_BASE_URL + `getCourse/${params.id}/`, config)
            .then(res => setQuery(res.data))
        }
        fetchLecturerCourses();
      }, [])

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
                            <Title>Update course</Title>
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>


                            <Grid item xs={12}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="className"
                                    label="Class Name"
                                    id="className"
                                    value={query.className}
                                    onChange={handleUpdateChange}
                                />
                            </Grid>

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="courseName"
                                label="Course Name"
                                id="courseName"
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

                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="level">Level</InputLabel>
                                    <Select
                                        labelId="level"
                                        id="level"
                                        value={query.level}
                                        label="Level"
                                        onChange={handleUpdateChange}
                                    >
                                        <MenuItem value={100}>100</MenuItem>
                                        <MenuItem value={200}>200</MenuItem>
                                        <MenuItem value={300}>300</MenuItem>
                                        <MenuItem value={400}>400</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Update course
                            </Button>
                        </Box>
                    </Box>
                    {/* <Copyright sx={{ mt: 8, mb: 4 }} /> */}
                </Container>
            </ThemeProvider>
        </React.Fragment>
    );
}
