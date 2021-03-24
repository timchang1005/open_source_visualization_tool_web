import React, { useState } from 'react';
import { makeStyles, TextField, Chip } from "@material-ui/core";
import { connect } from 'react-redux';
import { addRepository, removeRepository } from '../../redux/actions';

const useStyles = makeStyles((theme) => ({
  searchBar: {
    width: '100%',
  },
  repoChip: {
    margin: theme.spacing(1)
  }
}))

function SearchTool({ repositories, addRepository, removeRepository }) {
  const classes = useStyles();
  const [repository, setRepository] = useState("");

  return (
    <div>
      <TextField 
        className={classes.searchBar}
        label="repository"
        variant="outlined"
        value={repository}
        onChange={(e) => setRepository(e.target.value)}
        onKeyPress={(e) => e.key==="Enter" && addRepository(repository)}
      />
      {
        repositories.map(repo => 
          <Chip className={classes.repoChip} label={repo} onDelete={() => removeRepository(repo)} key={repo}/>
        )
      }
    </div>
  )
}

function mapStateToProps(state) {
  return {
    repositories: state.searchCondition.repositories,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addRepository: (repo) => dispatch(addRepository(repo)),
    removeRepository: (repo) => dispatch(removeRepository(repo))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchTool);