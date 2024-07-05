<template>
  <title>Account Registration</title>
  <div class="container">
    <el-container>
      <el-container>
        <el-header
          ><br />
          <h2>Registration</h2></el-header
        >
        <el-main>
          <el-divider />
          <el-form
            :model="register"
            label-width="auto"
            style="max-width: 600px"
          >
            <el-input v-model="register.username" placeholder="Username" />
            &nbsp;
            <el-input
              v-model="register.password"
              placeholder="Password"
              type="password"
            />
            &nbsp;
            <el-input v-model="register.name" placeholder="Full Name" />
            &nbsp;
            <el-input v-model="register.email" placeholder="Email" />
            &nbsp;

            <el-select v-model="register.faculty" placeholder="Faculty">
              <el-option label="FK" value="fk" />
              <el-option label="FTKMA" value="ftkma" />
            </el-select>
          </el-form>
          <br />
          <el-button type="primary" round @click="">Sign Up</el-button>
          <el-divider> &nbsp; </el-divider>
        </el-main>
        <el-footer><NuxtLink to="/login">Back to Login</NuxtLink></el-footer>
      </el-container>
      <el-aside><h2>UMPSA Timetable Generator</h2></el-aside>
    </el-container>
  </div>
</template>

<style>
@import url("/assets/css/login.css");
</style>

<script setup lang="ts">
import { reactive } from "vue";

const register = reactive({
  username: "",
  password: "",
  name: "",
  email: "",
  faculty: "",
});

definePageMeta({
  layout: false,
});
</script>
