export function addRepository(repository) {
  return {
    type: "ADD_REPOSITORY",
    payload: {
      repository
    }
  }
}

export function activateRepository(repository) {
  return {
    type: "ACTIVATE_REPOSITORY",
    payload: {
      repository
    }
  }
}

export function deactivateRepository(repository) {
  return {
    type: "DEACTIVATE_REPOSITORY",
    payload: {
      repository
    }
  }
}

export function removeRepository(repository) {
  return {
    type: "REMOVE_REPOSITORY",
    payload: {
      repository
    }
  }
}