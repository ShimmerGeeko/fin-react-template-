import React from 'react';
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/EditOutlined';
import ViewIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';
import AuthorizeIcon from '@material-ui/icons/Security';
import Button from '@material-ui/core/Button';
import { FButton } from './FButton';



const PageModeSwitcher = (props) => {

    const {
        onAddMode, onModifyMode, onDeleteMode, onInquireMode, onAuthorizeMode, enabledModes, justify
    } = props;

    return (
        <Grid container spacing={0} justify={justify}>
            {enabledModes.Add ? (<Grid item xs={2}>
                <FButton size="small" onClick={onAddMode}  startIcon={<AddIcon />} style={{ width: '98px', backgroundColor: '#0C56A6', color: "white" }} >Add</FButton>
            </Grid>) : null}
            {enabledModes.Modify ? (<Grid item xs={2}>
                <Button size="small" onClick={onModifyMode} startIcon={<EditIcon />} style={{ width: '98px', backgroundColor: '#0C56A6',color: "white" }}>Modify</Button>
            </Grid>) : null}
            {enabledModes.Delete ? (<Grid item xs={2}>
                <Button size="small" onClick={onDeleteMode} startIcon={<DeleteIcon />} style={{ width: '98px', backgroundColor: '#0C56A6',color: "white"}}>Delete</Button>
            </Grid>) : null}
            {enabledModes.Inquire ? (<Grid item xs={2}>
                <Button size="small" onClick={onInquireMode} startIcon={<ViewIcon />} style={{ width: '98px', backgroundColor: '#0C56A6',color: "white" }}>Inquire</Button>
            </Grid>) : null}
            {enabledModes.Authorize ? (<Grid item xs={2}>
                <Button size="small" onClick={onAuthorizeMode} startIcon={<AuthorizeIcon />} style={{ width: '98px', backgroundColor: '#0C56A6',color: "white" }}>Authorize</Button>
            </Grid>) : null}
        </Grid>
    );
}


export const FPageModeSwitcher =  React.memo(PageModeSwitcher);