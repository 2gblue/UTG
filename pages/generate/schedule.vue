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
            :id="`cell-${scope.$index + 1}-${index + 1}`"
            style="height: auto"
          >
            <!-- Render content based on timetable array -->
            <div v-if="timetable[scope.$index * times.length + index + 1]">
              <p>
                <strong>{{
                  timetable[scope.$index * times.length + index + 1].courseCode
                }}</strong>
              </p>
              <p>
                {{
                  timetable[scope.$index * times.length + index + 1].courseName
                }}
              </p>
              <p>
                {{
                  timetable[scope.$index * times.length + index + 1].sectionName
                }}
              </p>
            </div>
            <div v-else>
              <!-- Default content for empty cells -->
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div id="timetable-info" style="margin: 15px"></div>
  </div>
  <br />
  <div class="middleTitle">
    <el-button type="primary" size="large">Export</el-button>
    <el-button type="warning" size="large" @click="generateTimetable"
      >Generate</el-button
    >
    <el-button type="info" size="large" @click="testGen"
      >Test Filling</el-button
    >
  </div>
  <div class="container">
    <h2 class="middleTitle">Chosen Courses</h2>
    <el-divider></el-divider>
    <div v-if="selectedCourses.length">
      <el-table :data="selectedCourses" stripe>
        <el-table-column prop="courseCode" label="Course Code" width="200" />
        <el-table-column prop="courseName" label="Course Name" />
        <el-table-column label="Sections">
          <template #default="scope">
            <div>
              <el-checkbox
                v-for="section in scope.row.sections"
                :key="section"
                :label="section"
                :value="section"
                :model-value="selectedSections[scope.row.id].includes(section)"
                @change="handleCheckboxChange(scope.row.id, section)"
              >
                {{ section }}
              </el-checkbox>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-else>
      <p>No courses selected.</p>
    </div>
  </div>
</template>

<style scoped>
@import url("../../assets/css/browse.css");
@import url("../../node_modules/boxicons/css/boxicons.min.css");
</style>

<script setup>
const client = useSupabaseClient();
const route = useRoute();
const selectedCourses = ref([]);
const selectedSections = ref({});
const timetable = ref(Array(26).fill(null));
const times = ["0800-1000", "1000-1200", "1200-1400", "1400-1600", "1600-1800"];
const days = ["MON", "TUE", "WED", "THUR", "FRI"];
const tableData = ref(days.map((day) => ({ time: day })));

async function retrieveJSON() {
  const queryCourses = route.query.selectedCourses;
  if (queryCourses) {
    try {
      const courseIds = queryCourses.split(",").map((id) => parseInt(id));
      const { data: courses, error: courseError } = await client
        .from("course")
        .select(
          "id, courseCode, courseName, exam, faculty:faculty_id(name), credit"
        )
        .in("id", courseIds);

      if (courseError) {
        console.error("Error fetching courses:", courseError.message);
      } else {
        for (const course of courses) {
          const { data: sections, error: sectionError } = await client
            .from("session")
            .select("sectionName")
            .eq("course_id", course.id)
            .order("sectionName", { ascending: true });
          if (sectionError) {
            console.error("Error fetching sections:", sectionError.message);
          } else {
            course.sections = sections.map((section) => section.sectionName);
            selectedSections.value[course.id] = [];
          }
        }
        selectedCourses.value = courses;
      }
    } catch (e) {
      console.error("Error processing selectedCourses:", e);
    }
  }
}

function handleCheckboxChange(courseId, section) {
  if (!selectedSections.value[courseId]) {
    selectedSections.value[courseId] = [];
  }
  const index = selectedSections.value[courseId].indexOf(section);
  if (index > -1) {
    selectedSections.value[courseId].splice(index, 1);
  } else {
    selectedSections.value[courseId].push(section);
  }
}

async function generateTimetable() {
  let resultArray = [];
  let skippedCourses = [];
  let validTimetableFound = false;
  const newTimetable = Array(26).fill(null);
  let skippedCoursesList = "";

  for (const course of selectedCourses.value) {
    const checkedSections = selectedSections.value[course.id] || [];
    const { data: sessions, error } = await client
      .from("session")
      .select("id, sectionName, lectureSession, labSession")
      .eq("course_id", course.id)
      .order("sectionName", { ascending: true });
    if (error) {
      console.error(
        `Error fetching sessions for course ${course.id}:`,
        error.message
      );
      continue;
    }

    if (checkedSections.length > 0) {
      const row = [course.id, course.courseCode, course.courseName];
      const sessionIdMap = new Map(
        sessions.map((session) => [session.sectionName, session])
      );
      const sortedCheckedSections = checkedSections.sort();
      sortedCheckedSections.forEach((sectionName) => {
        const session = sessionIdMap.get(sectionName);
        if (session) {
          row.push(session);
        }
      });

      resultArray.push(row);
    } else {
      console.warn(`No sections checked for course ${course.courseCode}`);
    }
  }

  function resetTimetable() {
    return Array(26).fill(null);
  }

  function isTimetableValid(timetable) {
    return timetable.every(
      (cell) => cell === null || (cell.sessionId && cell.courseCode)
    );
  }

  function tryFitCourse(resultArray, index, timetable) {
    if (index >= resultArray.length) {
      return isTimetableValid(timetable);
    }

    const courseSessions = resultArray[index];
    let sessionAdded = false;

    for (let i = 3; i < courseSessions.length; i++) {
      const session = courseSessions[i];
      const lectureCellId = session.lectureSession;
      const labCellId = session.labSession;

      const canAddLecture =
        lectureCellId == null ||
        (lectureCellId >= 1 &&
          lectureCellId <= 25 &&
          !timetable[lectureCellId]);
      const canAddLab =
        labCellId == null ||
        (labCellId >= 1 && labCellId <= 25 && !timetable[labCellId]);

      if (canAddLecture && canAddLab) {
        if (
          lectureCellId != null &&
          lectureCellId >= 1 &&
          lectureCellId <= 25
        ) {
          timetable[lectureCellId] = {
            courseId: courseSessions[0],
            courseCode: courseSessions[1],
            courseName: courseSessions[2],
            sessionId: session.id,
            sectionName: session.sectionName,
            sessionType: "Lecture",
          };
        }
        if (labCellId != null && labCellId >= 1 && labCellId <= 25) {
          timetable[labCellId] = {
            courseId: courseSessions[0],
            courseCode: courseSessions[1],
            courseName: courseSessions[2],
            sessionId: session.id,
            sectionName: session.sectionName,
            sessionType: "Lab",
          };
        }
        sessionAdded = true;

        if (tryFitCourse(resultArray, index + 1, timetable)) {
          return true;
        }
        // Reset if not valid
        timetable[lectureCellId] = null;
        timetable[labCellId] = null;
      }
    }
    skippedCourses.push(courseSessions[0]);
    return false;
  }

  // Fitting all courses
  let finalTimetable = resetTimetable();

  if (tryFitCourse(resultArray, 0, finalTimetable)) {
    validTimetableFound = true;
  } else {
    console.warn(
      "No valid timetable configuration found. Attempting to skip problematic courses."
    );
    const initialResultArray = [...resultArray];
    const initialSkippedCourses = [...skippedCourses];
    skippedCourses.length = 0;
    resultArray = resultArray.filter(
      (_, index) => !skippedCourses.includes(index)
    );
    finalTimetable = resetTimetable();
    if (tryFitCourse(resultArray, 0, finalTimetable)) {
      validTimetableFound = true;
    } else {
      resultArray = initialResultArray;
      skippedCourses = initialSkippedCourses;
    }
  }

  const timetableInfoDiv = document.getElementById("timetable-info");

  if (validTimetableFound) {
    timetable.value = finalTimetable;
    const totalCreditHours = selectedCourses.value.reduce((total, course) => {
      const courseSessions = resultArray.find((row) => row[0] === course.id);
      if (courseSessions) {
        return total + (course.credit || 0);
      }
      return total;
    }, 0);
    timetableInfoDiv.innerHTML = `Total Credit Hours: ${totalCreditHours}`;
  } else {
    timetable.value = finalTimetable;
    timetableInfoDiv.innerHTML =
      "Failed to generate a valid timetable.<br /><br />Skipped Courses:";

    // Append skipped courses to the info div
    if (skippedCourses.length > 0) {
      skippedCoursesList = skippedCourses
        .map((courseId) => `Course ID: ${courseId}`)
        .join("<br />");
      timetableInfoDiv.innerHTML += `<br />${skippedCoursesList}`;
    }
  }
  console.log(timetable.value);
}

async function testGen() {
  // Clear the timetable to ensure no old data remains
  const newTimetable = Array(26).fill(null);
  for (const course of selectedCourses.value) {
    const checkedSections = selectedSections.value[course.id] || [];
    const { data: sessions, error } = await client
      .from("session")
      .select("id, sectionName, lectureSession, labSession")
      .eq("course_id", course.id);

    if (error) {
      console.error(
        `Error fetching sessions for course ${course.id}:`,
        error.message
      );
      continue;
    }
    // Map sectionName to session details
    const sessionMap = new Map(sessions.map((s) => [s.sectionName, s]));
    checkedSections.forEach((sectionName) => {
      const session = sessionMap.get(sectionName);
      if (session) {
        // Assuming lectureSession and labSession are indices [1-25]
        const lectureCellId = session.lectureSession;
        const labCellId = session.labSession;
        // Populate timetable with course details and session ID
        if (lectureCellId >= 1 && lectureCellId <= 25) {
          newTimetable[lectureCellId] = {
            courseId: course.id,
            courseCode: course.courseCode, // Correctly access course details
            courseName: course.courseName, // Correctly access course details
            sessionId: session.id,
            sectionName: sectionName,
            sessionType: "Lecture",
          };
        }

        if (labCellId >= 1 && labCellId <= 25) {
          newTimetable[labCellId] = {
            courseId: course.id,
            courseCode: course.courseCode, // Correctly access course details
            courseName: course.courseName, // Correctly access course details
            sessionId: session.id,
            sectionName: sectionName,
            sessionType: "Lab",
          };
        }
      }
    });
  }
  // Update the timetable ref
  timetable.value = newTimetable;
  console.log(timetable.value);
}

onMounted(() => {
  retrieveJSON();
});

definePageMeta({
  layout: "navbar",
});
</script>
