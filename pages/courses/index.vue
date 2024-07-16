<template>
  <title>Course Catalogue</title>
  <h1 class="middleTitle">Course Catalogue</h1>
  <div class="buttonContainer">
    <el-button
      v-if="accountRole != 1"
      type="success"
      class="newButton"
      round
      @click="addDialogVisible = true"
      >New</el-button
    >
  </div>
  <div class="container">
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
      <el-table-column prop="exam" label="Exam" />
      <el-table-column prop="faculty" label="Faculty" />
      <el-table-column prop="credit" label="Credit Hour" width="100" />
      <el-table-column label="Actions">
        <template #default="{ row }">
          <NuxtLink :to="`/courses/${row.id}`">
            <el-button text>
              <i class="bx bx-info-circle"></i>
            </el-button>
          </NuxtLink>
        </template>
      </el-table-column>
    </el-table>
    <div class="pageNavigation">
      <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">
        Next
      </button>
    </div>
  </div>
  <el-dialog v-model="addDialogVisible" title="New Course" center>
    <el-form :model="addNew" label-width="auto">
      <hr />
      <div>
        <el-form-item label="Course Code">
          <el-input v-model="addNew.courseCode" />
        </el-form-item>
        <el-form-item label="Course Name">
          <el-input v-model="addNew.courseName" />
        </el-form-item>
        <el-form-item label="Exam">
          <el-select v-model="addNew.exam">
            <el-option label="Yes" value="Yes" />
            <el-option label="No" value="No" />
          </el-select>
        </el-form-item>
        <el-form-item label="Credit Hour">
          <el-input v-model="addNew.credit" />
        </el-form-item>
        <el-form-item label="Faculty">
          <el-select v-model="addNew.faculty_id" placeholder="Faculty">
            <el-option
              v-for="faculty in faculties"
              :key="faculty.id"
              :label="faculty.name"
              :value="faculty.id"
            />
          </el-select>
        </el-form-item>
      </div>
      <hr />
      <div
        class="dialog-footer"
        style="display: flex; justify-content: flex-end"
      >
        <el-button @click="addDialogVisible = false" style="margin-right: 8px"
          >Cancel</el-button
        >
        <el-button type="primary" @click="addCourse">Submit</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<style scoped>
@import url("../../assets/css/browse.css");
@import url("../../node_modules/boxicons/css/boxicons.min.css");
@import url("../../assets/css/pager.css");
</style>

<script setup>
const client = useSupabaseClient();
const accountRole = ref(null);
const faculties = ref([]);
const search = reactive({
  courseCode: "",
  courseName: "",
  exam: "",
  faculty: "",
});
const addDialogVisible = ref(false);
const addNew = reactive({
  courseCode: "",
  courseName: "",
  exam: "",
  faculty_id: "",
  credit: "",
});
const coursesData = ref([]);
const currentPage = ref(1);
const pageSize = ref(20);
const totalItems = ref(0);
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value));

async function addCourse() {
  try {
    const { data, error } = await client.from("course").insert([addNew]);
    if (error) {
      throw error;
    }
    addDialogVisible.value = false;
    await fetchCourses(currentPage);
  } catch (error) {
    console.error("Error adding new courses:", error.message);
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
      accountRole.value = data.accountRole;
      return data.accountRole;
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

watchEffect(() => {
  fetchCourses(currentPage.value);
});

onMounted(() => {
  fetchUserProfile();
  fetchFaculties();
  fetchCourses(currentPage.value);
});

definePageMeta({
  layout: "navbar",
});
</script>
