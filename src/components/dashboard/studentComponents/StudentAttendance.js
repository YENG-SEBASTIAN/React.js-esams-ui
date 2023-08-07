
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from '../dashboard/Title';

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
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.indexBumber}</TableCell>
              <TableCell>{row.courseCode}</TableCell>
              <TableCell>{row.courseName}</TableCell>
              <TableCell>{row.atendanceTime}</TableCell>
              <TableCell align="right">{row.isPresent}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}
