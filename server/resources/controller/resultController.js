const mongoose = require("mongoose")
const Submission = require("../models/Submission")
const Topic = require("../models/Topic")
const ObjectId = mongoose.Types.ObjectId

const createResult = async (attempts, topic_id) => {
  try {
    let { answers, questions } = attempts
    let allquestions = await Topic.aggregate([
      {
        $match: { _id: ObjectId(topic_id) },
      },
      {
        $unset: [
          "_id",
          "name",
          "icon",
          "questions.stats",
          "questions.flag",
          "questions.verified",
        ],
      },
      {
        $unwind: "$questions",
      },
      {
        $match: {
          "questions._id": {
            $in: questions.map((id) => ObjectId(id)),
          },
        },
      },
      { $replaceRoot: { newRoot: "$questions" } },
    ])
    let sortQuestions = []
    for (let i = 0; i < questions.length; i++) {
      for (let j = 0; j < allquestions.length; j++) {
        if (
          JSON.stringify(allquestions[j]._id) === JSON.stringify(questions[i])
        ) {
          sortQuestions.push(allquestions[j])
          allquestions.splice(j, 1)
        }
      }
    }
    let finalResult = []
    for (let i = 0; i < answers.length; i++) {
      let crnQuestion = sortQuestions[i]
      let temp = {}
      temp.statement = crnQuestion.statement
      temp.source = crnQuestion.source
      temp.question_id = crnQuestion._id
      temp.outcome = answers[i].outcome
      temp.explanation = crnQuestion.explanation || " "
      if (answers[i].type === "SHORT") {
        temp.correct = crnQuestion.answer
        temp.response =
          answers[i].outcome === "SKIPPED" ? "skipped" : answers[i].response
      } else if (answers[i].type === "TF") {
        temp.correct = crnQuestion.correct
        temp.response =
          answers[i].outcome === "SKIPPED" ? "skipped" : answers[i].decision
      } else if (answers[i].type === "MCQ") {
        temp.response =
          answers[i].outcome === "SKIPPED"
            ? "skipped"
            : crnQuestion.options[answers[i].selected - 1].text
        crnQuestion.options.forEach(({ text, correct }) => {
          if (correct) {
            temp.correct = text
          }
        })
      }
      finalResult.push(temp)
    }
    return finalResult
  } catch (err) {
    return {
      error: true,
      err: `${err}`,
    }
  }
}

const getResults = async (req, res) => {
  let { attempt_id } = req.params
  let id = req.id
  if (attempt_id === undefined) {
    return res.status(400).json({
      error: true,
      message: "Send quiz id",
    })
  }
  try {
    let findedSubmission = await Submission.find(
      {
        $and: [
          { attempts: { $elemMatch: { _id: attempt_id } } },
          { user_id: id },
        ],
      },
      {
        "attempts.$": 1,
        topic_id: 1,
        _id: 0,
      }
    )
    if (!findedSubmission.length) {
      return res.status(400).json({
        error: true,
        message: "No Quiz Present",
      })
    }
    let [{ attempts, topic_id }] = findedSubmission
    let { answers, questions, isStatsUpdated } = attempts[0]
    let finalResult = await createResult(attempts[0], topic_id)
    let { error } = finalResult
    if (error) {
      return res.status(400).json({
        error: true,
        err: finalResult.err,
      })
    }
    if (isStatsUpdated) {
      return res.status(200).json({
        error: false,
        result: finalResult,
      })
    } else {
      let specificAnswer = answers
      let cumulativeStat = {
        alotted: specificAnswer.length,
        time: 0,
        correct: 0,
        wrong: 0,
        skipped: 0,
      }
      let answerAndId = specificAnswer.map(async (answer, index) => {
        let outcome = answer.outcome.toLowerCase()
        cumulativeStat[outcome] += 1
        cumulativeStat.time += Number(answer.time)
        let id = questions[index]
        let whichToUpdate = `questions.$.stats.${outcome}`
        const questionData = await Topic.findOneAndUpdate(
          { questions: { $elemMatch: { _id: id } } },
          { $inc: { "questions.$.stats.alloted": 1, [whichToUpdate]: 1 } }
        )
        return questionData
      })
      await Promise.all(answerAndId)
      await Submission.findOneAndUpdate(
        {
          $and: [
            { attempts: { $elemMatch: { _id: attempt_id } } },
            { user_id: id },
          ],
        },
        {
          $inc: {
            "stats.alloted": cumulativeStat.alotted,
            "stats.skipped": cumulativeStat.skipped,
            "stats.correct": cumulativeStat.correct,
            "stats.wrong": cumulativeStat.wrong,
            "attempts.$.stats.alloted": cumulativeStat.alotted,
            "attempts.$.stats.skipped": cumulativeStat.skipped,
            "attempts.$.stats.correct": cumulativeStat.correct,
            "attempts.$.stats.wrong": cumulativeStat.wrong,
            "attempts.$.stats.time": cumulativeStat.time,
          },
          $set: {
            "attempts.$.isStatsUpdated": true,
          },
        }
      )
      return res.status(200).json({
        error: false,
        result: finalResult,
      })
    }
  } catch (err) {
    return res.status(400).json({
      error: true,
      message: "Something Went Wrong",
      err: `${err}`,
    })
  }
}

// get all attempt results data for a particular topic for a user
const getResultsTopicwise = async (req, res) => {
  let { topic_id } = req.params
  let user_id = req.id

  // checking for topic id in request
  if (topic_id === undefined) {
    return res(400).json({
      error: true,
      message: "Send topic id",
    })
  }

  // validate mongo id
  if (!mongoose.Types.ObjectId.isValid(topic_id)) {
    return res.status(400).json({
      error: true,
      message: "Invalid topic id",
    })
  }

  try {
    // check if it's a valid topic id
    const find_topic = await Topic.find(
      { _id: topic_id },
      { _id: true, name: true }
    )
      .lean()
      .exec()
    if (find_topic.length === 0) {
      return res.status(400).json({
        error: true,
        message: "No such topic id",
      })
    }

    // getting all attempts for particular topic from submissions
    let topic_attempts = await Submission.findOne(
      {
        $and: [{ topic_id: topic_id }, { user_id: user_id }],
      },
      {
        attempts: 1,
        _id: 0,
      }
    )
      .lean()
      .exec()

    // if no attempts, send user hadn't started any attempts
    if (topic_attempts === null) {
      return res.status(200).json({
        error: false,
        started_attempts: false,
        topic_attempt_stats: topic_attempts,
      })
    }
    // if attempts are present
    else {
      let all_attempt_status = topic_attempts.attempts.map((attempt) => {
        // to avoid error due to schema changes
        let time = "N/A"
        if (attempt.time_stamp) {
          // converting the gmt time to ist time in required format
          time = attempt.time_stamp.toLocaleString("en-GB", {
            timeZone: "Asia/Kolkata",
          })
        }

        let response = {
          attempt_id: attempt._id,
          correct: attempt.stats.correct,
          skipped: attempt.stats.skipped,
          incorrect: attempt.stats.wrong,
          total_questions: attempt.questions.length,
          date: time,
        }
        return response
      })

      // sending response
      return res.status(200).json({
        error: false,
        started_attempts: true,
        topic_attempt_stats: all_attempt_status,
      })
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Something went wrong",
      reason: `${error}`,
    })
  }
}

module.exports = {
  getResults,
  getResultsTopicwise,
}
