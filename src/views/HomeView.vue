<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'
import { authStore } from '@/stores/auth'

const regions = ref([])
const options = ["Fácil", "Medio", "Difícil"]
const gameRegion = ref("")
const gameMode = ref("")
const userName = defineModel()
const router = useRouter()
const store = useGameStore()
const auth = authStore()
const regionsReady = ref(false)

const getRegions = async () => {
  const response = await axios.get('http://localhost:3000/get-regions', {
    headers: {
      'Authorization': auth.getAuthToken()
    }
  })
  if (response) {
    regions.value = response.data.regions
    regionsReady.value = true
  }
}

const getUser = async () => {
  const response = await axios.post('http://localhost:3000/get-user', {
    userName: userName.value
  })

  if (response) {
    auth.setAuthToken(response.data.token)
    await getRegions()
  }
}

const setRegion = (choice) => gameRegion.value = choice
const setMode = (choice) => gameMode.value = choice

const startGame = () => {
  store.setUserName(userName.value)
  store.setUserGameRegion(gameRegion.value)
  store.setUserGameMode(gameMode.value)
  router.push({ name: 'game' })
}

onMounted(() => {
  store.loadScores()
})
</script>

<template>
  <div class="main-container">
    <header class="header">
      <img src="https://upload.wikimedia.org/wikipedia/commons/9/98/International_Pok%C3%A9mon_logo.svg" alt="Pokémon" class="logo" />
      <h2>¿Eres el mejor maestro pokemon del mundo?</h2>
      <h3>Encuentra todos los pokemons ocultos y demuestralo!!</h3>
    </header>

    <section class="card">
      <h1>Instrucciones:</h1>
      <p>Para mostrar al pokemon detrás del Ditto da click en el pokemon deseado, después elige otra opción para encontrar el par</p>
      <p>Una vez que hayas encontrado todos los pares, el juego te mostrará tu puntaje</p>
    </section>

    <section class="card">
      <h2>Nombre de Usuario</h2>
      <input v-model="userName" placeholder="Ingresa tu nombre de entrenador" class="input" />
      <button v-show="userName" @click="getUser" class="btn full">Registro/Ingreso</button>
    </section>

    <section v-if="regionsReady" class="card">
      <h2>Región</h2>
      <div class="grid">
        <button
          v-for="region in regions"
          :key="region"
          @click="setRegion(region)"
          :class="['option', { active: gameRegion === region }]"
        >
          {{ region }}
        </button>
      </div>
    </section>

    <section v-show="userName && gameRegion" class="card">
      <h2>Dificultad</h2>
      <div class="grid">
        <button
          v-for="option in options"
          :key="option"
          @click="setMode(option)"
          :class="['option', { active: gameMode === option }]"
        >
          {{ option }}
        </button>
      </div>
    </section>

    <div v-if="userName && gameRegion && gameMode" class="start-section">
      <button @click="startGame" class="btn start">¡Comenzar!</button>
    </div>
  </div>
</template>

<style scoped>
.main-container {
  max-width: 700px;
  margin: 2rem auto;
  padding: 1rem;
  font-family: 'Segoe UI', sans-serif;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.logo {
  width: 100%;
  max-width: 400px;
  display: block;
  margin: 0 auto 1rem;
}

.header {
  text-align: center;
}
.header h2 {
  font-size: 1.5rem;
  color: #333;
}
.header h3 {
  font-size: 1rem;
  color: #555;
  margin-top: 0.5rem;
}

.card {
  background: #ffffff;
  padding: 1.2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.input {
  width: 100%;
  padding: 0.8rem;
  font-size: 1rem;
  margin-top: 0.5rem;
  border: 2px solid #ddd;
  border-radius: 8px;
}
.btn {
  margin-top: 1rem;
  padding: 0.8rem;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.full {
  width: 100%;
  background-color: #1e90ff;
  color: white;
}
.start {
  width: 100%;
  background-color: #28a745;
  color: white;
  font-weight: bold;
}
.btn:hover {
  opacity: 0.9;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}
.option {
  flex: 1 1 45%;
  padding: 0.7rem;
  border: 2px solid #ddd;
  border-radius: 10px;
  background-color: #f6f6f6;
  text-align: center;
  cursor: pointer;
  transition: 0.3s;
}
.option:hover {
  background-color: #eaeaea;
}
.option.active {
  background-color: #ffcb05;
  color: #2a75bb;
  font-weight: bold;
  border-color: #ffcb05;
}

.start-section {
  text-align: center;
}
</style>
