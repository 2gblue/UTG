<template>
  <title>Account Registration</title>
  <body>
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
                <el-option label="Faculty of Computing" value="" />
                <el-option
                  label="Faculty of Chemical and Process Engineering Technology"
                  value=""
                />
              </el-select>
            </el-form>
            <el-button type="primary" round @click="" style="margin-top: 20px"
              >Sign Up</el-button
            >
            <br />
            <el-divider> &nbsp; </el-divider>
          </el-main>
          <el-footer><NuxtLink to="/login">Back to Login</NuxtLink></el-footer>
        </el-container>
        <el-aside><h2>UMPSA Timetable Generator</h2></el-aside>
      </el-container>
    </div>
  </body>
</template>

<style scoped>
@import url("../assets/css/login.css");
</style>

<script setup>
const register = reactive({
  username: "",
  password: "",
  name: "",
  email: "",
  faculty: "",
});
</script>
