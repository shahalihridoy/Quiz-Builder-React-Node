/* eslint-disable no-use-before-define */
const httpStatus = require("http-status");
const mongoose = require("mongoose");
const AppError = require("../utils/appError");
const { generateAlphaNumericId } = require("../utils/helper");

const { Schema } = mongoose;

const arrayLengthValidator = (min, max) => (value) => {
  const length = value?.length ?? 0;
  if (length < min || length > max) {
    return false;
  }
  return true;
};

const OptionSchema = {
  _id: {
    type: String,
    required: true,
    maxlength: [36, "`_id` must not be more than 36 characters"],
  },
  value: {
    type: String,
    required: true,
    trim: true,
    maxlength: [520, "`value` must not be more than 520 characters"],
  },
};

const AnswerSchema = {
  type: String,
  required: true,
  maxlength: [36, "`answers` must not be more than 36 characters"],
};

const QuestionSchema = {
  _id: {
    type: String,
    required: true,
    maxlength: [36, "`_id` must not be more than 36 characters"],
  },
  question: {
    type: String,
    required: true,
    trim: true,
    maxlength: [520, "`question` must not be more than 520 characters"],
  },
  answers: {
    type: [AnswerSchema],
    required: true,
    validate: [arrayLengthValidator(1, 5), "`answers` length must be 1 to 5"],
  },
  options: {
    type: [{ type: OptionSchema, required: true }],
    required: true,
    validate: [arrayLengthValidator(1, 5), "`options` length must be 1 to 5"],
  },
  isMultipleChoice: {
    type: Boolean,
    default: false,
  },
};

const QuizSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [520, "`title` must not be more than 520 characters"],
    },
    published: {
      type: Boolean,
      default: false,
    },
    questions: {
      type: [{ type: QuestionSchema, required: true }],
      required: true,
      validate: [
        arrayLengthValidator(1, 10),
        "`questions` length must be 1 to 10",
      ],
    },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    publishId: String,
  },
  {
    timestamps: true,
  }
);

QuizSchema.pre("save", async function (next) {
  const { questions } = this;
  const questionIdSet = new Set();
  const updatedQuestions = [];

  // check if question answers id exist in options
  const hasValidAnswers = questions.every((question) => {
    const { options, answers, _id } = question;
    questionIdSet.add(_id);

    // check if options has unique id
    const optionSet = new Set(options.map((option) => option._id));
    if (optionSet.size !== options.length) {
      return next(
        new AppError("Provide unique id to each option", httpStatus.BAD_REQUEST)
      );
    }

    // set multiple choice field based on answers length
    question.isMultipleChoice = answers.length > 1;
    updatedQuestions.push(question);

    return answers.every((answer) => optionSet.has(answer));
  });

  if (!hasValidAnswers) {
    return next(
      new AppError("Invalid question answers", httpStatus.BAD_REQUEST)
    );
  }

  if (questionIdSet.size !== questions.length) {
    return next(
      new AppError("Provide unique id to each question", httpStatus.BAD_REQUEST)
    );
  }

  // set multiple choice field if answer is more than one
  this.questions = updatedQuestions;

  // prevent update for published quiz
  if (this.publishId) {
    return next(
      new AppError(
        "Can't update quiz after it is published",
        httpStatus.FORBIDDEN
      )
    );
  }

  // generate publish id if quiz is published
  if (this.published) {
    let segmentExists = true;
    do {
      const publishId = generateAlphaNumericId();
      this.publishId = publishId;
      // eslint-disable-next-line no-await-in-loop
      segmentExists = await Quiz.exists({ publishId });
    } while (segmentExists);
  }
  next();
});

const Quiz = mongoose.model("Quiz", QuizSchema);
module.exports = Quiz;
