

import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { DeleteForeverRounded, EditAttributesRounded } from '@mui/icons-material';
import Title from '../dashboard/Title';
import axios from 'axios';
import { LECTURERS_API_BASE_URL } from '../../../actions/types';
import { delete_lecturer_course } from './services/service';
import { useNavigate, Link } from 'react-router-dom';


export default function LecturerDashboard() {
  const navigate = useNavigate();

  const [courses, setCourses] = React.useState([]);

  const load_lecturer_courses = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `JWT ${localStorage.getItem("access")}`,
        "accept": "application/json"
      }
    };
    await axios.get(LECTURERS_API_BASE_URL + `lecturerGetSemesterCourse/`, config)
      .then(res => setCourses(res.data))
  };

  React.useEffect(() => {
    load_lecturer_courses();
  }, [])


  const delete_course = (id) => {
    delete_lecturer_course(id);
    return navigate("/dashboard/dashboard")
  }


  return (
    <React.Fragment>
      <Title>Semeter Courses</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Class Name</TableCell>
            <TableCell>Course Name</TableCell>
            <TableCell>Course Code</TableCell>
            <TableCell>Level</TableCell>
            <TableCell>Credit Hours</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {courses.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.className}</TableCell>
              <TableCell>{row.courseName}</TableCell>
              <TableCell>{row.courseCode}</TableCell>
              <TableCell>{row.level}</TableCell>
              <TableCell>{row.creditHours}</TableCell>
              <TableCell align="right">
                <Link to={`/dashboard/updateLceturerCourse/${row.id}`}>
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
