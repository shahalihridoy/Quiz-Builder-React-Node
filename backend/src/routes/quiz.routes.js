const express = require("express");
const { protectRoute } = require("../middlewares/auth");
const quizController = require("../controllers/quiz.controller");
const rateLimiter = require("../middlewares/rateLimiter");

const router = express.Router();

router
  .route("/test/:publishId")
  .get(quizController.getQuizByUrlSegment)
  .post(rateLimiter, quizController.getQuizMarks);
router.route("/:id").get(protectRoute, quizController.getQuizById);

router
  .route("/")
  .get(protectRoute, quizController.getMyQuizList)
  .post(protectRoute, quizController.addNewQuiz)
  .put(protectRoute, quizController.updateQuiz)
  .delete(protectRoute, quizController.deleteQuiz);

module.exports = router;
