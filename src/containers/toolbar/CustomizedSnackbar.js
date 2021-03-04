import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },

  alert: {
    fontSize: '100%'
  }

}));

export default function CustomizedSnackbar({ message, severity }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <div className={classes.root}>
      {open ?
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert className={classes.alert} onClose={handleClose} severity={severity}>
            {message}
          </Alert>
        </Snackbar>
        : ''}
    </div>
  );
}


