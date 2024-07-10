<template>
  <div>
    <el-menu
      class="el-menu-navbar"
      mode="horizontal"
      background-color="white"
      text-color="black"
      active-text-color="#8034c2"
      :ellipsis="false"
      @select="handleSelect"
    >
      <p class="navbar-deco">UMPSA Timetable Generator</p>
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
        <NuxtLink to="/users/">User</NuxtLink>
      </el-menu-item>
      <el-menu-item class="logout-button" style="margin-left: auto">
        <NuxtLink to="/login">Logout</NuxtLink>
      </el-menu-item>
    </el-menu>
  </div>
  <slot />
</template>

<style scoped>
@import url("../assets/css/navbar.css");
</style>

<script setup lang="ts">
const activeIndex = ref("1");
const handleSelect = (index: string, indexPath: string[]) => {
  console.log("Selected index:", index);
};
</script>
