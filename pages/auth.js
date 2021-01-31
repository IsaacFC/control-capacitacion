// auth Controller
const authCourses = require('../controllers/authController/authCourses');
const authMyCourses = require('../controllers/authController/authMyCourses');
const authInstructorCourses = require('../controllers/authController/authInstructorCourses');
const authLogin = require('../controllers/authController/authLogin');
const authUsers = require('../controllers/authController/authUsers');
const authProfile = require('../controllers/authController/authProfile');
const authEnrollment = require('../controllers/authController/authEnrollment');
const authDoc = require('../controllers/authController/authDoc');

var router = require('express').Router();


// utilizar router.POST para subir datos
// el primer parametro es lo mismo a "/auth/register"

///////////////////////////////////////////////////
//                   LOGIN                       //
///////////////////////////////////////////////////
router.post("/login",  authLogin.login);

///////////////////////////////////////////////////
//            ADMIN: USUARIOS                    //
///////////////////////////////////////////////////
router.post("/register-users",  authUsers.registerUser);

router.put("/modify-users", authUsers.modifyUser);

router.delete("/delete-user/:tagId",  authUsers.deleteUser);

router.put("/restore-password/:tagId", authUsers.restoreUserPassword);

///////////////////////////////////////////////////
//            CONFIG MI PERFIL                   //
///////////////////////////////////////////////////
router.post("/profile-config",  authProfile.updateUserConfig);

router.post("/change-password",  authProfile.changePassword);


///////////////////////////////////////////////////
//            ADMIN: CURSOS                      //
///////////////////////////////////////////////////
router.post("/register-courses",  authCourses.registerCourses);

router.put("/modify-courses", authCourses.modifyCourse);

router.delete("/delete-course/:tagId", authCourses.deleteCourse);

router.get("/courses-filename", authDoc.fileCoursesList);

router.get("/courses-download", authDoc.downloadCourses);

///////////////////////////////////////////////////
//            INSCRIBIRSE                        //
///////////////////////////////////////////////////
router.post("/enroll-student",  authEnrollment.enrollStudent, authDoc.getCedulaInscripcion);

///////////////////////////////////////////////////
//          EVALUAR AL DOCENTE                   //
///////////////////////////////////////////////////
router.post("/course-evaluation-form/:tagId", authDoc.fillEvaluacionDocente);

///////////////////////////////////////////////////////////////////////////
//      MIS CURSOS: ASISTENCIA, DAR DE BAJA, DESCARGAR CEDULA            //
///////////////////////////////////////////////////////////////////////////
router.post("/attendance-partaker/:tagId", authMyCourses.setAttendance);

router.post("/unsubscribe-course/:tagId", authMyCourses.unsubscribeCourse);

router.get("/mycourse-download/:tagId", authMyCourses.downloadCedula);

router.get("/mycourse-filename/:tagId", authMyCourses.sendFileName);

//////////////////////////////////////////////////////////////////////////////
//      INSTRUCTOR: TOMAR ASISTENCIA, CALIFICAR, DESCARGAR ASISTENCIA       //
//////////////////////////////////////////////////////////////////////////////
router.put("/attendance-instructor/set-attendance/:grupo/:fecha/:rfc", authInstructorCourses.updatePartakerAttendance);

router.put("/grades-list/:grupo/:rfc", authInstructorCourses.setGrades);

router.get("/instructorcourses-filename/:group", authDoc.sendFileName);

router.get("/instructorcourses-download/:group", authDoc.downloadAttendanceList);


module.exports = router;