import React, { useContext } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { ProjectContext } from "../../routes/ProjectPage";
import { useAuth } from "../../customHooks/useAuth";

import { useNavigate } from "react-router-dom";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { API_URL } from "../../api/config";

export default function AdminDeleteButton() {
  const auth = useAuth();
  const { project, setProject, checkIsEdit } = useContext(ProjectContext);
  const navigate = useNavigate();
  // const isScreenSmall = useMediaQuery(theme.breakpoints.down('md'));

  // for dialog pop-up
  const [open, setOpen] = React.useState(false);
  // Not just for admins, project members can delete now as well.
  const adminDeleteProject = async () => {
    const token = auth.getToken();
    if (token) {
      return fetch(`${API_URL}/api/projects/${project._id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify({
          projectId: project._id,
        }),
      }).then((resp) => {
        if (resp && resp.ok) {
          auth.getLatestUser(); // To reenable upload btn if graduate
          // we need to redirect admin back to projects page upon project delete.
          navigate("/projects");
        }
      });
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return checkIsEdit() ? (
    <React.Fragment>
      <Button
        sx={{ maxWidth: "180px" }}
        variant="outlined"
        startIcon={<DeleteOutlineIcon />}
        onClick={handleClickOpen}
        size="medium"
        color="error"
      >
        Delete Project
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{ paddingLeft: 5, paddingRight: 5, paddingTop: 5 }}
        >
          {"Are you sure you want to delete this project?"}
        </DialogTitle>
        <DialogContent sx={{ paddingLeft: 5, paddingRight: 5 }}>
          <DialogContentText id="alert-dialog-description">
            This action will permanently delete this project, are you sure?
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{ paddingLeft: 5, paddingRight: 5, paddingBottom: 5 }}
        >
          <Button color="error" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={(event) => {
              adminDeleteProject();
              handleClose();
            }}
            autoFocus
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  ) : null;
}
