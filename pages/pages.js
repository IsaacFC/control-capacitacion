const express = require('express');
const pageProfile = require('../controllers/pageController/pageProfile');
const pageUsers = require('../controllers/pageController/pageUsers');
const pageCourses = require('../controllers/pageController/pageCourses');
const pageMyCourses = require('../controllers/pageController/pageMyCourses');
const pageInstructorCourses = require('../controllers/pageController/pageInstructorCourses');
const pageEnrollment = require('../controllers/pageController/pageEnrollment');
//const pageFiles = require('../controllers/pageController/pageFiles');
const pageCharts = require('../controllers/pageController/pageCharts');

const router = express.Router();
///////////////////////////////////////////////////
//                   MI PERFIL                   //
///////////////////////////////////////////////////
router.get("/profile-config", pageProfile.getProfileData);

///////////////////////////////////////////////////
//           GESTION DE USUARIOS                 //
///////////////////////////////////////////////////
/* ADMIN: VER USUARIOS */
router.get("/users-overview", pageUsers.getUsers);

/* ADMIN: OBTENER DATOS DE UN USUARIO */
router.get("/get-user-data/:tagId", pageUsers.getUserByRfc);

///////////////////////////////////////////////////
//               GESTION DE CURSOS               //
///////////////////////////////////////////////////
/* ADMIN: VER CURSOS */
router.get("/courses-overview", pageCourses.getCourses);

/* ADMIN: OBTENER DATOS DE UN CURSO */
router.get("/get-course-data/:tagId", pageCourses.getCourseByGroup);

/* ADMIN: OBTENER INSTRUCTORES DISPONIBLES PARA UN CURSO */
router.get("/courses-overview/ac-instructors", pageCourses.getInstructor);

///////////////////////////////////////////////////
//               INCRIPCIONES                    //
///////////////////////////////////////////////////
/* CUALQUIER USUARIO: OBTENER CURSOS DISPONIBLES PARA INSCRIPCION */
router.get("/course-enrollment", pageEnrollment.getEnrollmentCourses);

/* CUALQUIER USUARIO: OBTENER DATOS DEL CURSO PARA INSCRIBIRSE */
router.get("/enrollment-form/:tagId", pageEnrollment.getEnrollmentForm);

///////////////////////////////////////////////////
//                    MIS CURSOS               //
///////////////////////////////////////////////////
/* CUALQUIER USUARIO: VER CURSOS A LOS QUE ESTA INSCRITO */
router.get("/mycourses", pageMyCourses.getMyCourses);

/* CUALQUIER USUARIO: VERIFICA DATOS PARA PODER EVALUAR DOCENTE */
router.get("/course-evaluation-form/:tagId", pageMyCourses.getCourseEvaluationInfo);

/* CUALQUIER USUARIO: OBTIENE LA OPCION PARA REGISTRAR ASISTENCIA */
router.get("/attendance-partaker/:tagId", pageMyCourses.getAttendanceInfo);

///////////////////////////////////////////////////
//            MIS CURSOS (INSTRUCTOR)            //
///////////////////////////////////////////////////
router.get("/instructor-courses", pageInstructorCourses.getInstructorCourses);

router.get("/attendance-menu-instructor/:tagId", pageInstructorCourses.getAttendanceInstructorInfo);

router.get("/partakers-list/:tagId", pageInstructorCourses.getPartakersList);

router.get("/attendance-instructor/:group/:date", pageInstructorCourses.getGroupAttendanceList);

router.get("/grades-list/:grupo", pageInstructorCourses.getGradesList);

///////////////////////////////////////////////////
//            VER ARCHIVOS                       //
///////////////////////////////////////////////////
//router.get("/files", pageFiles.getDocuments);

///////////////////////////////////////////////////
//               ESTADISTICAS                    //
///////////////////////////////////////////////////
router.get("/charts-courses", pageCharts.getCoursesCharts);

router.get("/charts-partakers", pageCharts.getPartakersCharts);

module.exports = router;