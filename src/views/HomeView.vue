<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'
import { authStore } from '@/stores/auth'

    const getRegions = async () => {
      const response = await axios.get('http://localhost:3000/get-regions', {
        headers: {
          'Authorization': authStore().getAuthToken()
        }
      })

      if (response) {
        regions.value = response.data.regions
        regionsReady.value = true
      } else {
        return [];
      }
    }

    const getUser = async () => {
      const response = await axios.post('http://localhost:3000/get-user', {
        userName: userName.value
      })

      if (response) {
        auth.setAuthToken(response.data.token)
        await getRegions()
      } else {
        return [];
      }
    }

    let regions = ref([]);
    const options = ["Dificil", "Medio", "Facil"];
    const gameRegion = ref("");
    const gameMode = ref("");
    const userName = defineModel();
    const router = useRouter()
    const store = useGameStore();
    const auth = authStore();
    const regionsReady = ref(false);

    const setRegion = async (choice) => {
      gameRegion.value = choice;
    }

    const setMode = async (choice) => {
      gameMode.value = choice;
    }

    const startGame = () => {
      store.setUserName(userName.value);
      store.setUserGameRegion(gameRegion.value);
      store.setUserGameMode(gameMode.value);

    router.push({
      name: 'game'
    });
  }

  onMounted(() => {
    useGameStore().loadScores();
  })

</script>

<template>
  <img src="https://upload.wikimedia.org/wikipedia/commons/9/98/International_Pok%C3%A9mon_logo.svg" alt="Pokémon" class="logo" style="width: 600px; height: auto;">

  <h2>¿Eres el mejor maestro pokemon del mundo?</h2>
  <h3 >Encuentra todos los pokemons ocultos y demuestralo!!</h3>

  <h1>Instrucciones:</h1>

  <p>Para mostrar al pokemon detrás del Ditto da click en el pokemon deseado, después elige otra opción para encontrar el par</p>
  <p>Una vez que hayas encontrado todos los pares, el juego te mostrará tu puntaje</p>
  <p>Nombre usuario: <input v-model="userName" type="text"></p>

  <button
    v-show="userName !== ''"
    @click="getUser"
  >Registro/Ingreso</button>

  <div v-if="regionsReady" >
    <h2>Región</h2>
    <button v-for="region in regions" v-on:click="setRegion(region)" :class="{ selected: gameRegion === region }">
      {{ region }}
    </button>
  </div>

  <div v-show="userName !== '' && gameRegion !== ''">
    <h2>Dificultad</h2>
    <button v-for="option in options" v-on:click="setMode(option)" :class="{ selected: gameMode === option }">
      {{ option }}
    </button>
  </div>

  <button
    v-if="userName !== '' && gameRegion !== '' && gameMode !== ''"
    @click="startGame"
  >
    Start Game
  </button>

</template>

<style scoped>
.selected {
  background-color: red;
  color: white;
}
</style>