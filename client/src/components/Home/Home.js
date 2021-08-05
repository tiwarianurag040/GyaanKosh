import React, { useState, useEffect } from "react";
import {
  Container,
  Grow,
  Grid,
  AppBar,
  Button,
  TextField,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import ChipInput from "material-ui-chip-input";

import { getPostsBySearch, getPosts } from "../../actions/posts";
import Pagination from "../Pagination";
import Posts from "../Posts/Posts";
import Form from "../Form/Form";

import useStyles from "./styles.js";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Home = () => {
  const classes = useStyles();
  const query = useQuery();
  const page = query.get("page") || 1;
  const searchQuery = query.get("searchQuery");

  const [currentId, setCurrentId] = useState(0);
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState([]);
  const history = useHistory();

  useEffect(() => {
    dispatch(getPosts());
  }, [currentId, dispatch]);

  const searchPost = () => {
    if (search.trim() || subject) {
      dispatch(getPostsBySearch({ search, subject: subject.join(",") }));
      history.push(
        `/posts/search?searchQuery=${search || "none"}&subject=${subject.join(
          ","
        )}`
      );
    } else {
      history.push("/");
    }
  };

  const handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      searchPost();
    }
  };

  const handleAddChip = (tag) => setSubject([...subject, tag]);

  const handleDeleteChip = (chipToDelete) =>
    setSubject(subject.filter((tag) => tag !== chipToDelete));

  return (
    <Grow in>
      <Container maxWidth="xl">
        <AppBar
          className={classes.appBarSearch}
          position="static"
          color="inherit"
        >
          <TextField
            onKeyDown={handleKeyPress}
            name="search"
            variant="outlined"
            label="Search Books"
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <ChipInput
            style={{ margin: "10px 0" }}
            value={subject}
            onAdd={(chip) => handleAddChip(chip)}
            onDelete={(chip) => handleDeleteChip(chip)}
            label="Search By Subject name"
            variant="outlined"
          />
          <Button
            onClick={searchPost}
            className={classes.searchButton}
            variant="contained"
            color="primary"
          >
            <SearchIcon />
            Search
          </Button>
        </AppBar>

        <Grid
          container
          justify="space-between"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item>
            <Form currentId={currentId} setCurrentId={setCurrentId} />
          </Grid>
          <Grid item>
            <Posts setCurrentId={setCurrentId} />
          </Grid>
        </Grid>
        <br />
        <br />
        {!searchQuery && !subject.length && (
          <Pagination
            variant="outlined"
            shape="rounded"
            size="large"
            page={page}
          />
        )}
        <br />
        <br />
      </Container>
    </Grow>
  );
};

export default Home;
