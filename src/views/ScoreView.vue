<script setup>
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'

const store = useGameStore();
const router = useRouter();

const volverAlMenu = () => {
  router.push({ name: 'home' })
}

const irATablaDePosiciones = () => {
  router.push({ name: 'rank' })
}
</script>

<template>
  <div class="score-container">
    <h1 class="titulo">¡Ganaste!</h1>
    <h2 class="resultado">
      <span class="nombre">{{ store.getLastScore.name }}</span>
      lo logró en
      <span class="intentos">{{ store.getLastScore.attempts }} intentos</span>
    </h2>

    <div class="botones">
      <button class="boton" @click="volverAlMenu">Volver al Menú</button>
      <button class="boton secundario" @click="irATablaDePosiciones">Tabla de Posiciones</button>
    </div>
  </div>
</template>

<style scoped>
.score-container {
  max-width: 600px;
  margin: 100px auto;
  text-align: center;
  padding: 40px;
  background: #f9f9f9;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.titulo {
  font-size: 2.5rem;
  color: #4CAF50;
  margin-bottom: 20px;
}

.resultado {
  font-size: 1.5rem;
  margin-bottom: 40px;
  color: #333;
}

.nombre {
  font-weight: bold;
  color: #2196F3;
}

.intentos {
  font-weight: bold;
  color: #E91E63;
}

.botones {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}

.boton {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 15px 30px;
  font-size: 1rem;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 80%;
  max-width: 300px;
}

.boton:hover {
  background-color: #45a049;
}

.boton.secundario {
  background-color: #2196F3;
}

.boton.secundario:hover {
  background-color: #1976D2;
}
</style>
