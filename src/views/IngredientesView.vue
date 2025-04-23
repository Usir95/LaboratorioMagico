<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>🧂 Ingredientes</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">


      <ion-button expand="block" @click="agregarNuevo">
        Agregar Ingrediente
      </ion-button>

      <ion-list v-if="ingredientes.length">
        <ion-item v-for="item in ingredientes" :key="item.id">
          <ion-label>
            <h2>{{ item.nombre }}</h2>
            <p>{{ item.tipo }} | {{ item.rareza }}</p>
          </ion-label>
        </ion-item>
      </ion-list>

      <p v-else class="ion-text-center">Aún no hay ingredientes</p>

    </ion-content>

    <ion-modal :is-open="showModal" @didDismiss="cerrarModal">
      <ion-header>
        <ion-toolbar>
          <ion-title>Nuevo Ingrediente</ion-title>
          <template #end>
            <ion-buttons>
              <ion-button @click="cerrarModal">Cerrar</ion-button>
            </ion-buttons>
          </template>
        </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding">
        <ion-item>
          <ion-input v-model="form.nombre" label="Nombre" label-placement="floating" fill="outline" placeholder="Ej: Mandrágora"></ion-input>
        </ion-item>

        <ion-item>
          <ion-input v-model="form.tipo" label="Tipo" label-placement="floating" fill="outline" placeholder="Ej: Raíz, Hoja, Cristal..."></ion-input>
        </ion-item>

        <ion-item>
          <ion-select v-model="form.rareza" label="Rareza" label-placement="floating" fill="outline">
            <ion-select-option value="común">Común</ion-select-option>
            <ion-select-option value="rara">Rara</ion-select-option>
            <ion-select-option value="legendaria">Legendaria</ion-select-option>
          </ion-select>
        </ion-item>

        <ion-button expand="block" class="ion-margin-top" @click="GuardarIngrediente">
          Guardar Ingrediente
        </ion-button>
      </ion-content>
    </ion-modal>
  </ion-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getIngredientes, AddIngredientes } from '../database/Services/IngredientesService';
import { IonPage, IonTitle, IonToolbar, IonHeader, IonButton, IonLabel, IonItem, IonList, IonContent, IonModal, IonSelect, IonInput, IonButtons, IonSelectOption } from '@ionic/vue';

const ingredientes = ref([])


const cargarIngredientes = async () => {
  ingredientes.value = await getIngredientes()
}


const showModal = ref(false);

const form = ref({
  nombre: '',
  tipo: '',
  rareza: ''
})


const abrirModal = () => {
  showModal.value = true
}


const cerrarModal = () => {
  showModal.value = false
  form.value = {
    nombre: '',
    tipo: '',
    rareza: ''
  }
}


const GuardarIngrediente = async () => {
  if (!form.value.nombre || !form.value.tipo || !form.value.rareza) {
    alert('Todos los campos son obligatorios')
    return
  }

  await AddIngredientes(form.value)
  showModal.value = false;
  form.value.reset();
  await cargarIngredientes();
}


const agregarNuevo = () => {
  abrirModal()
}

onMounted(() => {
  cargarIngredientes()
})
</script>
