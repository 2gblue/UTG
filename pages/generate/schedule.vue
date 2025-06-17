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
            :class="{
              blocked:
                timetable[scope.$index * times.length + index + 1]?.isBlocked,
            }"
            style="
              height: auto;
              cursor: pointer;
              padding: 5px;
              text-align: center;
            "
            @click="toggleBlockedCell(scope.$index, index)"
          >
            <!-- Render content based on timetable array -->
            <div
              v-if="
                timetable[scope.$index * times.length + index + 1]?.isBlocked
              "
            >
              <em>Blocked</em>
            </div>
            <div v-else-if="timetable[scope.$index * times.length + index + 1]">
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
    <el-button type="primary" size="large" @click="exportToPDF"
      >Export</el-button
    >
    <el-button type="warning" size="large" @click="generateTimetable"
      >Generate</el-button
    >
    <el-button type="danger" size="large" @click="clearAllCheckbox"
      >Clear All</el-button
    >
  </div>
  <div class="container">
    <h2 class="middleTitle">Chosen Courses</h2>
    <el-divider></el-divider>
    <div v-if="selectedCourses.length">
      <el-table :data="selectedCourses" stripe>
        <el-table-column prop="courseCode" label="Course Code" width="150" />
        <el-table-column prop="courseName" label="Course Name">
          <template #default="scope">
            <a
              :href="`/courses/${scope.row.id}`"
              target="_blank"
              rel="noopener noreferrer"
              style="color: #008fa6; text-decoration: none"
            >
              {{ scope.row.courseName }}
            </a>
          </template>
        </el-table-column>
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
      const courseIds = queryCourses.split(",").map((id) => parseInt(id, 10));
      const courseIdMap = courseIds.reduce((map, id, index) => {
        map[id] = index;
        return map;
      }, {});

      const { data: courses, error: courseError } = await client
        .from("course")
        .select(
          "id, courseCode, courseName, exam, faculty:faculty_id(name), credit"
        )
        .in("id", courseIds);

      if (courseError) {
        console.error("Error fetching courses:", courseError.message);
      } else {
        // Reorder the courses
        const orderedCourses = courses.sort(
          (a, b) => courseIdMap[a.id] - courseIdMap[b.id]
        );

        for (const course of orderedCourses) {
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
        selectedCourses.value = orderedCourses;
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

function toggleBlockedCell(rowIndex, colIndex) {
  const cellIndex = rowIndex * times.length + colIndex + 1;
  const current = timetable.value[cellIndex];
  if (!current) {
    timetable.value[cellIndex] = { isBlocked: true };
  } else if (current.isBlocked) {
    timetable.value[cellIndex] = null;
  }
}

function isAvailable(cellId) {
  const cell = timetable.value[cellId];
  return (
    cell == null || // empty
    (typeof cell === "object" && !cell.isBlocked && !cell.sessionId) // not blocked, not occupied
  );
}

async function generateTimetable() {
  let resultArray = [];
  let skippedCourses = [];
  let validTimetableFound = false;
  let skippedCoursesList = "";

  const newTimetable = Array(26).fill(null);
  timetable.value.forEach((cell, idx) => {
    if (cell?.isBlocked) {
      newTimetable[idx] = { isBlocked: true };
    }
  });

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

  if (tryFitCourse(resultArray, 0, newTimetable, skippedCourses)) {
    validTimetableFound = true;
    timetable.value = newTimetable;
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

    const retryTimetable = Array(26).fill(null);
    timetable.value.forEach((cell, idx) => {
      if (cell?.isBlocked) {
        retryTimetable[idx] = { isBlocked: true };
      }
    });

    if (tryFitCourse(resultArray, 0, retryTimetable, skippedCourses)) {
      validTimetableFound = true;
      timetable.value = retryTimetable;
    } else {
      resultArray = initialResultArray;
      skippedCourses = initialSkippedCourses;
      timetable.value = retryTimetable;
    }
  }

  const timetableInfoDiv = document.getElementById("timetable-info");

  if (validTimetableFound) {
    const totalCreditHours = selectedCourses.value.reduce((total, course) => {
      const courseSessions = resultArray.find((row) => row[0] === course.id);
      if (courseSessions) {
        return total + (course.credit || 0);
      }
      return total;
    }, 0);
    timetableInfoDiv.innerHTML = `Total Credit Hours: ${totalCreditHours}`;
  } else {
    timetableInfoDiv.innerHTML =
      "Failed to generate a valid timetable.<br /><br /><u>Skipped Courses:</u>";

    if (skippedCourses.length > 0) {
      const uniqueSkippedCourses = [
        ...new Set(
          skippedCourses.map((courseId) => {
            const course = selectedCourses.value.find((c) => c.id === courseId);
            return course ? course.courseName : `Course ID: ${courseId}`;
          })
        ),
      ];
      skippedCoursesList = uniqueSkippedCourses.join("<br />");
      timetableInfoDiv.innerHTML += `<br />${skippedCoursesList}`;
    }
  }
}

function tryFitCourse(resultArray, index, timetable, skippedCourses) {
  if (index >= resultArray.length) {
    return true;
  }

  const courseSessions = resultArray[index];
  let sessionAdded = false;

  for (let i = 3; i < courseSessions.length; i++) {
    const session = courseSessions[i];
    const lectureCellId = session.lectureSession;
    const labCellId = session.labSession;

    // Check if the session times are available
    const isLectureTimeAvailable =
      lectureCellId == null ||
      (lectureCellId >= 1 && lectureCellId <= 25 && !timetable[lectureCellId]);

    const isLabTimeAvailable =
      labCellId == null ||
      (labCellId >= 1 && labCellId <= 25 && !timetable[labCellId]);

    if (!isLectureTimeAvailable || !isLabTimeAvailable) {
      continue;
    }

    // Add the session if times are available
    if (lectureCellId != null && lectureCellId >= 1 && lectureCellId <= 25) {
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

    if (tryFitCourse(resultArray, index + 1, timetable, skippedCourses)) {
      return true;
    }

    if (lectureCellId != null) timetable[lectureCellId] = null;
    if (labCellId != null) timetable[labCellId] = null;
  }

  if (!sessionAdded) {
    skippedCourses.push(courseSessions[0]);
  }
  return false;
}

function exportToPDF() {
  const timetableData = JSON.stringify(
    timetable.value
      .filter((entry) => entry !== null)
      .map((entry) => entry.sessionId)
  );
  const url = new URL("/generate/print", window.location.origin);
  url.searchParams.set("timetable", timetableData);
  window.open(url.toString(), "_blank");
}

function clearAllCheckbox() {
  Object.keys(selectedSections.value).forEach((courseId) => {
    selectedSections.value[courseId] = [];
  });
  timetable.value = Array(26).fill(null);
  const timetableInfoDiv = document.getElementById("timetable-info");
  if (timetableInfoDiv) {
    timetableInfoDiv.innerHTML = "";
  }
}

onMounted(() => {
  retrieveJSON();
});

definePageMeta({
  layout: "navigation",
});
</script>
