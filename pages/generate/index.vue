<template>
  <title>Generate Timetable</title>
  <h1 class="middleTitle">Generate Timetable</h1>
  <div class="container">
    <h2 class="middleTitle">Chosen Courses</h2>
    <el-divider></el-divider>
    <el-table :data="courseData" stripe>
      <el-table-column prop="courseCode" label="Course Code" width="200" />
      <el-table-column prop="courseName" label="Course Name" />
    </el-table>
  </div>
  <br />
  <div class="middleTitle">
    <el-button type="warning" size="large">Proceed</el-button>
  </div>
  <div class="container">
    <h2 class="middleTitle">Courses List</h2>
    <el-divider></el-divider>
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
    <el-table :data="courseData" stripe>
      <el-table-column prop="courseCode" label="Course Code" />
      <el-table-column prop="courseName" label="Course Name" width="400" />
      <el-table-column prop="exam" label="Exam" />
      <el-table-column prop="faculty" label="Faculty" />
      <el-table-column label="Actions">
        <template #default="scope">
          <el-checkbox v-model="checked1" label=" " size="large" />
        </template>
      </el-table-column>
    </el-table>
    <div class="pageNavigation">
      <el-pagination
        :page-size="20"
        :pager-count="5"
        layout="prev, pager, next"
        :total="500"
      />
    </div>
  </div>
</template>

<style scoped>
@import url("../../assets/css/browse.css");
@import url("../../node_modules/boxicons/css/boxicons.min.css");
</style>

<script setup lang="ts">
const search = ref({
  courseName: "",
  exam: "",
  faculty: "",
});

const courseData = [
  {
    courseCode: "BCS2143",
    courseName: "Object Oriented Programming",
    exam: "Y",
    faculty: "FACULTY OF COMPUTING",
  },
  {
    courseCode: "BCS2233",
    courseName: "Software Requirement Workshop",
    exam: "N",
    faculty: "FACULTY OF COMPUTING",
  },
  {
    courseCode: "BCS2313",
    courseName: "Artificial Intelligence Techniques",
    exam: "Y",
    faculty: "FACULTY OF COMPUTING",
  },
];

definePageMeta({
  layout: "navbar",
});
</script>
