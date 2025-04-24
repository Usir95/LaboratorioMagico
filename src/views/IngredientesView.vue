<template>
  <ion-page>

      <ion-header>
        <ion-toolbar color="secondary" class="!pt-6">
            <ion-title class="text-xl text-white ion-text-uppercase"> Ingredientes</ion-title>
        </ion-toolbar>
      </ion-header>
      <!-- =================== Contenido ===================  -->
      <ion-content style="background: #075985">

        <ion-grid style="background: #075985">
          <ion-row>
            <ion-button expand="full" shape="round" fill="solid"  @click="agregarNuevo" class="w-full mt-4 text-white ion-margin-bottom ion">
              <ion-icon  :ios="cubeOutline" :md="cubeOutline" class="mr-2"></ion-icon> Agregar Ingrediente
            </ion-button>
          </ion-row>

          <ion-row>
            <ion-list v-for="item in ingredientes" :key="item.id" style="background: #075985">
              <ion-card>
                <img
                  :src="imagenMap[item.id] || 'https://ionicframework.com/docs/img/demos/card-media.png'"
                  alt="Imagen del ingrediente"
                  class="object-cover w-full h-48 rounded-t-lg"
                />

                <ion-card-header class="h-24">

                  <ion-card-title class="ion-text-center">
                    <span class="text-sm text-gray-400">{{ item.tipo }} | {{ item.rareza }}</span>
                  </ion-card-title>

                  <ion-card-subtitle class="ion-text-center">
                    <span class="text-base font-semibold text-sky-600">{{ item.nombre }}</span>
                  </ion-card-subtitle>
                  
                </ion-card-header>

                <ion-card-content class="text-sm text-gray-200 ion-text-center">
                  {{ item.descripcion || 'Sin descripción' }}
                </ion-card-content>

                <ion-row class="w-full bg-slate-300 ion-text-center ion-no-padding">
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
      <ion-modal :is-open="showModal" @willDismiss="CerrarModal" :initial-breakpoint="0.90" :breakpoints="[0, 0.5, 0.75]" :backdrop-dismiss="true">
        
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
          <ion-grid id="form">

            <ion-row class="form">
              <ion-col>
                <ion-row class="mb-4">
                  <ion-input v-model="form.nombre" label="Nombre" label-placement="floating" fill="outline" placeholder="Ej: Mandrágora" class="rounded-lg"></ion-input>
                </ion-row>

                <ion-row class="mb-4">
                  <ion-input v-model="form.tipo" label="Tipo" label-placement="floating" fill="outline" placeholder="Ej: Raíz, Hoja, Cristal..." class="rounded-lg"></ion-input>
                </ion-row>

                <ion-row class="mb-6">
                  <ion-select v-model="form.rareza" label="Rareza" label-placement="floating" fill="outline" class="w-full rounded-lg">
                    <ion-select-option value="1">Común</ion-select-option>
                    <ion-select-option value="2">Rara</ion-select-option>
                    <ion-select-option value="3">Legendaria</ion-select-option>
                  </ion-select>
                </ion-row>
                
                <ion-row class="mb-6">
                  <ion-textarea
                    v-model="form.descripcion"
                    label="Descripción"
                    label-placement="floating"
                    fill="outline"
                    placeholder="Descripción"
                    class="rounded-lg"
                  />
                </ion-row>

                <ion-row class="mb-6">
                  <input type="file" accept="image/*" @change="onImageSelected" />
                </ion-row>

                <ion-row class="mb-4" v-if="preview">
                  <img :src="preview" alt="Preview" class="object-cover w-full h-32 rounded-md" />
                </ion-row>
              </ion-col>
            </ion-row>

            <ion-row>
              <ion-col>
                <ion-button expand="full" shape="round" fill="solid" size="default" class="mx-6" @click="GuardarIngrediente" color="primary">
                  <ion-icon :icon="saveOutline" class="mr-2 text-white" /> <span class="text-white">Guardar Ingrediente</span>
                </ion-button>
              </ion-col>
            </ion-row>            
          </ion-grid>
        </ion-content>    
      </ion-modal>

  </ion-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { cubeOutline, createOutline, trashOutline, saveOutline } from 'ionicons/icons';
import { Filesystem, Directory } from '@capacitor/filesystem';
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
  IonTextarea,
  IonButtons,
  IonSelectOption,
  IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,
  IonGrid, IonRow, IonCol,
} from '@ionic/vue';

/* =================== Variables =================== */
const ingredientes = ref([]);
const showModal = ref(false);
const preview = ref(null);
const imagenMap = ref({});
const form = ref({
  id: null,
  nombre: '',
  tipo: '',
  rareza: '',
  descripcion: '',
  imagen: null,
});

/* =================== Ciclo de vida =================== */
onMounted(() => {
  CargarIngredientes();
});

/* =================== Funciones =================== */
const CargarIngredientes = async () => {
  ingredientes.value = await GetIngredientes();
  await cargarImagenes();
};

const abrirModal = () => {
  showModal.value = true;
};

const CerrarModal = () => {
  preview.value = null;
  showModal.value = false;
  form.value = {
    id: null,
    nombre: '',
    tipo: '',
    rareza: '',
    descripcion: '',
    imagen: null,
  };
};

const cargarImagenes = async () => {
  const map = {};
  for (const item of ingredientes.value) {
    if (item.imagen) {
      try {
        const result = await Filesystem.readFile({
          path: item.imagen,
          directory: Directory.Data,
        });
        map[item.id] = `data:image/jpeg;base64,${result.data}`;
      } catch (e) {
        console.warn('No se pudo cargar imagen', item.imagen, e);
        map[item.id] = null;
      }
    }
  }
  imagenMap.value = map;
};

const onImageSelected = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async () => {
    const base64Data = reader.result.split(',')[1];

    const fileName = `ingrediente_${Date.now()}.jpg`;

    await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });

    form.value.imagen = fileName;
    preview.value = reader.result;
  };
  reader.readAsDataURL(file);
};

const agregarNuevo = () => {
  abrirModal();
};

const editarIngrediente = (item) => {
  form.value = { 
    id: item.id,
    nombre: item.nombre,
    tipo: item.tipo,
    rareza: item.rareza,
    descripcion: item.descripcion || '',
    imagen: item.imagen || null,
  };
  preview.value = form.value.imagen;
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

<style scoped>
.form {
  height: 60vh;
  overflow-y: auto;
}
</style>le