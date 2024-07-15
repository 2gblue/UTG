<template>
  <title>Announcements</title>
  <h1 class="middleTitle">Announcements</h1>
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
      <el-form :model="search" label-width="auto" style="width: 100%">
        <el-input
          v-model="search.announcement"
          placeholder="Search Announcements"
        />
      </el-form>
      <button @click="searchAnnouncements">
        <i class="bx bx-search-alt-2 bx-fw"></i>
      </button>
    </div>
    <el-divider></el-divider>
    <el-table :data="announcementsData" stripe>
      <el-table-column prop="title" label="Announcements" width="600" />
      <el-table-column prop="created_at" label="Date" />
      <el-table-column label="Actions">
        <template #default="{ row }">
          <el-button text @click="openViewDialog(row)">
            <i class="bx bx-info-circle"></i>
          </el-button>
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
  <el-dialog v-model="viewVisible" :title="viewDetails.title" align-center>
    <hr />
    <div>
      <p><b>Posted by:</b> {{ viewDetails.postedBy }}</p>
      <p><b>Date:</b> {{ viewDetails.date }}</p>
    </div>
    <hr />
    <p style="white-space: pre-wrap">{{ viewDetails.content }}</p>
  </el-dialog>
  <el-dialog v-model="addDialogVisible" title="New Announcement" center>
    <el-form :model="announcement" label-width="auto">
      <hr />
      <div>
        <el-form-item label="Title">
          <el-input v-model="announcement.title" />
        </el-form-item>
        <el-form-item label="Content">
          <el-input v-model="announcement.content" type="textarea" :rows="4" />
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
        <el-button type="primary" @click="submitAnnouncement">Submit</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<style scoped>
@import url("../../assets/css/browse.css");
@import url("../../assets/css/pager.css");
@import url("../../node_modules/boxicons/css/boxicons.min.css");
</style>

<script setup>
const client = useSupabaseClient();
const accountRole = ref(null);
const addDialogVisible = ref(false);
const viewVisible = ref(false);
const announcementsData = ref([]);
const viewDetails = reactive({
  postedBy: "",
  date: "",
  content: "",
});
const announcement = reactive({
  title: "",
  content: "",
});
const search = ref({
  announcement: "",
});
const currentPage = ref(1);
const pageSize = ref(8);
const totalItems = ref(0);
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value));

async function fetchAnnouncements(page, searchQuery = "") {
  try {
    const from = (page - 1) * pageSize.value;
    const to = page * pageSize.value - 1;

    const { data, error, count } = await client
      .from("announcement")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .ilike("title", `%${searchQuery}%`)
      .range(from, to);

    if (error) {
      throw error;
    }

    announcementsData.value = data.map((item) => ({
      ...item,
      created_at: new Date(item.created_at).toLocaleString(),
    }));
    totalItems.value = count;
  } catch (error) {
    console.error("Error fetching announcements:", error.message);
  }
}

function searchAnnouncements() {
  fetchAnnouncements(currentPage.value, search.value.announcement);
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    fetchAnnouncements(currentPage.value, search.value.announcement);
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchAnnouncements(currentPage.value, search.value.announcement);
  }
}

async function openViewDialog(row) {
  try {
    const { data, error } = await client
      .from("profile")
      .select("name")
      .eq("id", row.user_id);

    if (error) {
      throw error;
    }

    if (data && data.length > 0) {
      viewDetails.postedBy = data[0].name;
      viewDetails.title = row.title;
      viewDetails.date = row.created_at;
      viewDetails.content = row.content;
      viewVisible.value = true;
    } else {
      throw new Error("Profile data not found for user_id:", row.user_id);
    }
  } catch (error) {
    console.error("Error fetching profile data:", error.message);
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
    }
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
  }
}

async function submitAnnouncement() {
  try {
    const {
      data: { user },
    } = await client.auth.getUser();
    if (!user) {
      throw new Error("User not found");
    }
    announcement.user_id = user.id;

    const { data, error } = await client
      .from("announcement")
      .insert([announcement]);
    if (error) {
      throw error;
    }

    addDialogVisible.value = false;
    await fetchAnnouncements(currentPage.value); // Refetch announcements to include the new one
  } catch (error) {
    console.error("Error adding new announcement:", error.message);
  }
}

onMounted(() => {
  fetchAnnouncements(currentPage.value);
  fetchUserProfile();
});

definePageMeta({
  layout: "navbar",
});
</script>
