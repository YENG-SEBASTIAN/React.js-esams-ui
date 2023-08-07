import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title';
import axios from 'axios';

import { REACT_API_BASE_URL } from '../../../actions/types';

function preventDefault(event) {
  event.preventDefault();
}

export default function DisplayRole() {
  const [user, setUser] = React.useState([]);

  React.useEffect(() => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `JWT ${localStorage.getItem("access")}`,
        "accept": "application/json"
      }
    };
    axios.get(REACT_API_BASE_URL + `auth/users/me`, config)
      .then(res => setUser(res.data))
      .catch(err => console.log(err))
  }, [])



  return (
    <React.Fragment>
      <Title>{user.username}</Title>
      <Typography component="p" variant="h4">
      <Title>{user.fullName}</Title>
      </Typography>
      <Typography component="p" variant="h4">
      <Title>{user.role}</Title>
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
         {new Date().getDate()} / {new Date().getMonth()} / {new Date().getFullYear()}
      </Typography> 
    </React.Fragment>
  );
}
