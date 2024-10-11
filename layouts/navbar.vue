<template>
  <div>
    <el-menu
      class="el-menu-navbar"
      mode="horizontal"
      background-color="white"
      text-color="black"
      active-text-color="#8034c2"
      :ellipsis="false"
    >
      <p><img src="../assets/img/logo.png" class="logo" /></p>
      <p class="navbar-deco">Timetable Generator</p>
      <el-menu-item index="1">
        <NuxtLink to="/courses/">Course Catalogue</NuxtLink>
      </el-menu-item>
      <p class="navbar-deco"><b>/</b></p>
      <el-menu-item index="2">
        <NuxtLink to="/faculties/">Faculty List</NuxtLink>
      </el-menu-item>
      <p class="navbar-deco"><b>/</b></p>
      <el-menu-item index="3">
        <NuxtLink to="/announcements/">Announcements</NuxtLink>
      </el-menu-item>
      <p class="navbar-deco"><b>/</b></p>
      <el-menu-item index="4">
        <NuxtLink to="/generate/">Generate Timetable</NuxtLink>
      </el-menu-item>
      <p class="navbar-deco"><b>/</b></p>
      <el-menu-item index="5">
        <NuxtLink :to="`/users/${userID}`">Profile</NuxtLink>
      </el-menu-item>
      <p class="navbar-deco" v-if="accountRole != 1"><b>/</b></p>
      <el-menu-item index="6" v-if="accountRole != 1">
        <NuxtLink to="/users/">User List</NuxtLink>
      </el-menu-item>
      <el-menu-item class="logout-button" style="margin-left: auto">
        <NuxtLink @click="logout">Logout</NuxtLink>
      </el-menu-item>
    </el-menu>
  </div>
  <slot />
</template>

<style scoped>
@import url("../assets/css/navbar.css");
</style>

<script setup>
const client = useSupabaseClient();
const accountRole = ref(null);
const userID = ref(null);

const logout = async () => {
  try {
    const { error } = await client.auth.signOut();
    if (error) {
      throw error;
    } else {
      await refreshNuxtData();
      await navigateTo("/login");
    }
  } catch (error) {
    showError(error.message);
  }
};

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
      accountRole.value = data.accountRole;
      userID.value = user.id;
      return data.accountRole;
    }
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
  }
}

onMounted(() => {
  fetchUserProfile();
});
</script>
