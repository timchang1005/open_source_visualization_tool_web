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

function SearchTool({ repositories, repoColor, addRepository, removeRepository }) {
  const classes = useStyles();
  const [repository, setRepository] = useState("");

  return (
    <div>
      <TextField 
        className={classes.searchBar}
        label="repository"
        variant="outlined"
        autoFocus
        value={repository}
        onChange={(e) => setRepository(e.target.value)}
        onKeyPress={(e) => {
          if(e.key === "Enter") {
            addRepository(repository)
            setRepository("")
          }
        }}
      />
      {
        repositories.map(repo => 
          <Chip
            key={repo}
            className={classes.repoChip}
            label={repo}
            style={{background: 'white', border: `3px solid ${repoColor[repo]}`}}
            onDelete={() => removeRepository(repo)}/>
        )
      }
    </div>
  )
}

function mapStateToProps(state) {
  return {
    repositories: state.searchCondition.repositories,
    repoColor: state.repoColor
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addRepository: (repo) => dispatch(addRepository(repo)),
    removeRepository: (repo) => dispatch(removeRepository(repo))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchTool);