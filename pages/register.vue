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
              @submit.prevent="submit"
              label-width="auto"
              style="max-width: 600px"
            >
              <el-input v-model="email" placeholder="Email" />
              &nbsp;
              <el-input
                v-model="password"
                placeholder="Password"
                type="password"
              />
              &nbsp;
              <el-input v-model="name" placeholder="Full Name" />
              &nbsp;
              <el-select v-model="faculty" placeholder="Faculty">
                <el-option
                  v-for="faculty in faculties"
                  :key="faculty.id"
                  :label="faculty.name"
                  :value="faculty.id"
                />
              </el-select>
              <el-button
                type="primary"
                native-type="submit"
                style="margin-top: 20px"
                >Sign Up</el-button
              >
              <br />
            </el-form>
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
const client = useSupabaseClient();
const email = ref("");
const password = ref("");
const name = ref("");
const faculty = ref("");
const faculties = ref([]);

async function fetchFaculties() {
  console.log("Fetching faculties...");
  const { data, error } = await client.from("faculty").select("id, name");
  if (error) {
    console.error("Error fetching faculties:", error.message);
  } else {
    faculties.value = data;
    console.log("Faculties fetched:", faculties.value);
  }
}

async function submit() {
  try {
    const { data, error } = await client.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          name: name.value,
          faculty_id: faculty.value,
        },
      },
    });
    if (error) {
      throw error;
    } else {
      await navigateTo("/confirm");
    }
  } catch (error) {
    console.error("Error signing up:", error.message);
  }
}

onMounted(() => {
  fetchFaculties();
});
</script>
