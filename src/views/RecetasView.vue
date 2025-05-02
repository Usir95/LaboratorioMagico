<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="tertiary" class="!pt-6">
          <ion-title class="text-xl text-white ion-text-uppercase"> 🧪 Recetas </ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content>
      <ion-grid :class="'bg-[#075985] dark:bg-[#0f172a] h-[85vh]'">
          <!-- Añadir -->
          <ion-row >
            <ion-button color="tertiary" expand="full" shape="round" fill="solid"  @click="Agregar()" class="w-full mt-4 dark:text-white ion-margin-bottom ion">
              <span class="dark:text-white"><ion-icon  :ios="flaskOutline" :md="flaskOutline" class="mr-2"></ion-icon> Agregar Recetas</span>
            </ion-button>
          </ion-row>

          <ion-row class="flex flex-col items-center justify-center mx-4 space-y-6">
            <ion-col class="w-full text-sm font-bold text-center text-white">
              Total: {{ Total }} Receta{{ Total == 1 ? '' : 's' }}
            </ion-col>

            <ion-col>
              <ion-input
                v-model="Busqueda"
                fill="outline"
                placeholder="Buscar ingrediente..."
                class="py-1 border-2 rounded-xl border-sky-600"
              ></ion-input>
            </ion-col>

            <ion-row class="justify-center w-full">
              <Swiper
                class="w-full mt-10"
                effect="coverflow"
                :modules="[EffectCoverflow, Pagination]"
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
              >
                <SwiperSlide v-for="item in RecetasFiltrados" 
                  :key="item.id"
                  :class="['transition duration-700 ease-in-out']"
                >


                  <ion-card class="bg-white dark:bg-slate-700">
                    <ion-card-header class="text-center">
                      <ion-card-title class="text-lg font-bold text-sky-600">
                        {{ item.nombre }}
                      </ion-card-title>
                    </ion-card-header>

                    <ion-card-content class="text-center text-gray-700 dark:text-gray-300">
                      <div class="mb-2 font-semibold">Ingredientes:</div>
                      <ul class="space-y-1 text-sm">
                        <li v-for="ing in item.ingredientes" :key="ing.id">
                          🧪 {{ ing.nombre }} <span class="text-xs text-gray-500">(x{{ ing.cantidad }})</span>
                        </li>
                      </ul>
                    </ion-card-content>


                    <ion-row class="w-full ion-text-center ion-no-padding bg-slate-200">
                      <ion-grid>
                        <ion-row>
                          <ion-col>
                            <ion-button fill="clear" size="small" color="primary" @click="Editar(item)">
                              <ion-icon :icon="createOutline"></ion-icon>
                            </ion-button>
                          </ion-col>
                          <ion-col>
                            <ion-button fill="clear" size="small" color="danger"  @click="Eliminar(item.id)">
                              <ion-icon :icon="trashOutline"></ion-icon>
                            </ion-button>
                          </ion-col>
                        </ion-row>
                      </ion-grid>
                    </ion-row>

                  </ion-card>
                </SwiperSlide>
              </Swiper>
            </ion-row>

          </ion-row>
      </ion-grid>
    </ion-content>

    <ion-modal :is-open="showModal" @willDismiss="CerrarModal" :initial-breakpoint="0.90" :breakpoints="[0, 0.5, 0.75]" :backdrop-dismiss="true">
      
      <ion-header>
        <ion-toolbar>
          <ion-title>Nueva Receta</ion-title>
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
                <ion-input v-model="form.nombre" label="Nombre de la receta" label-placement="floating" fill="outline" class="rounded-lg"></ion-input>
              </ion-row>

              <ion-row class="mb-4">
                
                <div v-for="(ingrediente, index) in form.ingredientes" :key="index">
                  <ion-row>

                    <ion-col>
                      <ion-select v-model="form.ingredientes[index].ingrediente" label="Ingrediente" label-placement="floating" fill="outline" class="w-full rounded-lg">
                        <ion-select-option v-for="item in ListaIngredientes" :key="item.id" :value="item.id">{{ item.nombre }}</ion-select-option>
                      </ion-select>
                    </ion-col>

                    <ion-col>
                      <ion-input v-model="form.ingredientes[index].cantidad" type="number" label="Cantidad" label-placement="floating" fill="outline" class="rounded-lg"></ion-input>
                    </ion-col>

                    <ion-col size="auto" class="ion-align-self-center">
                      <ion-button fill="clear" @click="QuitarIngrediente(index)" color="danger">
                        <ion-icon :icon="trashOutline"></ion-icon>
                      </ion-button>
                    </ion-col>

                  </ion-row>
                </div>

                <div class="w-full ">
                  <ion-row>
                    <ion-col>
                      <ion-button expand="block" @click="AgregarIngrediente()" size="small" fill="outline" color="success">
                        Agregar Ingrediente
                      </ion-button>
                    </ion-col>
                  </ion-row>
                </div>
              </ion-row>
              
            </ion-col>
          </ion-row>

          <ion-row>
            <ion-col>
              <ion-button expand="full" shape="round" fill="solid" size="default" class="mx-6" @click="Guardar()" color="primary">
                <ion-icon :icon="saveOutline" class="mr-2 text-white" /> <span class="text-white">Guardar Receta</span>
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
import { flaskOutline, saveOutline, createOutline, trashOutline } from 'ionicons/icons';
import {
  IonPage,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonHeader,
  IonButton,
  IonContent,
  IonModal,
  IonInput,
  IonSelect, IonSelectOption,
  IonButtons,
  IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonGrid, IonRow, IonCol,
} from '@ionic/vue';

import {
  ObtenerRecetas,
  InsertarRecetas,
  ActualizarRecetas,
  EliminarReceta,
} from '../database/Services/RecetaService';

import {
  ObtenerIngredientes,
} from '../database/Services/IngredientesService';


import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import { EffectCoverflow, Pagination } from 'swiper/modules';


/* =================== Variables =================== */
const Recetas = ref([]);
const ListaIngredientes = ref([]);
const showModal = ref(false);
const Busqueda = ref('');

const form = ref({
  id: null,
  nombre: '',
  ingredientes: [{
    ingrediente: null,
    cantidad: 1
  }]
});

/* =================== Mounted =================== */
onMounted(() => {
  CargarRecetas();
  CargarIngredientes();
});

/* =================== Funciones =================== */
const CargarRecetas = async () => {
  Recetas.value = await ObtenerRecetas();
};

const CargarIngredientes = async () => {
  ListaIngredientes.value = await ObtenerIngredientes();
};

const Agregar = () => {
  AbrirModal();
};

const AbrirModal = () => {
  showModal.value = true;
};

const CerrarModal = () => {  
  showModal.value = false;
  form.value = {
    id: null,
    nombre: '',
  };
};

const Guardar = async () => {
  console.log(form.value);
  
  if (!form.value.nombre) {
    alert('Todos los campos son obligatorios');
    return;
  }

  if (form.value.id) {
    await ActualizarRecetas(form.value);
  } else {
    await InsertarRecetas(form.value);
    setTimeout(() => {
      alert('Receta guardada correctamente');
    }, 2000);
  }

  await CargarRecetas();
  CerrarModal();
};

const Editar = (item) => {
  form.value = { 
    id: item.id,
    nombre: item.nombre,
  };
  showModal.value = true;
};

const Eliminar = async (id) => {
  const confirmar = confirm('¿Estás seguro de que quieres eliminar este ingrediente?');
  if (!confirmar) return;

  await EliminarReceta(id);
  await CargarRecetas();
};

const AgregarIngrediente = () => {
  form.value.ingredientes.push({
    ingrediente: null,
    cantidad: 1
  });
};

const QuitarIngrediente = (index) => {
  form.value.ingredientes.splice(index, 1);
};

/* =================== Computed =================== */
const RecetasFiltrados = computed(() => {
  if (!Busqueda.value) return Recetas.value;

  const query = Busqueda.value.toLowerCase();
  return Recetas.value.filter(item => {
    const nombreCoincide = item.nombre.toLowerCase().includes(query);
    const ingredientesCoinciden = item.ingredientes?.some(ing =>
      ing.nombre.toLowerCase().includes(query)
    );
    return nombreCoincide || ingredientesCoinciden;
  });
});



const Total = computed(() => RecetasFiltrados.value.length);

</script>
