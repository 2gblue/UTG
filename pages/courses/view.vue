<template>
  <title>View Course</title>
  <h1 class="middleTitle">Courses / {{ courseData.courseCode }}</h1>
  <div class="buttonContainer">
    <el-button
      type="danger"
      class="newButton"
      round
      @click="deleteCourse = true"
      >Delete</el-button
    >
    <el-button
      v-if="!isEditing"
      type="primary"
      class="newButton"
      round
      @click="toggleEdit"
      >Edit</el-button
    >
    <el-button
      v-else
      type="primary"
      class="newButton"
      round
      @click="saveChanges"
      >Save</el-button
    >
  </div>

  <div class="container">
    <h2 style="margin-left: 30px">
      <u> Course Details </u>
    </h2>
    <el-form
      :model="courseData"
      label-position="left"
      label-width="auto"
      style="max-width: auto; margin: 30px"
    >
      <el-form-item label="Course Code">
        <el-input v-model="courseData.courseCode" :disabled="!isEditing" />
      </el-form-item>
      <el-form-item label="Course Name">
        <el-input v-model="courseData.courseName" :disabled="!isEditing" />
      </el-form-item>
      <el-form-item label="Exam">
        <el-select
          v-model="courseData.exam"
          :disabled="!isEditing"
          placeholder=" "
        >
          <el-option label="Yes" value="Y" />
          <el-option label="No" value="N" />
        </el-select>
      </el-form-item>
      <el-form-item label="Faculty">
        <el-select
          v-model="courseData.faculty"
          :disabled="!isEditing"
          placeholder=" "
        >
          <el-option label="Faculty of Computing" value=" " />
          <el-option
            label="Faculty of Chemical and Process Engineering Technology"
            value=" "
          />
        </el-select>
      </el-form-item>
    </el-form>
  </div>

  <br />

  <div class="buttonContainer">
    <el-button type="success" class="newButton" round @click="addSection = true"
      >New</el-button
    >
  </div>

  <div class="container">
    <h2 class="middleTitle">Sections</h2>
    <el-divider></el-divider>
    <el-table :data="sectionData" stripe>
      <el-table-column prop="name" label="Section" />
      <el-table-column label="Lecture Time">
        <template #default="scope">
          <span
            v-for="(option, index) in scope.row.lecture.options"
            :key="index"
          >
            {{ scope.row.lecture.label }} {{ option }}
            <br />
          </span>
        </template>
      </el-table-column>
      <el-table-column label="Lab Time">
        <template #default="scope">
          <span v-for="(option, index) in scope.row.lab.options" :key="index">
            {{ scope.row.lab.label }} {{ option }}
            <br />
          </span>
        </template>
      </el-table-column>
      <el-table-column label="Actions">
        <template #default="scope">
          <el-button text @click="editSectionData(scope.row)">
            <i class="bx bx-pencil"></i
          ></el-button>
          <el-button text @click="deleteSection = true"
            ><i class="bx bx-trash"></i
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <el-dialog v-model="deleteCourse" width="500" align-center center>
    <el-form class="center-dialog">
      <span>Are you sure you want to delete this <b>course</b>?</span>
      <br />
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteCourse = false">Cancel</el-button>
        <el-button type="danger" @click="">Delete</el-button>
      </span>
    </el-form>
  </el-dialog>

  <el-dialog v-model="addSection" title="New Section" center>
    <el-form :model="addSectionForm" label-width="auto">
      <hr />
      <div>
        <el-form-item label="Section Name">
          <el-input v-model="addSectionForm.name" />
        </el-form-item>
        <el-form-item label="Lecture Time">
          <el-select v-model="addSectionForm.lecture" placeholder="Select">
            <el-option-group
              v-for="group in options"
              :key="group.label"
              :label="group.label"
            >
              <el-option
                v-for="item in group.options"
                :key="item.value"
                :label="`${group.label} ${item.label}`"
                :value="item.value"
              />
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="Lab Time">
          <el-select v-model="addSectionForm.lab" placeholder="Select">
            <el-option-group
              v-for="group in options"
              :key="group.label"
              :label="group.label"
            >
              <el-option
                v-for="item in group.options"
                :key="item.value"
                :label="`${group.label} ${item.label}`"
                :value="item.value"
              />
            </el-option-group>
          </el-select>
        </el-form-item>
      </div>
      <hr />
      <div
        class="dialog-footer"
        style="display: flex; justify-content: flex-end"
      >
        <el-button @click="addSection = false" style="margin-right: 8px"
          >Cancel</el-button
        >
        <el-button type="primary">Submit</el-button>
      </div>
    </el-form>
  </el-dialog>

  <el-dialog v-model="editSection" title="Edit Section" center>
    <el-form :model="editSectionForm" label-width="auto">
      <el-form-item label="Section Name">
        <el-input v-model="editSectionForm.name" />
      </el-form-item>
      <el-form-item label="Lecture Time">
        <el-select v-model="editSectionForm.lecture" placeholder="Select">
          <el-option-group
            v-for="group in options"
            :key="group.label"
            :label="group.label"
          >
            <el-option
              v-for="item in group.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-option-group>
        </el-select>
      </el-form-item>
      <el-form-item label="Lab Time">
        <el-select v-model="editSectionForm.lab" placeholder="Select">
          <el-option-group
            v-for="group in options"
            :key="group.label"
            :label="group.label"
          >
            <el-option
              v-for="item in group.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-option-group>
        </el-select>
      </el-form-item>
      <div
        class="dialog-footer"
        style="display: flex; justify-content: flex-end"
      >
        <el-button @click="editSection = false">Cancel</el-button>
        <el-button type="primary" @click="">Save</el-button>
      </div>
    </el-form>
  </el-dialog>

  <el-dialog v-model="deleteSection" width="500" align-center center>
    <el-form class="center-dialog">
      <span>Are you sure you want to delete this <b>section</b>?</span>
      <br />
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteSection = false">Cancel</el-button>
        <el-button type="danger" @click="">Delete</el-button>
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

<script setup lang="ts">
const courseData = ref({
  courseCode: "BCS2143",
  courseName: "Object Oriented Programming",
  exam: "Y",
  faculty: "Faculty of Computing",
});

const addSectionForm = reactive({
  name: "",
  lecture: "",
  lab: "",
});

const editSectionForm = reactive({
  name: "",
  lecture: "",
  lab: "",
});

const sectionData = ref([
  {
    name: "01A",
    lecture: {
      label: "Monday",
      options: ["2PM-4PM"],
    },
    lab: {
      label: "Tuesday",
      options: ["8AM-10AM"],
    },
  },
  {
    name: "01B",
    lecture: {
      label: "Monday",
      options: ["2PM-4PM"],
    },
    lab: {
      label: "Tuesday",
      options: ["10AM-12PM"],
    },
  },
  {
    name: "02A",
    lecture: {
      label: "Thursday",
      options: ["2PM-4PM"],
    },
    lab: {
      label: "Thursday",
      options: ["8AM-10AM"],
    },
  },
]);

const options = [
  {
    label: "Monday",
    options: [
      {
        value: "1",
        label: "8AM-10AM",
      },
      {
        value: "2",
        label: "10AM-12PM",
      },
      {
        value: "3",
        label: "12PM-2PM",
      },
      {
        value: "4",
        label: "2PM-4PM",
      },
      {
        value: "5",
        label: "4PM-6PM",
      },
    ],
  },
  {
    label: "Tuesday",
    options: [
      {
        value: "6",
        label: "8AM-10AM",
      },
      {
        value: "7",
        label: "10AM-12PM",
      },
      {
        value: "8",
        label: "12PM-2PM",
      },
      {
        value: "9",
        label: "2PM-4PM",
      },
      {
        value: "10",
        label: "4PM-6PM",
      },
    ],
  },
  {
    label: "Wednesday",
    options: [
      {
        value: "11",
        label: "8AM-10AM",
      },
      {
        value: "12",
        label: "10AM-12PM",
      },
      {
        value: "13",
        label: "12PM-2PM",
      },
      {
        value: "14",
        label: "2PM-4PM",
      },
      {
        value: "15",
        label: "4PM-6PM",
      },
    ],
  },
  {
    label: "Thursday",
    options: [
      {
        value: "16",
        label: "8AM-10AM",
      },
      {
        value: "17",
        label: "10AM-12PM",
      },
      {
        value: "18",
        label: "12PM-2PM",
      },
      {
        value: "19",
        label: "2PM-4PM",
      },
      {
        value: "20",
        label: "4PM-6PM",
      },
    ],
  },
  {
    label: "Friday",
    options: [
      {
        value: "21",
        label: "8AM-10AM",
      },
      {
        value: "22",
        label: "10AM-12PM",
      },
      {
        value: "23",
        label: "12PM-2PM",
      },
      {
        value: "24",
        label: "2PM-4PM",
      },
      {
        value: "25",
        label: "4PM-6PM",
      },
    ],
  },
];

const isEditing = ref(false);
const deleteCourse = ref(false);
const addSection = ref(false);
const editSection = ref(false);

const editSectionData = (rowData: any) => {
  editSectionForm.name = rowData.name;
  editSection.value = true;
};

const deleteSection = ref(false);

const toggleEdit = () => {
  isEditing.value = !isEditing.value;
};

const saveChanges = () => {
  isEditing.value = false;
  // Implement your save logic here
};

definePageMeta({
  layout: "navbar",
});
</script>
