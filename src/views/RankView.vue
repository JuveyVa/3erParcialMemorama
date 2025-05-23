<script setup>
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'
import { ref, computed } from 'vue'

const store = useGameStore()
const router = useRouter()
const modoSeleccionado = ref('Todos')

const volver = () => {
  router.push({ name: 'score' })
}

const topScores = computed(() => {
  let scores = store.getAllScores

  if (modoSeleccionado.value !== 'Todos') {
    scores = scores.filter(score => score.mode === modoSeleccionado.value)
  }

  return scores.slice(0, 10)
})

const playerIndex = computed(() => {
  return store.getAllScores.findIndex(score =>
    score.name === store.getLastScore.name &&
    score.attempts === store.getLastScore.attempts &&
    score.mode === store.getLastScore.mode &&
    score.region === store.getLastScore.region
  )
})

const estaFueraDelTop = computed(() => playerIndex.value >= 10)
</script>

<template>
  <div class="tabla-container">
    <h1 class="titulo">Tabla de Posiciones</h1>

    <div class="filtro-modo">
      <label for="modo">Filtrar por dificultad:</label>
      <select id="modo" v-model="modoSeleccionado">
        <option value="Todos">Todos</option>
        <option value="Facil">Fácil</option>
        <option value="Medio">Medio</option>
        <option value="Dificil">Difícil</option>
      </select>
    </div>

    <table class="tabla">
      <thead>
        <tr>
          <th>#</th>
          <th>Nombre</th>
          <th>Intentos</th>
          <th>Modo</th>
          <th>Región</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(score, index) in topScores" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ score.name }}</td>
          <td>{{ score.attempts }}</td>
          <td>{{ score.mode }}</td>
          <td>{{ score.region }}</td>
        </tr>
      </tbody>
    </table>

    <div v-if="estaFueraDelTop" class="tu-posicion">
      <h2>🎯 Tu Posición</h2>
      <p><strong>#{{ playerIndex + 1 }}</strong></p>
      <p><strong>Nombre:</strong> {{ store.getLastScore.name }}</p>
      <p><strong>Intentos:</strong> {{ store.getLastScore.attempts }}</p>
      <p><strong>Modo:</strong> {{ store.getLastScore.mode }}</p>
      <p><strong>Región:</strong> {{ store.getLastScore.region }}</p>
    </div>

    <button class="boton" @click="volver">Volver</button>
  </div>
</template>

<style scoped>
.tabla-container {
  max-width: 800px;
  margin: 60px auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  font-family: 'Segoe UI', sans-serif;
  text-align: center;
}

.titulo {
  font-size: 2rem;
  margin-bottom: 20px;
  color: #3f51b5;
}

.filtro-modo {
  margin-bottom: 20px;
}

.filtro-modo label {
  margin-right: 10px;
  font-weight: bold;
}

.filtro-modo select {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.tabla {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 30px;
}

th, td {
  padding: 12px;
  border-bottom: 1px solid #ccc;
}

th {
  background-color: #e0e0e0;
  font-weight: bold;
}

td {
  color: #333;
}

.boton {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 12px 25px;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.boton:hover {
  background-color: #388E3C;
}

.tu-posicion {
  margin-top: 40px;
  padding: 20px;
  border: 2px dashed #2196F3;
  background-color: #e3f2fd;
  border-radius: 12px;
}

.tu-posicion h2 {
  color: #1976D2;
  margin-bottom: 10px;
}

.tu-posicion p {
  margin: 5px 0;
  color: #333;
}
</style>
