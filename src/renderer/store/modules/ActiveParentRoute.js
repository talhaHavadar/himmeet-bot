const state = {
  activeParentRoute: 'landing-page'
}

const mutations = {
  setActiveParentRoute (state, route) {
    state.activeParentRoute = route
  }
}

const getters = {
  getActiveParentRoute: state => state.activeParentRoute
}

export default {
  state,
  mutations,
  getters
}
