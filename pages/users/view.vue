<template>
  <title>View Profile</title>
  <h1 class="middleTitle">User List / {{ userData.userName }}</h1>
  <div class="buttonContainer">
    <el-button type="danger" class="newButton" round @click="deleteForm = true"
      >Delete</el-button
    >
    <el-button
      v-if="!isEditing"
      type="primary"
      class="newButton"
      round
      @click="toggleEdit"
      >Edit</el-button
    >
    <el-button
      v-else
      type="primary"
      class="newButton"
      round
      @click="saveChanges"
      >Save</el-button
    >
  </div>
  <div class="container">
    <h2 style="margin-left: 30px">
      <u> User Details </u>
    </h2>
    <el-form
      :model="userData"
      label-position="left"
      label-width="auto"
      style="max-width: auto; margin: 30px"
    >
      <el-form-item label="User ID">
        <el-input v-model="userData.userID" disabled />
      </el-form-item>
      <el-form-item label="Username">
        <el-input v-model="userData.userName" :disabled="!isEditing" />
      </el-form-item>
      <el-form-item label="Password">
        <el-input
          v-model="userData.password"
          :type="passwordVisible ? 'text' : 'password'"
          :disabled="!isEditing"
          @mousedown="togglePasswordVisibility(true)"
          @mouseup="togglePasswordVisibility(false)"
          @mouseleave="togglePasswordVisibility(false)"
        />
      </el-form-item>
      <el-form-item label="Full Name">
        <el-input v-model="userData.name" :disabled="!isEditing" />
      </el-form-item>
      <el-form-item label="Email Address">
        <el-input v-model="userData.email" :disabled="!isEditing" />
      </el-form-item>
      <el-form-item label="Faculty">
        <el-select
          v-model="userData.faculty"
          :disabled="!isEditing"
          placeholder=" "
        >
          <el-option label="Faculty of Computing" value=" " />
          <el-option
            label="Faculty of Chemical and Process Engineering Technology"
            value=" "
          />
        </el-select>
      </el-form-item>
    </el-form>
  </div>

  <el-dialog v-model="deleteForm" width="500" align-center center>
    <el-form class="center-dialog">
      <span>Are you sure you want to delete this <b>user</b>?</span>
      <br />
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteForm = false">Cancel</el-button>
        <el-button type="danger" @click="">Delete</el-button>
      </span>
    </el-form>
  </el-dialog>
</template>

<style scoped>
@import url("../../assets/css/browse.css");
@import url("../../node_modules/boxicons/css/boxicons.min.css");

.center-dialog {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>

<script setup lang="ts">
const userData = ref({
  userID: "1",
  userName: "Abuleee133",
  password: "potato123",
  name: "Abu Lee",
  email: "abuhimself@gmail.com",
  userRole: "Staff",
  faculty: "Faculty of Computing",
});

const isEditing = ref(false);
const deleteForm = ref(false);
const passwordVisible = ref(false);

const toggleEdit = () => {
  isEditing.value = !isEditing.value;
};

const saveChanges = () => {
  isEditing.value = false;
  // Implement your save logic here
};

const togglePasswordVisibility = (visible: boolean) => {
  passwordVisible.value = visible;
};

definePageMeta({
  layout: "navbar",
});
</script>
