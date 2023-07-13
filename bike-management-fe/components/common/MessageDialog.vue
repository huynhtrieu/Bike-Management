<template>
  <v-dialog width="500" v-if="dialog.isShow">
    <v-card>
      <v-toolbar color="primary">
        <v-toolbar-title>{{ dialog.title || "Message" }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="dialog.isShow = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>{{ dialog.message || "" }}</v-card-text>
      <v-card-actions class="justify-end"
        ><v-btn @click="dialog.isShow = false">OK</v-btn></v-card-actions
      >
    </v-card>
  </v-dialog>
</template>

<script setup>
const dialog = reactive({
  isShow: false,
  message: "",
  title: "Message",
});
</script>
