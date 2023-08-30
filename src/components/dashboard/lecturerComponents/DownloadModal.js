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
  const [pdfUrl, setPdfUrl] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const handleDownload = async () => {
    try {
      const config = {
        headers: {
          "Authorization": `JWT ${localStorage.getItem("access")}`,
        }
      };
      const response = await axios.get(
        `${LECTURERS_API_BASE_URL}GeneratePDFView/${courseCode}/${courseName}/`,
        {
          responseType: 'blob', // Important: Set the response type to 'blob'
          headers: config.headers // Pass the authorization header
        }
      );
      // Create a URL for the blob response
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const pdfBlobUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(pdfBlobUrl);
  
      // Trigger the download
      const link = document.createElement('a');
      link.href = pdfBlobUrl;
      link.download = `${courseCode}_attendance.pdf`;
      link.click();
  
      // Clean up the URL after download
      URL.revokeObjectURL(pdfBlobUrl);
      handleClose();
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };
  


  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen}>
        Report
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
            onClick={handleDownload}
            disabled={downloading} // Disable the button while downloading
          >
            {downloading ? <CircularProgress size={24} /> : "Download"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
