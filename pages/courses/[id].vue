<template>
  <div v-if="courseData">
    <title>{{ courseData.courseCode }} {{ courseData.courseName }}</title>
    <h1 class="middleTitle">Courses / {{ courseData.courseCode }}</h1>
    <div class="buttonContainer" v-if="accessAccountRole != 1">
      <el-button
        type="danger"
        class="newButton"
        round
        @click="deleteCourseDialog = true"
        >Delete</el-button
      >
      <el-button
        v-if="!isEditingCourse"
        type="primary"
        class="newButton"
        round
        @click="toggleEditCourse"
        >Edit</el-button
      >
      <el-button
        v-else-if="isEditingCourse"
        type="primary"
        class="newButton"
        round
        @click="saveChangesCourse"
        >Save</el-button
      >
      <br />
    </div>

    <div class="container">
      <h2 style="margin-left: 30px">
        <u>Course Details</u>
      </h2>
      <el-form
        :model="courseData"
        label-position="left"
        label-width="auto"
        style="max-width: auto; margin: 30px"
      >
        <el-form-item label="Course Code">
          <el-input
            v-model="courseData.courseCode"
            :disabled="!isEditingCourse"
          />
        </el-form-item>
        <el-form-item label="Course Name">
          <el-input
            v-model="courseData.courseName"
            :disabled="!isEditingCourse"
          />
        </el-form-item>
        <el-form-item label="Exam">
          <el-select
            v-model="courseData.exam"
            :disabled="!isEditingCourse"
            placeholder=" "
          >
            <el-option label="Yes" value="Y" />
            <el-option label="No" value="N" />
          </el-select>
        </el-form-item>
        <el-form-item label="Faculty">
          <el-select
            v-model="courseData.faculty_id"
            :disabled="!isEditingCourse"
            placeholder="Select Faculty"
            style="width: 30%"
          >
            <el-option
              v-for="faculty in faculties"
              :key="faculty.id"
              :label="faculty.name"
              :value="faculty.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Credit Hour">
          <el-input v-model="courseData.credit" :disabled="!isEditingCourse" />
        </el-form-item>
      </el-form>
    </div>
    <br />

    <div class="buttonContainer" v-if="accessAccountRole != 1">
      <el-button
        type="success"
        class="newButton"
        round
        @click="addSectionDialog = true"
        >New</el-button
      >
    </div>

    <div class="container">
      <h2 class="middleTitle">Sections</h2>
      <el-divider></el-divider>
      <el-table :data="sessionsData" stripe>
        <el-table-column prop="sectionName" label="Section" />
        <el-table-column prop="lectureSession" label="Lecture Time">
          <template #default="{ row }">
            {{
              row.lectureSession
                ? `${getFormattedSession(row.lectureSession)}`
                : ""
            }}
          </template>
        </el-table-column>
        <el-table-column prop="labSession" label="Lab Time">
          <template #default="{ row }">
            {{ row.labSession ? `${getFormattedSession(row.labSession)}` : "" }}
          </template>
        </el-table-column>
        <el-table-column label="Actions">
          <template #default="{ row }">
            <el-button text @click="openEditDialog(row)">
              <i class="bx bx-pencil"></i>
            </el-button>
            <el-button text @click="openDeleteDialog(row)">
              <i class="bx bx-trash"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <div v-else class="center-dialog"><p>Loading...</p></div>

  <el-dialog v-model="deleteCourseDialog" width="500" align-center center>
    <el-form class="center-dialog">
      <span>Are you sure you want to delete this <b>course</b>?</span>
      <br />
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteCourseDialog = false">Cancel</el-button>
        <el-button type="danger" @click="deleteCourse">Delete</el-button>
      </span>
    </el-form>
  </el-dialog>

  <el-dialog v-model="addSectionDialog" title="New Section" center>
    <el-form :model="addSectionForm" label-width="auto">
      <hr />
      <div>
        <el-form-item label="Section Name">
          <el-input v-model="addSectionForm.sectionName" />
        </el-form-item>
        <el-form-item label="Lecture Time">
          <el-select
            v-model="addSectionForm.lectureSession"
            placeholder="Select"
          >
            <el-option-group
              v-for="group in groupedPeriods"
              :key="group.label"
              :label="group.label"
            >
              <el-option
                v-for="item in group.options"
                :key="item.id"
                :label="`${item.timeStart} - ${item.timeEnd}`"
                :value="item.id"
              />
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="Lab Time">
          <el-select v-model="addSectionForm.labSession" placeholder="Select">
            <el-option :key="null" :label="'Null'" :value="null"></el-option>
            <el-option-group
              v-for="group in groupedPeriods"
              :key="group.label"
              :label="group.label"
            >
              <el-option
                v-for="item in group.options"
                :key="item.id"
                :label="`${item.timeStart} - ${item.timeEnd}`"
                :value="item.id"
              />
            </el-option-group>
          </el-select>
          <i>*Leave section unselected for null</i>
        </el-form-item>
      </div>
      <hr />
      <div
        class="dialog-footer"
        style="display: flex; justify-content: flex-end"
      >
        <el-button @click="addSectionDialog = false" style="margin-right: 8px"
          >Cancel</el-button
        >
        <el-button type="primary" @click="addSection">Submit</el-button>
      </div>
    </el-form>
  </el-dialog>

  <el-dialog v-model="editSectionDialog" title="Edit Section" center>
    <el-form :model="editSectionForm" label-width="auto">
      <el-form-item label="Section Name">
        <el-input v-model="editSectionForm.sectionName" />
      </el-form-item>
      <el-form-item label="Lecture Time">
        <el-select
          v-model="editSectionForm.lectureSession"
          placeholder="Select"
        >
          <el-option-group
            v-for="group in groupedPeriods"
            :key="group.label"
            :label="group.label"
          >
            <el-option
              v-for="item in group.options"
              :key="item.id"
              :label="`${item.timeStart} - ${item.timeEnd}`"
              :value="item.id"
            />
          </el-option-group>
        </el-select>
      </el-form-item>
      <el-form-item label="Lab Time">
        <el-select v-model="editSectionForm.labSession" placeholder="Select">
          <el-option :key="null" :label="'Null'" :value="null"></el-option>
          <el-option-group
            v-for="group in groupedPeriods"
            :key="group.label"
            :label="group.label"
          >
            <el-option
              v-for="item in group.options"
              :key="item.id"
              :label="`${item.timeStart} - ${item.timeEnd}`"
              :value="item.id"
            />
          </el-option-group>
        </el-select>
      </el-form-item>
      <div
        class="dialog-footer"
        style="display: flex; justify-content: flex-end"
      >
        <el-button @click="editSectionDialog = false">Cancel</el-button>
        <el-button type="primary" @click="saveChangesSection">Save</el-button>
      </div>
    </el-form>
  </el-dialog>

  <el-dialog v-model="deleteSectionDialog" width="500" align-center center>
    <el-form class="center-dialog">
      <span>Are you sure you want to delete this <b>section</b>?</span>
      <br />
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteSectionDialog = false">Cancel</el-button>
        <el-button type="danger" @click="deleteSection">Delete</el-button>
      </span>
    </el-form>
  </el-dialog>
</template>

<style scoped>
@import url("../../assets/css/browse.css");
@import url("../../node_modules/boxicons/css/boxicons.min.css");

.center-dialog {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>

<script setup>
const client = useSupabaseClient();
const courseData = ref(null);
const sessionsData = ref([]);
const faculties = ref([]);
const periods = ref([]);
const accessAccountRole = ref(null);

const route = useRoute();
const courseID = route.params.id;

const isEditingCourse = ref(false);
const deleteCourseDialog = ref(false);
const addSectionDialog = ref(false);
const addSectionForm = reactive({
  sectionName: "",
  lectureSession: null,
  labSession: null,
  course_id: courseID,
});
const editSectionDialog = ref(false);
const editSectionForm = reactive({
  id: null,
  sectionName: "",
  lectureSession: null,
  labSession: null,
  course_id: null,
});
const deleteSectionDialog = ref(false);
const deleteSectionData = ref(null);

const toggleEditCourse = () => {
  isEditingCourse.value = !isEditingCourse.value;
};

const openEditDialog = (section) => {
  editSectionForm.id = section.id;
  editSectionForm.sectionName = section.sectionName;
  editSectionForm.lectureSession = section.lectureSession;
  editSectionForm.labSession = section.labSession;
  editSectionDialog.value = true;
};

const openDeleteDialog = (section) => {
  deleteSectionData.value = section;
  deleteSectionDialog.value = true;
};

const saveChangesCourse = async () => {
  try {
    const { data, error } = await client
      .from("course")
      .update({
        courseCode: courseData.value.courseCode,
        courseName: courseData.value.courseName,
        exam: courseData.value.exam,
        faculty_id: courseData.value.faculty_id,
        credit: courseData.value.credit,
      })
      .eq("id", courseID)
      .single();
    console.log("Updated data:", data);
    if (error) {
      throw error;
    }
    isEditingCourse.value = false;
  } catch (error) {
    console.error("Error updating course:", error.message);
    console.error("Full error object:", error);
  }
};

const deleteCourse = async () => {
  try {
    const { error } = await client.from("course").delete().eq("id", courseID);
    if (error) {
      throw error;
    }
    return navigateTo("/courses");
  } catch (error) {
    console.error("Error updating course:", error.message);
    console.error("Full error object:", error);
  }
};

async function addSection() {
  try {
    const { data, error } = await client
      .from("session")
      .insert([addSectionForm]);
    if (error) {
      throw error;
    }
    addSectionDialog.value = false;
    location.reload();
  } catch (error) {
    console.error("Error adding new courses:", error.message);
  }
}

const deleteSection = async () => {
  try {
    const { data, error } = await client
      .from("session")
      .delete()
      .eq("id", deleteSectionData.value.id); // Delete the section by its ID
    if (error) {
      throw error;
    }
    deleteSectionDialog.value = false;
    location.reload();
  } catch (error) {
    console.error("Error deleting section:", error.message);
  }
};

const saveChangesSection = async () => {
  try {
    const { data, error } = await client
      .from("session")
      .update({
        sectionName: editSectionForm.sectionName,
        lectureSession: editSectionForm.lectureSession,
        labSession: editSectionForm.labSession,
      })
      .eq("id", editSectionForm.id)
      .single();
    if (error) {
      throw error;
    }
    location.reload();
    editSectionDialog.value = false;
  } catch (error) {
    console.error("Error saving section changes:", error.message);
  }
};

const groupedPeriods = computed(() => {
  const grouped = {};
  periods.value.forEach((period) => {
    if (!grouped[period.day]) {
      grouped[period.day] = {
        label: period.day,
        options: [],
      };
    }
    grouped[period.day].options.push(period);
  });
  return Object.values(grouped);
});

async function fetchPeriods() {
  console.log("Fetching periods data...");
  const { data, error } = await client.from("period").select("*");
  if (error) {
    console.error("Error fetching Periods:", error.message);
  } else {
    periods.value = data;
    console.log("Periods fetched:", periods.value);
  }
}

const getFormattedSession = (sessionId) => {
  const session = periods.value.find((period) => period.id === sessionId);
  if (session) {
    return `${session.day} - ${session.timeStart} - ${session.timeEnd}`;
  }
  return "";
};

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
      accessAccountRole.value = data.accountRole;
    }
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
  }
}

async function fetchCourseData() {
  try {
    const { data, error } = await client
      .from("course")
      .select("*")
      .eq("id", courseID)
      .single();
    if (error) {
      throw error;
    }
    if (data) {
      courseData.value = data;
    }
  } catch (error) {
    console.error("Error fetching course data:", error.message);
  }
}

async function fetchSessions() {
  try {
    const { data, error } = await client
      .from("session")
      .select("*")
      .eq("course_id", courseID)
      .order("sectionName", { ascending: true });
    if (error) {
      throw error;
    }
    if (data) {
      sessionsData.value = data;
    }
  } catch (error) {
    console.error("Error fetching course data:", error.message);
  }
}

onMounted(async () => {
  await fetchPeriods();
  await fetchFaculties();
  await fetchUserProfile();
  await fetchCourseData();
  await fetchSessions();
});

definePageMeta({
  layout: "navbar",
});
</script>
