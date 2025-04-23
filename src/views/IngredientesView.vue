<template>
  <ion-page>

      <ion-header>
        <ion-toolbar color="secondary" class="!pt-6">
            <ion-title class="text-white ion-text-uppercase text-xl"> Ingredientes</ion-title>
        </ion-toolbar>
      </ion-header>
      <!-- =================== Contenido ===================  -->
      <ion-content>

        <ion-grid style="background: #075985">
          <ion-row>
            <ion-button expand="full" shape="round" fill="solid"  @click="agregarNuevo" class="ion-margin-bottom ion w-full text-white mt-4">
              <ion-icon  :ios="cubeOutline" :md="cubeOutline" class="mr-2"></ion-icon> Agregar Ingrediente
            </ion-button>
          </ion-row>

          <ion-row>
            <ion-list v-for="item in ingredientes" :key="item.id" style="background: #075985">
              <ion-card>
                <img alt="Silhouette of mountains" src="https://ionicframework.com/docs/img/demos/card-media.png" />
                <ion-card-header>
                  <ion-card-title class="ion-text-center">
                    <span class="text-sm text-gray-400">{{ item.tipo }} | {{ item.rareza }}</span>
                  </ion-card-title>
                  <ion-card-subtitle class="ion-text-center">
                    <span class="text-base font-semibold text-sky-600">{{ item.nombre }}</span>
                  </ion-card-subtitle>
                </ion-card-header>

                <ion-card-content>
                  Lorem ipsum dolor sit.
                </ion-card-content>

                <ion-row class="bg-slate-300 ion-text-center w-full ion-no-padding">
                  <ion-grid>
                    <ion-row>
                      <ion-col>
                        <ion-button fill="clear" size="small" color="primary" @click="editarIngrediente(item)">
                          <ion-icon :ios="createOutline" :md="createOutline"></ion-icon>
                        </ion-button>
                      </ion-col>

                      <ion-col>
                        <ion-button fill="clear" size="small" color="danger" @click="eliminarIngrediente(item.id)">
                          <ion-icon :ios="trashOutline" :md="trashOutline"></ion-icon>
                        </ion-button>
                      </ion-col>
                    </ion-row>
                  </ion-grid>
                </ion-row>
              </ion-card>
            </ion-list>
          </ion-row>

        </ion-grid>

      </ion-content>

      <!-- ================= Modal =================  -->
      <ion-modal :is-open="showModal" @willDismiss="CerrarModal" :initial-breakpoint="0.75" :breakpoints="[0, 0.5, 0.75]" :backdrop-dismiss="true">
        
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

        <ion-content class="ion-padding" style="margin-bottom: 5px;">
          <ion-item class="mb-4">
            <ion-input v-model="form.nombre" label="Nombre" label-placement="floating" fill="outline" placeholder="Ej: Mandrágora" class="rounded-lg"></ion-input>
          </ion-item>

          <ion-item class="mb-4">
            <ion-input v-model="form.tipo" label="Tipo" label-placement="floating" fill="outline" placeholder="Ej: Raíz, Hoja, Cristal..." class="rounded-lg"></ion-input>
          </ion-item>

          <ion-item class="mb-6">
            <ion-select v-model="form.rareza" label="Rareza" label-placement="floating" fill="outline" class="rounded-lg w-full">
              <ion-select-option value="común">Común</ion-select-option>
              <ion-select-option value="rara">Rara</ion-select-option>
              <ion-select-option value="legendaria">Legendaria</ion-select-option>
            </ion-select>
          </ion-item>

          <ion-button expand="block" class="ion-margin-top rounded-lg" @click="GuardarIngrediente" color="primary">
            Guardar Ingrediente
          </ion-button>
        </ion-content>
      </ion-modal>

  </ion-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { cubeOutline, createOutline, trashOutline, } from 'ionicons/icons';
import {
  GetIngredientes,
  AddIngredientes,
  updateIngrediente,
  deleteIngrediente
} from '../database/Services/IngredientesService';

import {
  IonPage,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonHeader,
  IonButton,
  IonItem,
  IonList,
  IonContent,
  IonModal,
  IonSelect,
  IonInput,
  IonButtons,
  IonSelectOption,
  IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,
  IonGrid, IonRow, IonCol,
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
  ingredientes.value = await GetIngredientes();
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