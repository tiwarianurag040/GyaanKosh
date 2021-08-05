import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FileBase from "react-file-base64";
import { Close as CloseIcon } from "@material-ui/icons";

import { useHistory } from "react-router-dom";
import ChipInput from "material-ui-chip-input";

import {
  Modal,
  Backdrop,
  Fade,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
} from "@material-ui/core";
import useStyles from "./styles";

import { createPost, updatePost } from "../../actions/posts";

const Form = ({ currentId, setCurrentId }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [postData, setPostData] = useState({
    bookName: "",
    price: "",
    contact: "",
    subject: [],
    selectedFile: "",
  });
  const user = JSON.parse(localStorage.getItem("profile"));

  const handleOpen = () => {
    // clear();
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  //Selecting from state of application
  const post = useSelector((state) =>
    currentId ? state.posts.posts.find((p) => p._id === currentId) : null
  );

  //UseEffect over change of post
  useEffect(() => {
    if (post) {
      handleOpen();
      setPostData(post);
    }
  }, [post]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentId === 0) {
      dispatch(createPost({ ...postData, name: user?.result?.name }, history));
      clear();
    } else {
      dispatch(
        updatePost(currentId, { ...postData, name: user?.result?.name })
      );
      clear();
    }
  };

  //Clear button functionality
  const clear = () => {
    setCurrentId(0);
    setPostData({
      bookName: "",
      price: "",
      contact: "",
      subject: [],
      selectedFile: "",
    });
  };

  if (!user?.result?.name) {
    return (
      <Paper className={classes.paper}>
        <Typography variant="h6" align="center">
          Please Sign In to post the book and to interact with others post.
        </Typography>
      </Paper>
    );
  }

  const handleAddChip = (tag) => {
    setPostData({ ...postData, subject: [...postData.subject, tag] });
  };

  const handleDeleteChip = (chipToDelete) => {
    setPostData({
      ...postData,
      subject: postData.subject.filter((tag) => tag !== chipToDelete),
    });
  };

  return (
    <div>
      <button type="button" onClick={handleOpen}>
        Post a Book
      </button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Paper className={classes.paper}>
            <IconButton style={{ float: "right" }} onClick={handleClose}>
              <CloseIcon />
            </IconButton>
            <Typography variant="h6">
              {currentId ? `Editing BookPost` : "Creating a BookPost"}
            </Typography>
            <form
              autoComplete="off"
              noValidate
              className={`${classes.root}`}
              onSubmit={handleSubmit}
            >
              <TextField
                name="bookName"
                variant="outlined"
                label="Book Name (year of publication)"
                fullWidth
                value={postData.bookName}
                onChange={(e) =>
                  setPostData({ ...postData, bookName: e.target.value })
                }
              />
              <TextField
                name="price"
                variant="outlined"
                label="Price"
                fullWidth
                value={postData.price}
                onChange={(e) =>
                  setPostData({ ...postData, price: e.target.value })
                }
              />
              <TextField
                name="contact"
                variant="outlined"
                label="Any contact detail (phone no. or email)"
                fullWidth
                value={postData.contact}
                onChange={(e) =>
                  setPostData({ ...postData, contact: e.target.value })
                }
              />
              {/* <TextField
                name="subject"
                variant="outlined"
                label="Subject"
                fullWidth
                value={postData.subject}
                onChange={(e) =>
                  setPostData({
                    ...postData,
                    subject: e.target.value.split(","),
                  })
                }
              /> */}
              <div style={{ padding: "5px 0", width: "100%", margin: "10px" }}>
                <ChipInput
                  name="subject"
                  variant="outlined"
                  label="Tags (subject, bookName) for efficient search"
                  fullWidth
                  value={postData.subject}
                  onAdd={(chip) => handleAddChip(chip)}
                  onDelete={(chip) => handleDeleteChip(chip)}
                />
              </div>
              <div className={classes.fileInput}>
                <FileBase
                  type="file"
                  multiple={false}
                  onDone={({ base64 }) =>
                    setPostData({ ...postData, selectedFile: base64 })
                  }
                />
              </div>
              <Button
                className={classes.buttonSubmit}
                variant="contained"
                color="primary"
                size="large"
                type="submit"
                fullWidth
                onClick={handleClose}
              >
                Submit
              </Button>

              <Button
                variant="contained"
                color="secondary"
                size="small"
                onClick={clear}
                fullWidth
              >
                Clear
              </Button>
            </form>
          </Paper>
        </Fade>
      </Modal>
    </div>
  );
};

export default Form;
