<template>
  <title>Generate Timetable</title>
  <h1 class="middleTitle">Generate Timetable</h1>
  <div class="container">
    <el-table :data="tableData" border>
      <el-table-column prop="time" label=" "></el-table-column>
      <el-table-column
        v-for="(time, index) in times"
        :key="index"
        :label="time"
      >
        <template #default="scope">
          <div
            id="getCellId(scope.$index + 1, index + 1)"
            style="height: 50px"
          ></div>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <br />
  <div class="middleTitle">
    <el-button type="primary" size="large">Export</el-button>
    <el-button type="warning" size="large">Generate</el-button>
  </div>
  <div class="container">
    <h2 class="middleTitle">Chosen Courses</h2>
    <el-divider></el-divider>
    <el-table :data="courseData" stripe>
      <el-table-column prop="courseCode" label="Course Code" width="200" />
      <el-table-column prop="courseName" label="Course Name" />
      <el-table-column label="Sections">
        <template #default="scope">
          <el-checkbox-group v-model="selectedSections[scope.$index]">
            <el-checkbox
              v-for="section in scope.row.sections"
              :label="section"
              :key="section"
            >
              {{ section }}
            </el-checkbox>
          </el-checkbox-group>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
@import url("../../assets/css/browse.css");
@import url("../../node_modules/boxicons/css/boxicons.min.css");
</style>

<script setup lang="ts">
const courseData = ref([
  {
    courseCode: "BCS2143",
    courseName: "Object Oriented Programming",
    exam: "Y",
    faculty: "FACULTY OF COMPUTING",
    sections: ["01A", "01B", "02A", "03A"],
  },
  {
    courseCode: "BCS2233",
    courseName: "Software Requirement Workshop",
    exam: "N",
    faculty: "FACULTY OF COMPUTING",
    sections: ["01A", "01B", "02A", "02B", "03A"],
  },
  {
    courseCode: "BCS2313",
    courseName: "Artificial Intelligence Techniques",
    exam: "Y",
    faculty: "FACULTY OF COMPUTING",
    sections: ["01A", "01B"],
  },
]);

const selectedSections = ref<Array<Array<string>>>(
  courseData.value.map(() => [])
);

const times = ["0800-1000", "1000-1200", "1200-1400", "1400-1600", "1600-1800"];
const days = ["MON", "TUE", "WED", "THUR", "FRI"];
const tableData = ref(days.map((day) => ({ time: day })));

const getCellId = (row: number, col: number) => row * 5 + col;

definePageMeta({
  layout: "navbar",
});
</script>
