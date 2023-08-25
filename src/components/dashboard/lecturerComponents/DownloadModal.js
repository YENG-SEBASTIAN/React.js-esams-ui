import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import { LECTURERS_API_BASE_URL } from '../../../actions/types';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DownloadModal({ courseCode, courseName }) {
  const [open, setOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const downloadPDFFile = async () => {
    try {
      setDownloading(true); // Show circular progress
      const config = {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `JWT ${localStorage.getItem("access")}`,
          "accept": "application/json"
        }
      };
      await axios.get(LECTURERS_API_BASE_URL + `AttendancePDFReport/${courseCode}/${courseName}/`, config);
      setDownloading(false); // Hide circular progress
      handleClose();
    } catch (error) {
      console.error("Error downloading report:", error);
      // Handle the error here, e.g., show an error message to the user
      setDownloading(false); // Hide circular progress on error
    }
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Attendance report
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Download Report"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {/* Add any content here if needed */}
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
            variant="contained"
            onClick={downloadPDFFile}
            disabled={downloading} // Disable the button while downloading
          >
            {downloading ? <CircularProgress size={24} /> : "Download"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
