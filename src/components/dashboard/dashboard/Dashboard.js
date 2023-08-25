import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import StreamSharpIcon from '@mui/icons-material/StreamSharp';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ExitToAppSharpIcon from '@mui/icons-material/ExitToAppSharp';
import { mainListItems, secondaryListItems } from './SideBar';
import Chart from './Chart';
import DisplayRole from './DisplayRole';
import Orders from './Orders';
import { useNavigate, Routes, Route, Navigate } from 'react-router-dom';

import { connect } from 'react-redux';
import { checkAuthenticated, logout } from '../../../actions/auth';
import StudentAttendance from '../studentComponents/StudentAttendance';
import Student from '../studentComponents/Student';
import StudentReport from '../studentComponents/StudentReport';
import SudentDashboard from '../studentComponents/SudentDashboard';
import Profile from '../studentComponents/Profile';
import UpdateCourse from '../studentComponents/UpdateCourse';

import LecturerDashboard from '../lecturerComponents/LecturerDashboard';
import Lecturer from '../lecturerComponents/Lecturer';
import TakeAttendace from '../lecturerComponents/TakeAttendace';
import Report from '../lecturerComponents/Report';
import LecturerProfile from '../lecturerComponents/LecturerProfile';
import MarkAttendance from '../lecturerComponents/MarkAttendance';
import UpdateLectureCourse from '../lecturerComponents/UpdateLectureCourse';
import { USERS_API_BASE_URL } from '../../../actions/types';
import axios from 'axios';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="">
        eSams.com
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

const Dashboard = ({ checkAuthenticated, logout }) => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(true);
  const [loggedOut, setLoggedOut] = React.useState(false);
  const [userType, setUserType] = React.useState(null);


  const toggleDrawer = () => {
    setOpen(!open);
  };

  React.useEffect(() => {
    check_login_status();
  })

  const logout_user = () => {
    logout()
    setLoggedOut(true);
  }

  const check_login_status = () => {
    if (!checkAuthenticated) {
      return navigate("/");
    }
  }


  const userTypeInfo = async () => {
    const config = {
      headers: {
        'Authorization': `JWT ${localStorage.getItem('access')}`,
      },
    };
    try {
      const response = await axios.get(USERS_API_BASE_URL + 'getUser/', config);
      setUserType(response.data);
    } catch (error) {
      console.error('Error fetching user profile info:', error);
    }
  };

  React.useEffect(() => {
    userTypeInfo();
  }, []);

  if (loggedOut) {
    return navigate("/")
  }


  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              <StreamSharpIcon /> eSams <StreamSharpIcon />
            </Typography>

            <Button
              type="submit"
              variant="contained"
              color="error"
              onClick={logout_user}
            >
              Logout <ExitToAppSharpIcon />
            </Button>

          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {
              userType && userType.role === 'Student' ?
                <>
                  {mainListItems}
                </> : <>
                  {secondaryListItems}
                </>
            }
            {/* {mainListItems}
            <Divider sx={{ my: 1 }} />
            {secondaryListItems} */}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              {/* Chart */}
              <Grid item xs={12} md={9} lg={9}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    // height: 240,
                  }}
                >
                  {/* <Chart /> */}
                  <Routes>

                    {/* students routes */}
                    <Route path='/studentDashboard' exact element={<SudentDashboard />} />
                    {/* {
                      checkAuthenticated ? 
                      <>
                      
                      </> :''
                    } */}
                    <Route path='/student' exact element={<Student />} />
                    <Route path='/attendance' exact element={<StudentAttendance />} />
                    <Route path='/report' exact element={<StudentReport />} />
                    <Route path='/profile' exact element={<Profile />} />
                    <Route path='/updateCourse/:id' exact element={<UpdateCourse />} />

                    {/* lecturers routes */}
                    <Route path='/dashboard' exact element={<LecturerDashboard />} />
                    <Route path='/lecturer' exact element={<Lecturer />} />
                    <Route path='/takeAttendance' exact element={<TakeAttendace />} />
                    <Route path='/lecturerReport' exact element={<Report />} />
                    <Route path='/lecturerProfile' exact element={<LecturerProfile />} />
                    <Route path='/MarkAttendance' exact element={<MarkAttendance />} />
                    <Route path='/updateLceturerCourse/:id' exact element={<UpdateLectureCourse />} />

                  </Routes>
                  {/* <UpdateCourse /> */}
                </Paper>
              </Grid>
              {/* Recent Deposits */}
              <Grid item xs={12} md={3} lg={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                  }}
                >
                  <DisplayRole />
                </Paper>
              </Grid>
              {/* Recent Orders */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                  {/* <Orders /> */}
                </Paper>
              </Grid>
            </Grid>
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(null, { checkAuthenticated, logout })(Dashboard);