<template>
  <div class="memorama">
    <h1>Memorama Pokemon</h1>

    <div>
      <p><strong>Jugador:</strong> {{ store.getUserName }}</p>
      <p><strong>Región:</strong> {{ store.getUserGameRegion }}</p>
      <p><strong>Dificultad:</strong> {{ store.getUserGameMode }}</p>
      <p><strong>Fallos:</strong> {{ store.getFails }}</p>
      <p><strong>Intentos:</strong> {{ store.getAttempts }}</p>
    </div>

    <br />

    <div v-if="isLoading">
      <p>Cargando pokemones...</p>
    </div>

    <div v-else class="grid">
      <div 
        class="card" 
        v-for="(card) in cartas" 
        :key="card.id"
        @click="voltearCarta(card)"
      >
        <img 
          :src="card.volteada ? card.imagenUrl : dittoUrl" 
          alt="pokemon" 
        />
      </div>
    </div>
  </div>
</template>




<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'

const store = useGameStore();
const router = useRouter()
const dificultad = store.getUserGameMode
const region =  store.getUserGameRegion

const isLoading = ref(false)

const cantidadCartas = {
  Dificil: 30,
  Medio: 20,
  Facil: 10
}[dificultad] || 10

const regiones = {
  Kanto: 'kanto',
  Johto: 'original-johto',
  Hoenn: 'hoenn',
  Sinnoh: 'original-sinnoh',
  Unova: 'unova',
  Kalos: 'kalos-central',
  Alola: 'original-alola',
  Galar: 'galar'
}

const dittoUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png'

const cartas = ref([])
const cartasVolteadas = ref([])
const bloqueado = ref(true)

const obtenerPokemones = async () => {
  isLoading.value = true
  bloqueado.value = true
  cartas.value = []
  try {
    // Obtener los pokemones de la región seleccionada
    const regionName = regiones[region]
    const regionResponse = await axios.get(`https://pokeapi.co/api/v2/pokedex/${regionName}`)

    // No mostrar a Ditto en el juego
    const resultados = regionResponse.data.pokemon_entries
      .map(e => ({
        name: e.pokemon_species.name,
        url: `https://pokeapi.co/api/v2/pokemon/${e.pokemon_species.name}`
      }))
      .filter(p => p.name !== 'ditto')

    const seleccionados = []

    // Seleccionar los pokemones aleatorios
    while (seleccionados.length < cantidadCartas / 2) {
      const random = Math.floor(Math.random() * resultados.length)
      const nombre = resultados[random].name

      if (!seleccionados.find(p => p.nombre === nombre)) {
        const pokemonData = await axios.get(resultados[random].url)
        seleccionados.push({
          id: crypto.randomUUID(),
          nombre,
          imagenUrl: pokemonData.data.sprites.front_default,
          volteada: true
        })
      }
    }

    // Duplicar los pokemones seleccionados para el memorama
    const duplicadas = [...seleccionados, ...seleccionados].map(c => ({
      ...c,
      id: crypto.randomUUID()
    }))

    cartas.value = duplicadas.sort(() => Math.random() - 0.5)

    isLoading.value = false

    // Mostrar las cartas por 3 segundos antes de que el jugador pueda jugar
    setTimeout(() => {
      cartas.value.forEach(c => c.volteada = false)
      bloqueado.value = false
    }, 3000)

  } catch (error) {
    console.error('Error al cargar pokemones:', error)
    isLoading.value = false
  }
}


// Voltear las cartas
const voltearCarta = (carta) => {
  // Valor de bloqueado para que el jugador no pueda voltear más de 2 cartas
  if (bloqueado.value || carta.volteada) return

  carta.volteada = true
  cartasVolteadas.value.push(carta)

  if (cartasVolteadas.value.length === 2) {
    bloqueado.value = true
    store.incrementAttempts()

    const [primera, segunda] = cartasVolteadas.value

    if (primera.nombre === segunda.nombre) {
      cartasVolteadas.value = []
      bloqueado.value = false
      checkGameFinished()
    } else {
      store.incrementFails()
      setTimeout(() => {
        cartasVolteadas.value.forEach(c => c.volteada = false)
        cartasVolteadas.value = []
        bloqueado.value = false
        checkGameFinished()
      }, 1000)
    }
  }
}

const checkGameFinished = () => {
  const todasVolteadas = cartas.value.every(c => c.volteada)
  if (todasVolteadas) {
    store.saveScore()
    router.push({ name: 'score' })
  }
}

onMounted(obtenerPokemones)
</script>



<style scoped>
.memorama {
  text-align: center;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 15px;
  max-width: 800px;
  margin: auto;
}

.card img {
  width: 100px;
  height: 100px;
  object-fit: contain;
  border: 2px solid #ccc;
  border-radius: 10px;
  background: white;
}
</style>