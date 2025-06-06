<template>
  <div class="card" @click="eventoClick" :data-pokemon="pokemonName">
    <img 
      :src="volteada ? imagenUrl : dittoUrl" 
      alt="pokemon" 
    />
  </div>
</template>

<script setup>
defineProps({
  imagenUrl: String,
  volteada: Boolean,
  dittoUrl: String,
  pokemonName: String 
})

const emit = defineEmits(['click'])

const eventoClick = () => {
  emit('click')
}
</script>

<style scoped>
.card {
  width: 100px;
  height: 100px;
  border-radius: 12px;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 2px solid #eee;
}

.card:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.card:active {
  transform: scale(0.95);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.card img {
  width: 80%;
  height: 80%;
  object-fit: contain;
}
</style>