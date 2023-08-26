

import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from '../dashboard/Title';
import axios from 'axios';
import { LECTURERS_API_BASE_URL } from '../../../actions/types';
import { useNavigate, Link } from 'react-router-dom';
import DownloadModal from './DownloadModal';


export default function Report() {
  const navigate = useNavigate();

  const [courses, setCourses] = React.useState([]);

  const load_invigilated_courses = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `JWT ${localStorage.getItem("access")}`,
        "accept": "application/json"
      }
    };
    await axios.get(LECTURERS_API_BASE_URL + `invigilatorGetCourse/`, config)
      .then(res => setCourses(res.data))
  };

  React.useEffect(() => {
    load_invigilated_courses();
  }, [])



  return (
    <React.Fragment>
      <Title>Invigilated courses</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Course Code</TableCell>
            <TableCell>Course Name</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {courses.map((row) => (
            <TableRow key={row.id} style={{cursor:"pointer"}}>
              <TableCell>{row.courseCode}</TableCell>
              <TableCell>{row.courseName}</TableCell>
              <TableCell><DownloadModal courseCode={row.courseCode} courseName={row.courseName}/></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

    </React.Fragment>
  );
}
