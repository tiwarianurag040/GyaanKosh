import React from "react";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  ButtonBase,
  Typography,
} from "@material-ui/core";
import {
  SentimentSatisfiedOutlined as SmileIcon,
  SentimentDissatisfiedOutlined as SadIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@material-ui/icons";
import moment from "moment";
import useStyles from "./styles";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import { deletePost, buy, reject } from "../../../actions/posts";

const Post = ({ post, setCurrentId }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const user = JSON.parse(localStorage.getItem("profile"));

  const remove = () => {
    setTimeout(() => dispatch(deletePost(post._id)), 30000);
  };

  const openPost = (e) => {
    history.push(`/posts/${post._id}`);
  };

  return (
    <Card className={classes.card} raised elevation={6}>
      <ButtonBase
        component="span"
        name="test"
        className={classes.cardAction}
        onClick={openPost}
      >
        <CardMedia
          className={classes.media}
          image={
            post.selectedFile ||
            "https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png"
          }
        />
        <div className={classes.overlay}>
          <Typography variant="h6">{post.bookName}</Typography>
          <Typography variant="body2">
            {moment(post.createdAt).fromNow()}
          </Typography>
        </div>
        <div className={classes.details}>
          <Typography variant="body2" color="secondary">
            {post.subject.map((subject) => `#${subject} `)}
          </Typography>
        </div>
        <Typography className={classes.title} variant="h5" gutterBottom>
          Contact Details: {post.contact}
        </Typography>
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            Price Rs.{post.price}
            <br />
            {post.buyCount === 0 ? "" : "Book might be sold"}
          </Typography>
        </CardContent>
      </ButtonBase>
      {user?.result?.googleId === post?.creator ||
      user?.result?._id === post?.creator ? (
        <CardActions className={classes.cardActions}>
          <Button
            size="small"
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentId(post._id);
            }}
          >
            <EditIcon fontSize="small" />
            Edit
          </Button>
          <Button
            size="small"
            color="secondary"
            onClick={() => dispatch(deletePost(post._id))}
          >
            <DeleteIcon fontSize="small" />
            Delete
          </Button>
        </CardActions>
      ) : (
        <CardActions className={classes.cardActions}>
          <Button
            size="small"
            color="primary"
            disabled={!user?.result || post.buyCount >= 2}
            onClick={() => dispatch(buy(post._id))}
          >
            <SmileIcon fontSize="small" />
            {post.buyCount < 2 ? `Want to buy!` : `No More Book Available`}
            {post.buyCount >= 2 && remove()}
          </Button>
          <Button
            size="small"
            color="primary"
            disabled={!user?.result || post.rejectCount >= 2}
            onClick={() => dispatch(reject(post._id))}
          >
            <SadIcon fontSize="small" />
            {post.rejectCount < 2
              ? `Over-Priced (Remark: ${post.rejectCount})`
              : `Book Post under Action`}
            {post.rejectCount >= 2 && remove()}
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export default Post;
