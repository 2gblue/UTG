<template>
  <div class="print-container">
    <h1>Generated Timetable</h1>
    <table class="timetable-table">
      <thead>
        <tr>
          <th></th>
          <th v-for="(time, index) in times" :key="index">{{ time }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(day, dayIndex) in days" :key="dayIndex">
          <td>{{ day }}</td>
          <td v-for="(time, timeIndex) in times" :key="timeIndex">
            <div v-if="timetable[dayIndex * times.length + timeIndex]">
              <p>
                <strong>{{
                  timetable[dayIndex * times.length + timeIndex].courseCode
                }}</strong>
              </p>
              <p>
                {{ timetable[dayIndex * times.length + timeIndex].courseName }}
              </p>
              <p>
                {{ timetable[dayIndex * times.length + timeIndex].sectionName }}
              </p>
            </div>
            <div v-else>
              <!-- Default content for empty cells -->
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="course-details">
      <h2>Course List</h2>
      <ul>
        <li
          v-for="(course, index) in courseList"
          :key="index"
          class="course-item"
        >
          <span class="course-code">{{ course.courseCode }}</span>
          <span class="course-name">{{ course.courseName }}</span>
          <span class="section-name">{{ course.sectionName }}</span>
          <span class="credit">{{ course.credit }} Credits</span>
        </li>
      </ul>
      <p>
        <strong>Total Credits: {{ totalCredit }}</strong>
      </p>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const client = useSupabaseClient();
const timetable = ref(Array(25).fill(null));
const courseList = ref([]);
const totalCredit = ref(0);

const times = ["0800-1000", "1000-1200", "1200-1400", "1400-1600", "1600-1800"];
const days = ["MON", "TUE", "WED", "THUR", "FRI"];

async function fetchTimetableData() {
  const timetableQuery = route.query.timetable;
  if (timetableQuery) {
    const sessionIds = JSON.parse(timetableQuery);
    const timetableData = await Promise.all(
      sessionIds.map(async (sessionId) => {
        const { data: session, error } = await client
          .from("session")
          .select(
            "id, sectionName, course:course_id(courseCode, courseName, credit), lectureSession, labSession"
          )
          .eq("id", sessionId)
          .single();

        if (error) {
          console.error(
            `Error fetching session with id ${sessionId}:`,
            error.message
          );
          return null;
        }
        return {
          ...session,
          courseCode: session.course.courseCode,
          courseName: session.course.courseName,
          credit: session.course.credit,
        };
      })
    );

    const seenCourses = new Set();
    timetableData.forEach((session) => {
      if (session) {
        if (session.lectureSession) {
          const index = session.lectureSession - 1;
          timetable.value[index] = {
            courseCode: session.courseCode,
            courseName: session.courseName,
            sectionName: session.sectionName,
          };
          if (!seenCourses.has(session.courseCode)) {
            courseList.value.push({
              courseCode: session.courseCode,
              courseName: session.courseName,
              sectionName: session.sectionName,
              credit: session.credit,
            });
            seenCourses.add(session.courseCode);
          }
        }
        if (session.labSession) {
          const index = session.labSession - 1;
          timetable.value[index] = {
            courseCode: session.courseCode,
            courseName: session.courseName,
            sectionName: session.sectionName,
          };
          if (!seenCourses.has(session.courseCode)) {
            courseList.value.push({
              courseCode: session.courseCode,
              courseName: session.courseName,
              sectionName: session.sectionName,
              credit: session.credit,
            });
            seenCourses.add(session.courseCode);
          }
        }
      }
    });

    totalCredit.value = courseList.value.reduce(
      (acc, course) => acc + course.credit,
      0
    );
  }
}

onMounted(async () => {
  await fetchTimetableData();
  print();
});

function print() {
  window.print();
}
</script>

<style scoped>
@import url("../../assets/css/print.css");
</style>
