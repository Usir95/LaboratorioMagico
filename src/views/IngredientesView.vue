<template>
  <ion-page>

      <ion-header>
        <ion-toolbar color="secondary" class="!pt-6">
            <ion-title class="text-xl text-white ion-text-uppercase"> Ingredientes</ion-title>
        </ion-toolbar>
      </ion-header>
      <!-- =================== Contenido ===================  -->
      <ion-content>

        <ion-grid :class="'bg-[#075985] dark:bg-[#0f172a] h-[85vh]'">
          <!-- Añadir -->
          <ion-row >
            <ion-button expand="full" shape="round" fill="solid"  @click="agregarNuevo" class="w-full mt-4 text-white ion-margin-bottom ion">
              <ion-icon  :ios="cubeOutline" :md="cubeOutline" class="mr-2"></ion-icon> Agregar Ingrediente
            </ion-button>
          </ion-row>

          <ion-row class="flex flex-col justify-center items-center space-y-6 mx-4">
  
            <!-- Total de ingredientes -->
            <ion-col class="text-center text-white font-bold text-sm w-full">
              Total: {{ totalIngredientes }} ingrediente{{ totalIngredientes === 1 ? '' : 's' }}
            </ion-col>

            <!-- Input de búsqueda -->
            <ion-col >
              <ion-input
                v-model="busqueda"
                fill="outline"
                placeholder="Buscar ingrediente..."
                class="rounded-xl border-2 border-sky-600 py-1"
              ></ion-input>
            </ion-col>

          </ion-row>

          <!-- Lista de ingredientes -->
          <div class="flex items-center justify-center mt-16">
            <Swiper
            :modules="[EffectCoverflow, Pagination]"
            effect="coverflow"
            :grabCursor="true"
            :centeredSlides="true"
            :slidesPerView="1.2"
            :loop="true"
            :coverflowEffect="{
              rotate: 30,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true
            }"

            class="w-full"
          >
              <SwiperSlide v-for="item in ingredientesFiltrados" 
                :key="item.id"
                :class="[
                  'transition duration-700 ease-in-out',
                  item.id === ultimoAgregadoId ? 'animate-pulse ring-4 ring-yellow-400' : ''
                ]"
              >

              <ion-card
                :class="[
                  'h-[26rem] flex flex-col justify-between',
                  'bg-white dark:bg-slate-800',
                  item.rareza == 1 ? 'border-4 border-green-400' : '',
                  item.rareza == 2 ? 'border-4 border-blue-400' : '',
                  item.rareza == 3 ? 'border-4 border-purple-500' : '',
                ]"
              >
                  <img
                    :src="imagenMap[item.id] || 'https://ionicframework.com/docs/img/demos/card-media.png'"
                    alt="Imagen del ingrediente"
                    class="object-cover w-full h-56 rounded-t-lg"
                  />

                  <ion-card-header class="flex flex-col items-center justify-center px-4 py-2 text-center">
                    <ion-card-title>
                      <span class="text-sm text-gray-700 dark:text-gray-300">{{ item.tipo }} | {{ item.rareza }}</span>
                    </ion-card-title>
                    <ion-card-subtitle>
                      <span class="text-base font-semibold text-sky-600 dark:text-sky-400">{{ item.nombre }}</span>
                    </ion-card-subtitle>
                  </ion-card-header>

                  <ion-card-content class="flex-1 px-4 text-sm text-center text-gray-500 dark:text-gray-300">
                    {{ item.descripcion || 'Sin descripción' }}
                  </ion-card-content>

                  <ion-row class="w-full bg-slate-300 ion-text-center ion-no-padding">
                    <ion-grid>
                      <ion-row>
                        <ion-col>
                          <ion-button fill="clear" size="small" color="primary" @click="EditarIngrediente(item)">
                            <ion-icon :icon="createOutline"></ion-icon>
                          </ion-button>
                        </ion-col>
                        <ion-col>
                          <ion-button fill="clear" size="small" color="danger" @click="eliminarIngrediente(item.id)">
                            <ion-icon :icon="trashOutline"></ion-icon>
                          </ion-button>
                        </ion-col>
                      </ion-row>
                    </ion-grid>
                  </ion-row>
                </ion-card>
                
              </SwiperSlide>
            </Swiper>
          </div>

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
import { ref, onMounted, computed  } from 'vue';
import { cubeOutline, createOutline, trashOutline, saveOutline } from 'ionicons/icons';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import { EffectCoverflow, Pagination } from 'swiper/modules';

import {
  ObtenerIngredientes,
  InsertarIngredientes,
  ActualizarIngredientes,
  EliminarIngrediente
} from '../database/Services/IngredientesService';

import {
  IonPage,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonHeader,
  IonButton,
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
const ultimoAgregadoId = ref(null);
const busqueda = ref('');

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
  ingredientes.value = await ObtenerIngredientes();
  await CargarImagenes();
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

const CargarImagenes = async () => {
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

const EditarIngrediente = (item) => {
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
    await ActualizarIngredientes(form.value);
    ultimoAgregadoId.value = form.value.id;
  } else {
    const insertedId = await InsertarIngredientes(form.value);
    ultimoAgregadoId.value = insertedId;
    setTimeout(() => {
      ultimoAgregadoId.value = null;
    }, 2000);
  }

  await CargarIngredientes();
  CerrarModal();
};

const eliminarIngrediente = async (id) => {
  const confirmar = confirm('¿Estás seguro de que quieres eliminar este ingrediente?');
  if (!confirmar) return;

  await EliminarIngrediente(id);
  await CargarIngredientes();
};

/* =================== Computed =================== */
const ingredientesFiltrados = computed(() => {
  if (!busqueda.value) return ingredientes.value;
  return ingredientes.value.filter(item =>
    item.nombre.toLowerCase().includes(busqueda.value.toLowerCase())
  );
});

const totalIngredientes = computed(() => ingredientesFiltrados.value.length);

</script>

<style scoped>
.form {
  height: 60vh;
  overflow-y: auto;
}
</style>