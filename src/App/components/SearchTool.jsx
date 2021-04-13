import React, { useState, useEffect } from 'react';
import { makeStyles, TextField, Chip } from "@material-ui/core";
import { connect } from 'react-redux';
import { addRepository, activateRepository, deactivateRepository, removeRepository } from '../../redux/actions';

const useStyles = makeStyles((theme) => ({
  searchBar: {
    width: '100%',
  },
  repoChip: {
    margin: theme.spacing(1)
  }
}))

function SearchTool({ repositories, deactivated, repoColor, addRepository, activateRepository, deactivateRepository, removeRepository, singleSelect }) {
  const classes = useStyles();
  const [repository, setRepository] = useState("");

  useEffect(() => {
    if (singleSelect) {
      const topFound = repositories.find(repo => !deactivated.includes(repo))
      if(topFound !== undefined) {
        repositories.filter(repo => repo !== topFound).forEach(repo => deactivateRepository(repo))
      }
    }
  }, [])

  const handleChipClicked = (repo) => {
    if (singleSelect) {
      if (deactivated.includes(repo)) {
        activateRepository(repo)
        repositories.filter(x => x !== repo).forEach(x => deactivateRepository(x))
      } else {
        deactivateRepository(repo)
      }
    } else {
      (deactivated.includes(repo) ? activateRepository : deactivateRepository)(repo)
    }
  }

  const handleSearch = (repo) => {
    if (singleSelect) {
      addRepository(repo)
      repositories.forEach(x => deactivateRepository(x))
    } else {
      addRepository(repo)
    }
  }

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
            handleSearch(repository)
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
            style={{
              background: deactivated.includes(repo) ? 'darkgray' : 'white',
              textDecorationLine: deactivated.includes(repo) ? "line-through" : "",
              border: `3px solid ${repoColor[repo]}`}}
            onClick={() => handleChipClicked(repo)}
            onDelete={() => removeRepository(repo)}/>
        )
      }
    </div>
  )
}

function mapStateToProps(state) {
  return {
    repositories: state.searchCondition.repositories,
    deactivated: state.searchCondition.deactivated,
    repoColor: state.repoColor
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addRepository: (repo) => dispatch(addRepository(repo)),
    activateRepository: (repo) => dispatch(activateRepository(repo)),
    deactivateRepository: (repo) => dispatch(deactivateRepository(repo)),
    removeRepository: (repo) => dispatch(removeRepository(repo))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchTool);