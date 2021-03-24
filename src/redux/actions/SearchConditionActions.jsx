export function addRepository(repository) {
  return {
    type: "ADD_REPOSITORY",
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