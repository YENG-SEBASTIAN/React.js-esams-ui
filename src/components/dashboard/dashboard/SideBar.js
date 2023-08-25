import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { Link } from 'react-router-dom'

export const mainListItems = (
  <React.Fragment>
    <Link to='/dashboard/studentDashboard'>
      <ListItemButton>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>
    </Link>

    <Link to='/dashboard/student'>
      <ListItemButton>
        <ListItemIcon>
          <PersonIcon />
        </ListItemIcon>
        <ListItemText primary="Student" />
      </ListItemButton>
    </Link>

    <Link to='/dashboard/updateCourse/:id'></Link>

    <Link to='/dashboard/attendance'>
      <ListItemButton>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Attendance" />
      </ListItemButton>
    </Link>

    <Link to='/dashboard/report'>
      <ListItemButton>
        <ListItemIcon>
          <AssessmentIcon />
        </ListItemIcon>
        <ListItemText primary="Reports" />
      </ListItemButton>
    </Link>

    <Link to='/dashboard/profile'>
      <ListItemButton>
        <ListItemIcon>
          <AssignmentIndIcon />
        </ListItemIcon>
        <ListItemText primary="Profile" />
      </ListItemButton>
    </Link>
    

  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>
    <Link to='/dashboard/dashboard'>
      <ListItemButton>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>
    </Link>

    <Link to='/dashboard/lecturer'>
      <ListItemButton>
        <ListItemIcon>
          <PersonIcon />
        </ListItemIcon>
        <ListItemText primary="Lecturer" />
      </ListItemButton>
    </Link>

    <Link to='/dashboard/takeAttendance'>
      <ListItemButton>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Take Attendance" />
      </ListItemButton>
    </Link>

    <Link to='/dashboard/lecturerReport'>
      <ListItemButton>
        <ListItemIcon>
          <AssessmentIcon />
        </ListItemIcon>
        <ListItemText primary="Reports" />
      </ListItemButton>
    </Link>

    <Link to='/dashboard/lecturerProfile'>
      <ListItemButton>
        <ListItemIcon>
          <AssignmentIndIcon />
        </ListItemIcon>
        <ListItemText primary="Profile" />
      </ListItemButton>
    </Link>

    <Link to='/dashboard/attendancePage'></Link>
    <Link to='/dashboard/updateLceturerCourse/:id'></Link>
  </React.Fragment>
);
