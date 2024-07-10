<template>
  <title>Login</title>
  <body>
    <div class="container">
      <el-container>
        <el-container>
          <el-header
            ><h2>Login to <br />Your Account</h2></el-header
          >
          <el-main>
            <el-divider />
            <el-form :model="login" label-width="auto" style="max-width: 600px">
              <el-input v-model="login.username" placeholder="Username" />
              &nbsp;
              <!-- Blank space between form fields -->
              <el-input
                v-model="login.password"
                placeholder="Password"
                type="password"
              />
            </el-form>
            <br />
            <el-button type="primary" round @click="">Login</el-button>
            <el-divider> &nbsp; </el-divider>
          </el-main>
          <el-footer
            >New to UTG?
            <NuxtLink to="/register">Create an Account</NuxtLink></el-footer
          >
        </el-container>
        <el-aside><h2>UMPSA Timetable Generator</h2></el-aside>
      </el-container>
    </div>
  </body>
</template>

<style scoped>
@import url("../assets/css/login.css");
</style>

<script setup lang="ts">
const login = ref({
  username: "",
  password: "",
});
</script>
