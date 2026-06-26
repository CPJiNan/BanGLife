<script lang="ts" setup>
import {RouterView} from 'vue-router'
import Toast from '@/ui/components/Toast.vue'
import ConfirmModal from '@/ui/components/modals/ConfirmModal.vue'
import ShopModal from '@/ui/components/modals/ShopModal.vue'
</script>

<template>
  <RouterView/>
  <Toast/>
  <ConfirmModal/>
  <ShopModal/>
</template>
