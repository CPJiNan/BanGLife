<script lang="ts" setup>
import {RouterView} from 'vue-router'
import Toast from '@/ui/components/Toast.vue'
import ConfirmModal from '@/ui/components/modals/ConfirmModal.vue'
</script>

<template>
  <RouterView/>
  <Toast/>
  <ConfirmModal/>
</template>
