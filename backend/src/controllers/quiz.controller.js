const httpStatus = require("http-status");
const Quiz = require("../models/quiz.model");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { successfulResponse } = require("../utils/response");

exports.getQuizByUrlSegment = catchAsync(async (req, res, next) => {
  const { publishId } = req.params || {};

  const quiz = await Quiz.findOne({ publishId }).select("-questions.answers");
  if (!quiz) {
    return next(
      new AppError("No quiz found with this id", httpStatus.NOT_FOUND)
    );
  }

  return successfulResponse(res, { data: quiz });
});

exports.getQuizById = catchAsync(async (req, res, next) => {
  const { id } = req.params || {};
  const user = req.user._id;
  const quiz = await Quiz.findOne({ _id: id, user });
  if (!quiz) {
    return next(
      new AppError("No quiz found with this id", httpStatus.NOT_FOUND)
    );
  }
  return successfulResponse(res, { data: quiz });
});

exports.getMyQuizList = catchAsync(async (req, res, next) => {
  const { page, limit } = req.query;
  const user = req.user._id;
  const hasPagination = limit > 0 && page >= 0;

  const queries = Quiz.find({ user });
  const p1 = Quiz.find({ user }).count();
  if (hasPagination) {
    queries.skip(page * limit).limit(limit);
  }

  const p2 = await queries;
  const [count, quizzes] = await Promise.all([p1, p2]);

  return successfulResponse(res, {
    data: quizzes,
    length: quizzes.length,
    total: count,
    ...(hasPagination && { page }),
  });
});

exports.addNewQuiz = catchAsync(async (req, res) => {
  const payload = { ...req.body, user: req.user._id };
  delete payload.publishId;
  const quiz = new Quiz(payload);
  const savedQuiz = await quiz.save();
  return successfulResponse(res, { data: savedQuiz });
});

exports.updateQuiz = catchAsync(async (req, res, next) => {
  const { _id, ...payload } = req.body || {};
  const user = req.user._id;

  delete payload.publishId;

  const quizDoc = await Quiz.findOne({ _id, user });
  if (!quizDoc) {
    return next(
      new AppError("Couldn't find quiz with this id", httpStatus.NOT_FOUND)
    );
  }

  quizDoc.overwrite({ ...quizDoc.toObject(), ...payload, user });
  const updatedQuiz = await quizDoc.save();

  return successfulResponse(res, { data: updatedQuiz });
});

exports.deleteQuiz = catchAsync(async (req, res, next) => {
  const idList = req.body;
  const user = req.user._id;

  const { deletedCount } = await Quiz.deleteMany({
    _id: { $in: idList },
    user,
  });

  if (deletedCount !== idList.length) {
    return next(new AppError("Couldn't delete", httpStatus.NOT_FOUND));
  }

  return successfulResponse(res, { data: idList });
});

exports.getQuizMarks = catchAsync(async (req, res, next) => {
  const { publishId } = req.params || {};
  const userAnswers = req.body || {};

  const quiz = await Quiz.findOne({ publishId }).lean();
  if (!quiz) {
    return next(
      new AppError("No quiz found with this id", httpStatus.NOT_FOUND)
    );
  }

  if (quiz.questions.length !== Object.keys(userAnswers).length) {
    return next(
      new AppError("User must answer all the questions", httpStatus.BAD_REQUEST)
    );
  }

  quiz.questions.forEach(({ _id }) => {
    if (!userAnswers[_id]) {
      return next(
        new AppError("Incorrect question id", httpStatus.BAD_REQUEST)
      );
    }
    const quizOptions =
      quiz.questions.find((question) => question._id === _id.toString())
        ?.options ?? [];
    const optionSet = new Set(quizOptions.map((option) => option._id));
    const hasValidOptions = userAnswers[_id].every((_id) => optionSet.has(_id));
    if (!hasValidOptions) {
      return next(new AppError("Incorrect option id", httpStatus.BAD_REQUEST));
    }
  });

  try {
    const userAnswerMap = {};
    Object.entries(userAnswers).forEach(([questionId, answer]) => {
      userAnswerMap[questionId] = new Set(answer);
    });

    const correctAnswers = quiz.questions.reduce(
      (acc, question) =>
        acc +
        (question.answers.length === userAnswerMap[question._id]?.size &&
          question.answers.every((answer) =>
            userAnswerMap[question._id].has(answer)
          )),
      0
    );

    return successfulResponse(res, {
      data: {
        marks: correctAnswers,
        total: quiz.questions.length,
        message: `You answered ${correctAnswers}/${quiz.questions.length} questions correctly.`,
      },
    });
  } catch (error) {
    return next(
      new AppError(
        "Please provide answers in correct format",
        httpStatus.BAD_REQUEST
      )
    );
  }
});
