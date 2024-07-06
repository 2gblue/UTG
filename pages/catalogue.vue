<template>
  <title>Course Catalogue</title>
  <h1 class="middleTitle">Course Catalogue</h1>
  <div class="buttonContainer">
    <el-button type="success" class="newButton" round>New</el-button>
  </div>
  <div class="container">
    <div class="search-bar">
      <el-form :model="search" label-width="auto" style="width: 50%">
        <el-input v-model="search.courseName" placeholder="Course Code/Name" />
      </el-form>
      <button><i class="bx bx-search-alt-2 bx-fw"></i></button>
      <el-select v-model="search.exam" placeholder="Exam" style="width: 15%">
        <el-option label="Yes" value="Y" />
        <el-option label="No" value="N" />
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
  </div>
</template>

<style scoped>
@import url("../assets/css/catalogueSearch.css");
@import url("../node_modules/boxicons/css/boxicons.min.css");
</style>

<script setup lang="ts">
const search = ref({
  courseName: "",
  exam: "",
  faculty: "",
});

definePageMeta({
  layout: "navbar",
});
</script>
