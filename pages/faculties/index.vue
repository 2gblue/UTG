<template>
  <title>Faculty List</title>
  <h1 class="middleTitle">Faculty List</h1>
  <div class="buttonContainer">
    <el-button type="success" class="newButton" round @click="add = true"
      >New</el-button
    >
  </div>
  <div class="container">
    <el-table :data="facultyData" stripe>
      <el-table-column prop="facultyID" label="Faculty ID" width="200" />
      <el-table-column prop="facultyName" label="Faculty" />
    </el-table>
  </div>
  <el-dialog v-model="add" title="New Faculty" center width="500">
    <el-form :model="faculty" label-width="auto">
      <hr />
      <div>
        <el-form-item label="Faculty Name">
          <el-input v-model="faculty.facultyName" />
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
const facultyData = [
  {
    facultyID: "1",
    facultyName: "Faculty of Computing",
  },
  {
    facultyID: "2",
    facultyName: "Faculty of Chemical and Process Engineering Technology",
  },
  {
    facultyID: "3",
    facultyName: "Faculty of Electrical and Electronics Engineering Technology",
  },
  {
    facultyID: "4",
    facultyName:
      "Faculty of Manufacturing and Mechatronic Engineering Technology",
  },
  {
    facultyID: "5",
    facultyName: "Centre for Modern Languages",
  },
  {
    facultyID: "6",
    facultyName: "Centre for Human Sciences",
  },
];

const add = ref(false);
const faculty = reactive({
  facultyName: "",
});

definePageMeta({
  layout: "navbar",
});
</script>
