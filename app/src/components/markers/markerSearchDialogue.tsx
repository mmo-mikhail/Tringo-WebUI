import { FC } from 'react';
import * as React from 'react';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import Iframe from 'react-iframe';

export interface MarkerModalProps {
    title: string;
    price: number;
}

const styles = (theme: Theme) =>
    createStyles({
        root: {
            margin: 0,
            padding: 5
        },
        closeButton: {
            position: 'absolute',
            right: theme.spacing(1),
            top: theme.spacing(1),
            color: theme.palette.grey[500]
        }
    });

export interface DialogTitleProps extends WithStyles<typeof styles> {
    id: string;
    children: React.ReactNode;
    onClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
    const { children, classes, onClose } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root}>
            <div className="modal-header">
                <h1>{children}</h1>
            </div>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const MarkerSearchDialogue: FC<{ props: MarkerModalProps }> = ({ props }) => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <span
                role="button"
                tabIndex={0}
                className="price-marker"
                onClick={handleClickOpen}
                onKeyDown={handleClickOpen}
            >
                <div className="city-text">{props.title}</div>
                <div className="price-text">${Number(props.price.toFixed(1)).toLocaleString()}</div>
            </span>
            <Dialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                disableBackdropClick={true}
                disableEscapeKeyDown={true}
                fullWidth={true}
            >
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Flight Search
                </DialogTitle>

                <Iframe
                    url="redirectsearch.html"
                    width="100%"
                    height="600px"
                    id="myId"
                    position="relative"
                    overflow="visible"
                />
            </Dialog>
        </div>
    );
};

export default MarkerSearchDialogue;
