import React, { forwardRef } from 'react';
import { Button, Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

function Alert (props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		'& > * + *': {
			marginTop: theme.spacing(2)
		}
	}
}));

export const CustomizedSnackbars = forwardRef(({ success, message }, ref) => {
	const classes = useStyles();
	const [
		open,
		setOpen
	] = React.useState(false);

	const handleClick = () => {
		setOpen(true);
	};

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		setOpen(false);
	};

	return (
		<div className={classes.root}>
			<Button variant="outlined" onClick={handleClick} style={{ display: 'none' }} ref={ref}>
				Open snackbar
			</Button>
			<Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
				<Alert severity={!success && 'error'}>{message}</Alert>
			</Snackbar>
		</div>
	);
});
