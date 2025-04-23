<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary" class="ion-padding-top" style="padding-top: 3%;">
        <ion-title class="ion-padding-top"> Ingredientes</ion-title>
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
          <template #end>
            <ion-button fill="clear" size="small" color="warning" @click="editarIngrediente(item)">
              ✏️
            </ion-button>
            <ion-button fill="clear" size="small" color="danger" @click="eliminarIngrediente(item.id)">
              🗑️
            </ion-button>
          </template>
        </ion-item>
      </ion-list>

      <p v-else class="ion-text-center">Aún no hay ingredientes</p>

    </ion-content>

    <ion-modal :is-open="showModal" @willDismiss="CerrarModal">
      <ion-header>
        <ion-toolbar>
          <ion-title>Nuevo Ingrediente</ion-title>
          <!-- eslint-disable vue/no-deprecated-slot-attribute -->
          <ion-buttons slot="end">
            <ion-button @click="CerrarModal">
              Cerrar
            </ion-button>
          </ion-buttons>
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
import {
  getIngredientes,
  AddIngredientes,
  updateIngrediente,
  deleteIngrediente
} from '../database/Services/IngredientesService';

import {
  IonPage,
  IonTitle,
  IonToolbar,
  IonHeader,
  IonButton,
  IonLabel,
  IonItem,
  IonList,
  IonContent,
  IonModal,
  IonSelect,
  IonInput,
  IonButtons,
  IonSelectOption
} from '@ionic/vue';

/* =================== Variables =================== */
const ingredientes = ref([]);
const showModal = ref(false);
const form = ref({
  id: null,
  nombre: '',
  tipo: '',
  rareza: ''
});

/* =================== Ciclo de vida =================== */
onMounted(() => {
  CargarIngredientes();
});

/* =================== Funciones =================== */
const CargarIngredientes = async () => {
  ingredientes.value = await getIngredientes();
};

const abrirModal = () => {
  showModal.value = true;
};

const CerrarModal = () => {
  showModal.value = false;
  form.value = {
    id: null,
    nombre: '',
    tipo: '',
    rareza: ''
  };
};

const agregarNuevo = () => {
  abrirModal();
};

const editarIngrediente = (item) => {
  form.value = { ...item };
  showModal.value = true;
};

const GuardarIngrediente = async () => {
  if (!form.value.nombre || !form.value.tipo || !form.value.rareza) {
    alert('Todos los campos son obligatorios');
    return;
  }

  if (form.value.id) {
    await updateIngrediente(form.value);
  } else {
    await AddIngredientes(form.value);
  }

  await CargarIngredientes();
  CerrarModal();
};

const eliminarIngrediente = async (id) => {
  const confirmar = confirm('¿Estás seguro de que quieres eliminar este ingrediente?');
  if (!confirmar) return;

  await deleteIngrediente(id);
  await CargarIngredientes();
};
</script>
