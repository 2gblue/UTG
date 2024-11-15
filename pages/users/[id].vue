<template>
  <div v-if="userData">
    <title>{{ userData.name }}</title>
    <h1 class="middleTitle">User List / {{ userData.name }}</h1>
    <div class="buttonContainer">
      <el-button
        v-if="!isEditing"
        type="primary"
        class="newButton"
        round
        @click="toggleEdit"
        >Edit</el-button
      >
      <el-button
        v-else-if="isEditing"
        type="primary"
        class="newButton"
        round
        @click="saveChanges"
        >Save</el-button
      >
      <br />
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
        <el-form-item label="Full Name">
          <el-input v-model="userData.name" :disabled="!isEditing" />
        </el-form-item>
        <el-form-item label="Faculty">
          <el-select
            v-model="userData.faculty_id"
            :disabled="!isEditing"
            placeholder="Select Faculty"
            style="width: 30%"
          >
            <el-option
              v-for="faculty in faculties"
              :key="faculty.id"
              :label="faculty.name"
              :value="faculty.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Role">
          <el-input
            :value="
              userData.accountRole == 1
                ? 'User'
                : userData.accountRole == 2
                ? 'Staff'
                : userData.accountRole == 3
                ? 'Admin'
                : 'Unknown'
            "
            disabled
          />
        </el-form-item>
        <el-form-item label="Email" v-if="isUserMatching && accountData.email">
          <el-input v-model="accountData.email" disabled />
        </el-form-item>
      </el-form>
    </div>
  </div>
  <div v-else class="center-dialog"><p>Loading...</p></div>
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

<script setup>
const client = useSupabaseClient();
const faculties = ref([]);
const userData = ref(null);
const accountData = ref({
  email: "",
});
const accessAccountRole = ref(null);
const route = useRoute();
const userId = route.params.id;
const isEditing = ref(false);
const toggleEdit = () => {
  isEditing.value = !isEditing.value;
};
const isUserMatching = ref(false);

const saveChanges = async () => {
  try {
    const { data, error } = await client
      .from("profile")
      .update({
        name: userData.value.name,
        faculty_id: userData.value.faculty_id,
      })
      .eq("id", userId)
      .single();
    if (error) {
      throw error;
    }
    isEditing.value = false;
  } catch (error) {
    console.error("Error updating profile:", error.message);
  }
};

async function fetchUserData() {
  try {
    const { data, error } = await client
      .from("profile")
      .select("*")
      .eq("id", userId)
      .single();
    if (error) {
      throw error;
    }
    if (data) {
      userData.value = data;
    }
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
  }
}

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

async function fetchUserProfile() {
  try {
    const {
      data: { user },
      error,
    } = await client.auth.getUser();
    if (error) {
      throw error;
    }
    if (user) {
      const { data, error } = await client
        .from("profile")
        .select("accountRole")
        .eq("id", user.id)
        .single();
      if (error) {
        throw error;
      }
      accessAccountRole.value = data.accountRole;
    }
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
  }
}

async function fetchAccountData() {
  try {
    const {
      data: { user },
      error,
    } = await client.auth.getUser();
    if (error) {
      throw error;
    }
    if (user) {
      isUserMatching.value = user.id === userId;
      accountData.value = {
        email: user.email || "",
      };
    }
  } catch (error) {
    console.error("Error fetching account data:", error.message);
  }
}

onMounted(async () => {
  await fetchUserData();
  await fetchFaculties();
  await fetchUserProfile();
  await fetchAccountData();
});

definePageMeta({
  layout: "navigation",
});
</script>
