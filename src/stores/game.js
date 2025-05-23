import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', {
  state: () => ({
    userName: "",
    region: "",
    mode: "",
    fails: 0,
    attempts: 0,
    lastScore: {
      name: "",
      attempts: 0
    },
    scores: []
  }),

  getters: {
    getUserName(state) {
      return state.userName
    },
    getUserGameRegion(state) {
      return state.region
    },
    getUserGameMode(state) {
      return state.mode
    },
    getFails(state) {
      return state.fails
    },
    getAttempts(state) {
      return state.attempts
    },
    getLastScore(state) {
      return state.lastScore
    },
    getAllScores(state) {
      return [...state.scores].sort((a, b) => a.attempts - b.attempts)
    }
  },

  actions: {
    setUserName(userName) {
      this.userName = userName;
    },
    setUserGameRegion(region) {
      this.region = region;
    },
    setUserGameMode(mode) {
      this.mode = mode;
    },
    incrementFails() {
      this.fails++;
    },
    incrementAttempts() {
      this.attempts++;
    },
    saveScore() {
      this.lastScore = {
        name: this.userName,
        attempts: this.attempts,
        mode: this.mode,
        region: this.region
      }
      this.scores.push(this.lastScore)

      localStorage.setItem('scores', JSON.stringify(this.scores))
    },

    loadScores() {
      const savedScores = localStorage.getItem('scores')
      if (savedScores) {
        this.scores = JSON.parse(savedScores)
      }
    }
  }
})
