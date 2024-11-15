<template>
  <title>Generate Timetable</title>
  <h1 class="middleTitle">Generate Timetable</h1>
  <div class="container">
    <h2 class="middleTitle">Chosen Courses</h2>
    <p class="middleTitle">
      <sup
        >Courses are prioritised based on descending order - Top to Bottom</sup
      >
    </p>
    <el-divider></el-divider>
    <el-table :data="selectedCourses" stripe>
      <el-table-column prop="courseCode" label="Course Code" width="200" />
      <el-table-column prop="courseName" label="Course Name" />
      <el-table-column prop="exam" label="Exam" />
      <el-table-column prop="credit" label="Credit Hour" />
      <el-table-column label="Actions">
        <template #default="scope">
          <el-button @click="removeCourse(scope.row)">
            <i class="bx bx-minus-circle"></i>
          </el-button>
          <el-button
            @click="moveUp(scope.$index)"
            :disabled="scope.$index === 0"
            ><i class="bx bx-chevron-up"></i
          ></el-button>
          <el-button
            @click="moveDown(scope.$index)"
            :disabled="scope.$index === selectedCourses.length - 1"
          >
            <i class="bx bx-chevron-down"></i
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <br />
  <div class="middleTitle">
    <el-button type="warning" size="large" @click="goToGenerate"
      >Proceed</el-button
    >
  </div>
  <div class="container">
    <h2 class="middleTitle">Course List</h2>
    <el-divider></el-divider>
    <div>
      <div class="search-bar">
        <el-form :model="search" label-width="auto">
          <el-input v-model="search.courseCode" placeholder="Course Code" />
        </el-form>
        <el-form :model="search" label-width="auto" style="width: 40%">
          <el-input v-model="search.courseName" placeholder="Course Name" />
        </el-form>
        <el-select v-model="search.exam" placeholder="Exam" style="width: 15%">
          <el-option label="All" value="*" />
          <el-option label="Yes" value="Yes" />
          <el-option label="No" value="No" />
        </el-select>
        <el-select
          v-model="search.faculty"
          placeholder="Faculty"
          style="width: 30%"
        >
          <el-option
            v-for="faculty in faculties"
            :key="faculty.id"
            :label="faculty.name"
            :value="faculty.id"
          />
        </el-select>
      </div>
      <el-divider></el-divider>
      <el-table :data="coursesData" stripe>
        <el-table-column prop="courseCode" label="Course Code" />
        <el-table-column prop="courseName" label="Course Name" />
        <el-table-column prop="exam" label="Exam" width="100" />
        <el-table-column prop="faculty" label="Faculty" />
        <el-table-column prop="credit" label="Credit Hour" width="100" />
        <el-table-column label="Actions" width="100">
          <template #default="scope">
            <el-button @click="addCourse(scope.row)">
              <i class="bx bx-plus"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pageNavigation">
        <button @click="prevPage" :disabled="currentPage === 1">
          Previous
        </button>
        <span>{{ currentPage }} / {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("../../assets/css/browse.css");
@import url("../../node_modules/boxicons/css/boxicons.min.css");
@import url("../../assets/css/pager.css");
</style>

<script setup>
const client = useSupabaseClient();
const coursesData = ref([]);
const faculties = ref([]);
const search = reactive({
  courseCode: "",
  courseName: "",
  exam: "",
  faculty: "",
});
const selectedCourses = ref([]);
const currentPage = ref(1);
const pageSize = ref(15);
const totalItems = ref(0);
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value));
const router = useRouter();

function goToGenerate() {
  const selectedCourseIds = selectedCourses.value.map((course) => course.id);
  router.push({
    path: "/generate/schedule",
    query: { selectedCourses: selectedCourseIds.join(",") },
  });
}

function addCourse(course) {
  if (!selectedCourses.value.find((c) => c.id === course.id)) {
    selectedCourses.value.push(course);
  }
}

function removeCourse(course) {
  selectedCourses.value = selectedCourses.value.filter(
    (c) => c.id !== course.id
  );
}

function moveUp(index) {
  if (index > 0) {
    const temp = selectedCourses.value[index - 1];
    selectedCourses.value[index - 1] = selectedCourses.value[index];
    selectedCourses.value[index] = temp;
  }
}

function moveDown(index) {
  if (index < selectedCourses.value.length - 1) {
    const temp = selectedCourses.value[index + 1];
    selectedCourses.value[index + 1] = selectedCourses.value[index];
    selectedCourses.value[index] = temp;
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    fetchCourses(currentPage.value);
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchCourses(currentPage.value);
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

async function fetchCourses(page) {
  try {
    const from = (page - 1) * pageSize.value;
    const to = page * pageSize.value - 1;
    let query = client
      .from("course")
      .select(
        "id, courseCode, courseName, exam, faculty:faculty_id(name), credit",
        {
          count: "exact",
        }
      )
      .range(from, to);

    if (search.courseCode) {
      query = query.ilike("courseCode", `%${search.courseCode}%`);
    }
    if (search.courseName) {
      query = query.ilike("courseName", `%${search.courseName}%`);
    }
    if (search.exam === "Yes") {
      query = query.eq("exam", "Yes");
    } else if (search.exam === "No") {
      query = query.eq("exam", "No");
    }
    if (search.faculty) {
      query = query.eq("faculty_id", search.faculty);
    }
    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    coursesData.value = data.map((course) => ({
      id: course.id,
      courseCode: course.courseCode,
      courseName: course.courseName,
      exam: course.exam,
      faculty: course.faculty.name,
      credit: course.credit,
    }));
    totalItems.value = count;
  } catch (error) {
    console.error("Error fetching courses:", error.message);
  }
}

watchEffect(() => {
  fetchCourses(currentPage.value);
});

onMounted(() => {
  fetchFaculties();
  fetchCourses(currentPage.value);
});

definePageMeta({
  layout: "navigation",
});
</script>
