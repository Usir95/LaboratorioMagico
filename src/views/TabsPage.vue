<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">

        <ion-tab-button tab="ingredientes" href="/tabs/ingredientes">
          <ion-icon :icon="flaskOutline" />
          <ion-label>Ingredientes</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="recetas" href="/tabs/recetas">
          <ion-icon :icon="sparklesOutline" />
          <ion-label>Recetas</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="bestiario" href="/tabs/bestiario">
          <ion-icon :icon="pawOutline" />
          <ion-label>Bestiario</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="bitacora" href="/tabs/bitacora">
          <ion-icon :icon="bookOutline" />
          <ion-label>Bitácora</ion-label>
        </ion-tab-button>

      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { flaskOutline, sparklesOutline, pawOutline, bookOutline } from 'ionicons/icons';
</script>
