<template>
  <!-- Delete modal -->
  <v-dialog width="600" v-model="updateModal.isShowDeleteUserModal">
    <v-toolbar height="40" color="primary">
      <v-toolbar-title><i>Delete user</i></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon dark @click="updateModal.isShowDeleteUserModal = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card>
      <v-card-title
        >Do you want to delete
        <b
          ><i>{{ updateModal.updateUser.name }} </i></b
        ></v-card-title
      >
      <p class="mx-4">
        <b
          ><i
            >Email:&nbsp;

            <u>{{ updateModal.updateUser.email }}</u></i
          ></b
        >
      </p>

      <v-card-actions
        ><v-spacer></v-spacer
        ><v-btn size="large" @click="submitDeleteUser">YES</v-btn
        ><v-btn size="large" @click="updateModal.isShowDeleteUserModal = false"
          >NO</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!--  -->
  <!-- Update modal -->
  <v-dialog max-width="1024" v-model="updateModal.isShowUpdateModal">
    <v-toolbar height="50" color="primary">
      <v-toolbar-title
        ><v-icon icon="mdi-account-search"></v-icon>USER</v-toolbar-title
      >
      <v-spacer></v-spacer>
      <v-btn icon dark @click="updateModal.isShowUpdateModal = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card>
      <v-card-item>
        <v-row>
          <v-col cols="5">
            <v-card
              class="mx-auto"
              elevation="10"
              width="350"
              height="350"
              :image="updateModal.updateUser.image || getDefaultImage()"
            >
            </v-card>
          </v-col>
          <v-col cols="7">
            <v-form ref="updateForm" disabled>
              <v-text-field
                density="compact"
                label="Email"
                append-inner-icon="mdi-pencil-off"
                v-model="updateModal.updateUser.email"
              ></v-text-field>
              <v-text-field
                density="compact"
                label="Name"
                append-inner-icon="mdi-pencil-off"
                v-model="updateModal.updateUser.name"
              ></v-text-field>
              <v-text-field
                density="compact"
                label="Date of Birth"
                append-inner-icon="mdi-pencil-off"
                v-model="updateModal.updateUser.birthDate"
              ></v-text-field>
              <v-text-field
                density="compact"
                label="Phone"
                append-inner-icon="mdi-pencil-off"
                v-model="updateModal.updateUser.phoneNumber"
              ></v-text-field>
              <v-text-field
                density="compact"
                label="Address"
                append-inner-icon="mdi-pencil-off"
                v-model="updateModal.updateUser.address"
              ></v-text-field>
              <v-btn
                color="primary"
                append-icon="mdi-delete"
                elevation="6"
                size="x-large"
                block
                @click="updateModal.isShowDeleteUserModal = true"
                class="mt-3 mb-5"
                >Delete User</v-btn
              >
            </v-form>
          </v-col>
        </v-row>
      </v-card-item>
    </v-card>
  </v-dialog>
  <!--  -->
  <div class="container">
    <!-- Toolbar -->
    <div class="d-flex align-center">
      <!-- Search -->
      <v-autocomplete
        @update:search="searchUser"
        item-value="name"
        item-title="name"
        density="comfortable"
        label="Search"
        variant="outlined"
        append-inner-icon="mdi-magnify"
        hide-details
        hide-no-data
        :custom-filter="() => {}"
        :items="search.searchedUsers"
        ><template v-slot:item="{ props, item }">
          <v-list-item
            class="mt-2"
            v-bind="props"
            :prepend-avatar="getDefaultImage()"
            :title="item.raw.name"
            :subtitle="item.raw.email"
            @click="
              updateModal.isShowUpdateModal = true;
              Object.assign(updateModal.updateUser, item.raw);
            "
          >
          </v-list-item
        ></template>
      </v-autocomplete>
      <v-spacer></v-spacer>
      <v-btn
        variant="tonal"
        size="default"
        append-icon="mdi-download"
        class="ml-5"
        @click="downloadUser"
        >Download Excel</v-btn
      >
    </div>
    <!-- User Table -->
    <v-table density="comfortable" fixed-header class="user-table">
      <thead>
        <tr>
          <th><b>NAME</b></th>
          <th><b>EMAIL</b></th>
          <th><b>PHONE</b></th>
          <th><b>ADDRESS</b></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in listUser.data" :key="index">
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.phoneNumber }}</td>
          <td>{{ user.address }}</td>
          <td class="text-center">
            <v-btn
              elevation="8"
              append-icon="mdi-eye"
              variant="tonal"
              class="mx-2"
              size="small"
              @click="
                updateModal.isShowUpdateModal = true;
                Object.assign(updateModal.updateUser, user);
              "
              >View</v-btn
            >
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
  <!-- Paginatiom -->
  <v-pagination
    v-if="!!listUser.count"
    class="mx-auto mt-5 mb-2"
    color="primary"
    show-first-last-page
    :length="Math.ceil(listUser.count / userPerPage)"
    ellipsis="...."
    total-visible="5"
    @update:model-value="changePage"
  ></v-pagination>
  <!--  -->
</template>
<script setup>
import axios from "axios";
import moment from "moment";
definePageMeta({ layout: "admin" });
const userPerPage = 10;
const listUser = reactive({
  data: [],
  count: 0,
});
const search = reactive({
  searchedUsers: [],
});
const updateModal = reactive({
  isShowDeleteUserModal: false,
  isShowUpdateModal: false,
  updateUser: {
    avatarFile: null,
  },
});
const updateForm = ref();

onMounted(() => {
  getAllUser(0);
});

// Watch
watch(
  () => updateModal.isShowUpdateModal,
  (isShow) => {
    if (!isShow) {
      updateModal.updateUser = { avatarFile: null };
    }
  }
);

// Function
const getAllUser = async (offset, limit = userPerPage) => {
  const response = await axios.get("users/all-profile", {
    params: {
      offset,
      limit,
    },
  });
  listUser.data = response.data.users;
  listUser.count = response.data.count;
};

const searchUser = useDebounce(async (keyword) => {
  if (keyword.length < 2) {
    search.searchedUsers = [];
    return;
  }
  const response = await axios.get("users/search", {
    params: {
      search: keyword,
    },
  });
  search.searchedUsers = response.data.users;
}, 300);

const changePage = (value) => {
  const offset = (value - 1) * itemPerPage;
  getAllUser(offset);
};

const submitDeleteUser = () => {
  axios.delete(`users/${updateModal.updateUser.id}`);
  updateModal.isShowDeleteUserModal = false;
  updateModal.isShowUpdateModal = false;
  getAllUser(0);
};
const downloadUser = async () => {
  const response = await axios.get("users/download", {
    responseType: "blob",
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const a = document.createElement("a");
  a.href = url;
  a.download = `USER_${moment().toISOString()}.xlsx`;
  a.click();
  window.URL.revokeObjectURL(url);
};
</script>
<style lang="scss" scoped>
.container {
  padding: 20px;
}
.user-table {
  overflow: auto;
  max-height: 100vh;
  margin-top: 20px;
  td,
  th {
    border: 1px solid rgb(229, 227, 227);
  }
}
.loading {
  position: fixed;
  width: 100%;
}
</style>
