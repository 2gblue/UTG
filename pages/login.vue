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
            <el-form
              @submit.prevent="submit"
              label-width="auto"
              style="max-width: 600px"
            >
              <el-input v-model="email" placeholder="Email" />
              &nbsp;
              <!-- Blank space between form fields -->
              <el-input
                v-model="password"
                placeholder="Password"
                type="password"
              />
              <el-button
                type="primary"
                round
                native-type="submit"
                style="margin-top: 20px"
                >Login</el-button
              >
            </el-form>
            <br />
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

<script setup>
const client = useSupabaseClient();
const email = ref("");
const password = ref("");

async function submit() {
  try {
    const { error } = await client.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });
    if (error) {
      throw error;
    } else {
      await navigateTo("/confirm");
    }
  } catch (error) {
    console.log(error.message);
  }
}
</script>
