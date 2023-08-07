
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { DeleteForeverRounded, EditAttributesRounded } from '@mui/icons-material';
import Title from '../dashboard/Title';
import axios from 'axios';
import { STUDENTS_API_BASE_URL } from '../../../actions/types';
import { delete_student_course } from './studentService/service';
import { useNavigate, Link } from 'react-router-dom';


export default function SudentDashboard() {
  const navigate = useNavigate();

  const [courses, setCourses] = React.useState([]);

  const load_student_courses = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `JWT ${localStorage.getItem("access")}`,
        "accept": "application/json"
      }
    };
    await axios.get(STUDENTS_API_BASE_URL + `getSemesterCourses/`, config)
      .then(res => setCourses(res.data))
  };

  React.useEffect(() => {
    load_student_courses();
  }, [])


  const delete_course = (id) => {
    delete_student_course(id);
    return navigate("/dashboard/")
  }


  return (
    <React.Fragment>
      <Title>Semeter Courses</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Course Name</TableCell>
            <TableCell>Course Code</TableCell>
            <TableCell>Credit Hours</TableCell>
            <TableCell>Lecturer</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {courses.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.courseName}</TableCell>
              <TableCell>{row.courseCode}</TableCell>
              <TableCell>{row.creditHours}</TableCell>
              <TableCell>{row.lecturerID}</TableCell>
              <TableCell align="right">
                <Link to={`/dashboard/updateCourse/${row.id}`}>
                  <EditAttributesRounded color='primary' />
                </Link>

                <DeleteForeverRounded onClick={() => delete_course(row.id)} color='error' />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

    </React.Fragment>
  );
}
