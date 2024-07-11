<template>
  <title>Course Catalogue</title>
  <h1 class="middleTitle">Course Catalogue</h1>
  <div class="buttonContainer">
    <el-button type="success" class="newButton" round @click="add = true"
      >New</el-button
    >
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
    <el-table :data="courseData" stripe>
      <el-table-column prop="courseCode" label="Course Code" />
      <el-table-column prop="courseName" label="Course Name" width="400" />
      <el-table-column prop="exam" label="Exam" />
      <el-table-column prop="faculty" label="Faculty" />
      <el-table-column label="Actions">
        <template #default="scope">
          <el-button text>
            <i class="bx bx-info-circle"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pageNavigation">
      <el-pagination
        :page-size="21"
        :pager-count="3"
        layout="prev, pager, next"
        :total="100"
      />
    </div>
  </div>
  <el-dialog v-model="add" title="New Course" center>
    <el-form :model="course" label-width="auto">
      <hr />
      <div>
        <el-form-item label="Course Code">
          <el-input v-model="course.code" />
        </el-form-item>
        <el-form-item label="Course Name">
          <el-input v-model="course.name" />
        </el-form-item>
        <el-form-item label="Exam">
          <el-select v-model="course.exam">
            <el-option label="Yes" value=" " />
            <el-option label="No" value=" " />
          </el-select>
        </el-form-item>
        <el-form-item label="Faculty">
          <el-select v-model="course.faculty" placeholder="Select faculty">
            <el-option label="Faculty of Computing" value=" " />
            <el-option
              label="Faculty of Chemical and Process Engineering Technology"
              value=" "
            />
          </el-select>
        </el-form-item>
      </div>
      <hr />
      <div
        class="dialog-footer"
        style="display: flex; justify-content: flex-end"
      >
        <el-button @click="add = false" style="margin-right: 8px"
          >Cancel</el-button
        >
        <el-button type="primary">Submit</el-button>
      </div>
    </el-form>
  </el-dialog>
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

const add = ref(false);
const course = reactive({
  code: "",
  name: "",
  exam: "",
  faculty: "",
});

definePageMeta({
  layout: "navbar",
});
</script>
