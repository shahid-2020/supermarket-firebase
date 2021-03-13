import React from 'react';
import {useConsumer} from '../../context/AppContext';
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

export default function CustomizedSnackbar() {
  const classes = useStyles();
  const {store, dispatch} = useConsumer();


  const handleClose = (event) => {
    dispatch({type:'RESET_ALERT'});
  };

  return (
    <div className={classes.root}>
        <Snackbar open={store.alert.open} autoHideDuration={6000} onClose={handleClose}>
          <Alert className={classes.alert} onClose={handleClose} severity={store.alert.severity}>
            {store.alert.message}
          </Alert>
        </Snackbar>
    </div>
  );
}


