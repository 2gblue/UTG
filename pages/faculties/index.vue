<template>
  <div>
    <title>Faculty List</title>
    <h1 class="middleTitle">Faculty List</h1>
    <div class="buttonContainer">
      <el-button
        type="success"
        class="newButton"
        round
        @click="addDialogVisible = true"
        >New</el-button
      >
    </div>
    <div class="container">
      <el-table :data="facultyData" stripe>
        <el-table-column prop="id" label="Faculty ID" width="200" />
        <el-table-column prop="name" label="Faculty" />
      </el-table>
    </div>
    <el-dialog
      v-model="addDialogVisible"
      title="New Faculty"
      center
      width="500"
    >
      <el-form :model="faculty" label-width="auto">
        <hr />
        <div>
          <el-form-item label="Faculty Name">
            <el-input v-model="faculty.name" />
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
          <el-button type="primary" @click="submitFaculty">Submit</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<style scoped>
@import url("../../assets/css/browse.css");
@import url("../../node_modules/boxicons/css/boxicons.min.css");
</style>

<script setup>
const client = useSupabaseClient();
const addDialogVisible = ref(false);
const facultyData = ref([]);
const faculty = reactive({
  name: "",
});

async function fetchFaculties() {
  try {
    const { data, error } = await client.from("faculty").select("*");
    if (error) {
      throw error;
    }
    facultyData.value = data;
  } catch (error) {
    console.error("Error fetching faculties:", error.message);
  }
}

async function submitFaculty() {
  try {
    const { data, error } = await client.from("faculty").insert([faculty]);
    if (error) {
      throw error;
    }
    addDialogVisible.value = false;
    await fetchFaculties();
  } catch (error) {
    console.error("Error adding new faculty:", error.message);
  }
}

onMounted(fetchFaculties);

definePageMeta({
  layout: "navbar",
});
</script>
