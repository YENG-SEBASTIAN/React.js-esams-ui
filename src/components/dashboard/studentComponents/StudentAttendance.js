
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from '../dashboard/Title';
import axios from 'axios';
import { STUDENTS_API_BASE_URL } from '../../../actions/types';



function createData(id, indexBumber, courseCode, courseName, atendanceTime, isPresent) {
  return { id, indexBumber, courseCode, courseName, atendanceTime, isPresent };
}

const rows = [
  createData(
    0,
    'UEB3501234',
    'Comp 401',
    'Python',
    '	July 20, 2023, 3:05 p.m.',
    'Present',
  ),
  createData(
    1,
    'UEB3501234',
    'Comp 401',
    'Python',
    '	July 20, 2023, 3:05 p.m.',
    'Present',
  ),
  createData(2, 'UEB3501234', 'Comp 401', 'Python', '	July 20, 2023, 3:05 p.m.', 'Present'),
  createData(
    3,
    'UEB3501234',
    'Comp 401',
    'Python',
    '	July 20, 2023, 3:05 p.m.',
    'Present',
  ),
  createData(
    4,
    'UEB3501234',
    'Comp 401',
    'Python',
    '	July 20, 2023, 3:05 p.m.',
    'Present',
  ),
];


export default function StudentAttendance() {

  const [attendace, setAttendance] = React.useState([])

  const load_student_attendance = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `JWT ${localStorage.getItem("access")}`,
        "accept": "application/json"
      }
    };
    await axios.get(STUDENTS_API_BASE_URL + `getAttendance/`, config)
      .then(res => setAttendance(res.data))
  };

  React.useEffect(() => {
    load_student_attendance();
  }, [])


  return (
    <React.Fragment>
      <Title>Attendance</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Index Number</TableCell>
            <TableCell>Course Code</TableCell>
            <TableCell>Course Name</TableCell>
            <TableCell>Date & Time</TableCell>
            <TableCell align="right">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {attendace.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.indexNumber}</TableCell>
              <TableCell>{row.courseCode}</TableCell>
              <TableCell>{row.courseName}</TableCell>
              <TableCell>
                {
                  new Date(row.attendace).toLocaleDateString()
                }
                </TableCell>
              <TableCell align="right">{row.isPresent ? 'Present' : 'Absent'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}
