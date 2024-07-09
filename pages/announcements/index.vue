<template>
  <title>Announcements</title>
  <h1 class="middleTitle">Announcements</h1>
  <div class="buttonContainer">
    <el-button type="success" class="newButton" round @click="add = true"
      >New</el-button
    >
  </div>
  <div class="container">
    <div class="search-bar">
      <el-form :model="search" label-width="auto" style="width: 100%">
        <el-input v-model="search.announcement" placeholder="Title" />
      </el-form>
      <button><i class="bx bx-search-alt-2 bx-fw"></i></button>
    </div>
    <el-divider></el-divider>
    <el-table :data="announcementData" stripe>
      <el-table-column
        prop="announcementTitle"
        label="Announcements"
        width="600"
      />
      <el-table-column prop="announcementDate" label="Date" />
      <el-table-column label="Actions">
        <template #default="scope">
          <el-button text @click="view = true">
            <i class="bx bx-info-circle"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pageNavigation">
      <el-pagination
        :page-size="20"
        :pager-count="6"
        layout="prev, pager, next"
        :total="500"
      />
    </div>
  </div>
  <el-dialog v-model="view" title="Title Here" align-center>
    <hr />
    <div>
      <p><b>Posted by:</b> Person</p>
      <p><b>Date:</b> Date</p>
    </div>
    <hr />
    <span
      >This is a message of the announcement. This is a message of the
      announcement. This is a message of the announcement.</span
    >
  </el-dialog>
  <el-dialog v-model="add" title="New Announcement" center >
    <el-form :model="announcement" label-width="auto">
      <hr />
      <div>
        <el-form-item label="Title">
          <el-input v-model="announcement.announcementTitle" />
        </el-form-item>
        <el-form-item label="Content">
          <el-input
            v-model="announcement.announcementContent"
            type="textarea"
            :rows="4"
          />
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
  announcement: "",
});

const announcementData = [
  {
    announcementTitle: "Elective Options Available for 2023/2024 Semester II",
    announcementDate: "22/3/2024",
  },
  {
    announcementTitle:
      "Open Registration Date Announcement for 2023/2024 Semester II",
    announcementDate: "26/3/2024",
  },
];

const view = ref(false);
const add = ref(false);
const announcement = reactive({
  announcementTitle: "",
  announcementContent: "",
});

definePageMeta({
  layout: "navbar",
});
</script>
