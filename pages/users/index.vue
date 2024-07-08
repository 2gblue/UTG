<template>
  <title>User List</title>
  <h1 class="middleTitle">User List</h1>
  <div class="buttonContainer">
    <el-button type="success" class="newButton" round @click="add = true"
      >New</el-button
    >
  </div>
  <div class="container">
    <div class="search-bar">
      <el-form :model="search" label-width="auto" style="width: 50%">
        <el-input v-model="search.userName" placeholder="Name" />
      </el-form>
      <button><i class="bx bx-search-alt-2 bx-fw"></i></button>
      <el-select
        v-model="search.userRole"
        placeholder="Role"
        style="width: 15%"
      >
        <el-option label="Staff" value="staff" />
        <el-option label="User" value="user" />
      </el-select>
      <el-select
        v-model="search.faculty"
        placeholder="Faculty"
        style="width: 30%"
      >
        <el-option label="FK" value="FK" />
        <el-option label="FTKMA" value="FTKMA" />
      </el-select>
    </div>
    <el-divider></el-divider>
    <el-table :data="userData" stripe>
      <el-table-column prop="userID" label="User ID" />
      <el-table-column prop="userName" label="Name" width="400" />
      <el-table-column prop="userRole" label="Role" />
      <el-table-column prop="faculty" label="Faculty" />
      <el-table-column label="Actions">
        <template #default="scope">
          <el-button text @click="">
            <i class="bx bx-info-circle"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pageNavigation">
      <el-pagination
        :page-size="20"
        :pager-count="6"
        layout="prev, pager, next"
        :total="500"
      />
    </div>
  </div>
  <el-dialog v-model="add" title="User Registration" center>
    <el-form :model="register" label-width="auto">
      <hr />
      <div>
        <el-form-item label="Username">
          <el-input v-model="register.username" />
        </el-form-item>
        <el-form-item label="Password">
          <el-input v-model="register.password" type="password" />
        </el-form-item>
        <el-form-item label="Full Name">
          <el-input v-model="register.name" />
        </el-form-item>
        <el-form-item label="Email Address">
          <el-input v-model="register.email" />
        </el-form-item>
        <el-form-item label="Role">
          <el-select v-model="register.role" placeholder="Select account role">
            <el-option label="Staff" value="staff" />
            <el-option label="User" value="user" />
          </el-select>
        </el-form-item>
        <el-form-item label="Faculty">
          <el-select v-model="register.faculty" placeholder="Select faculty">
            <el-option label="Faculty of Computing" value=" " />
            <el-option
              label="Faculty of Chemical and Process Engineering Technology"
              value=" "
            />
          </el-select>
        </el-form-item>
      </div>
      <hr />
      <div
        class="dialog-footer"
        style="display: flex; justify-content: flex-end"
      >
        <el-button @click="add = false" style="margin-right: 8px"
          >Cancel</el-button
        >
        <el-button type="primary">Submit</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<style scoped>
@import url("../../assets/css/browse.css");
@import url("../../node_modules/boxicons/css/boxicons.min.css");
</style>

<script setup lang="ts">
const search = ref({
  userName: "",
  userRole: "",
  faculty: "",
});

const userData = [
  {
    userID: "1",
    userName: "Abu Lee",
    userRole: "Staff",
    faculty: "Faculty of Computing",
  },
  {
    userID: "2",
    userName: "Ho Lee Sheet",
    userRole: "User",
    faculty: "Faculty of Computing",
  },
  {
    userID: "3",
    userName: "Pog",
    userRole: "Staff",
    faculty: "Faculty of Computing",
  },
  {
    userID: "4",
    userName: "Memer",
    userRole: "User",
    faculty: "Faculty of Computing",
  },
];

const add = ref(false);
const register = reactive({
  username: "",
  password: "",
  name: "",
  email: "",
  role: "",
  faculty: "",
});

definePageMeta({
  layout: "navbar",
});
</script>
