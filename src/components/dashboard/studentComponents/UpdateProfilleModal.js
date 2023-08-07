
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { USERS_API_BASE_URL } from '../../../actions/types';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function UpdateProfilleModal() {

    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);

    const initialFormData = Object.freeze({
        programme: '',
        contact: '',
        about: '',
        picture: ''
    })

    const [formInput, setFormInput] = React.useState(initialFormData);
    const [picture, setPicture] = React.useState(null);

    const [query, setQuery] = React.useState({
        programme: "",
        contact: "",
        about: "",
        picture: ""
      })
    
      const handleUpdateChange = async (e) => {
        const queryClone = { ...query };
        queryClone[e.target.name] = e.target.value;
        setQuery(queryClone)
      }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `JWT ${localStorage.getItem("access")}`,
            }
        };
        const userData = {
            programme: query.programme,
            contact: query.contact,
            about: query.about,
            picture: picture[0]
        }
        const res = await axios.put(USERS_API_BASE_URL + `updateProfile/`, userData, config)
            .then(res => res.data)
            .catch(err => console.log(err))
        handleClose();
        
    }

    React.useEffect(() => {
        const fetchUserProfile = async () => {
            const config = {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `JWT ${localStorage.getItem("access")}`,
                }
            };
            await axios.get(USERS_API_BASE_URL + `getProfile/`, config)
                .then(res => setQuery(res.data))
        }
        fetchUserProfile();
    }, [])
    return (
        <div>
            <Button variant="outlined" onClick={handleClickOpen}>
                Update Profile
            </Button>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Enter course details"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="programme"
                            label="Programe of study"
                            id="programme"
                            value={query.programme}
                            onChange={handleUpdateChange}

                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="contact"
                            label="Mobile Number"
                            id="contact"
                            value={query.contact}
                            onChange={handleUpdateChange}

                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="about"
                            label="About"
                            multiline
                            id="about"
                            value={query.about}
                            onChange={handleUpdateChange}

                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="picture"
                            label="Upload a picture with your full face"
                            id="picture"
                            type='file'
                            onChange={(e) => setPicture(e.target.files)}

                        />
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        color='error'
                        variant="contained"
                        onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        onClick={handleSubmit}>
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}