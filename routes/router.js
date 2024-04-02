const express = require('express')
const requireDir = require('require-dir')

const auth = require('../utils/authClient')

const router = express.Router()
const usersRouter = express.Router({ mergeParams: true })
const proposalsRouter = express.Router({ mergeParams: true })
const forumsRouter = express.Router({ mergeParams: true })

const usersController = requireDir('./users')
const proposalsController = requireDir('./proposals')
const forumsController = requireDir('./forums')

// USERS endpoints
router
  .route('/users/banned', usersRouter)
  .get(usersController.getBannedUsers.getBannedUsers)

router
  .route('/users/general', usersRouter)
  .get(usersController.getGeneralUsers.getGeneralUsers)

router
  .route('/users/ban/:uid', usersRouter)
  .patch(usersController.banUser.banUser)

router
  .route('/proposals-by-user/:uid', usersRouter)
  .get(usersController.getProposalsCreatedByUser.getProposalsCreatedByUser)

router
  .route('/users/revoke-ban/:uid', usersRouter)
  .patch(usersController.revokeUserBan.revokeUserBan)

// PROPOSALS endpoints

router
  .route('/approved-proposals', proposalsRouter)
  .get(proposalsController.getApprovedProposals.getApprovedProposals)
router
  .route('/pending-proposals', proposalsRouter)
  .get(
    proposalsController.getRejectedInReviewProposals
      .getRejectedInReviewProposals
  )

router
  .route('/proposal-tags', proposalsRouter)
  .get(proposalsController.getProposalTags.getProposalTags)

router
  .route('/proposals/approve/:pid', proposalsRouter)
  .patch(proposalsController.approveProposal.approveProposal)

router
  .route('/proposals/reject/:pid', proposalsRouter)
  .patch(proposalsController.rejectProposal.rejectProposal)

router
  .route('/proposals/request-review/:pid', proposalsRouter)
  .patch(proposalsController.requestProposalReview.requestProposalReview)

// FORUMS endpoints

router.route('/forums', forumsRouter).get(forumsController.getForums.getForums)
router
  .route('/reported-forums', forumsRouter)
  .get(forumsController.getReportedForums.getReportedForums)

router
  .route('/deleted-forums', forumsRouter)
  .get(forumsController.getDeletedForums.getDeletedForums)
router
  .route('/forums/delete', forumsRouter)
  .delete(forumsController.permanentlyDeleteForums.permanentlyDeleteForums)

router
  .route('/forums/pin/:fid', forumsRouter)
  .patch(forumsController.pinForum.pinForum)

router
  .route('/forums/un-pin/:fid', forumsRouter)
  .patch(forumsController.unPinForum.unPinForum)

router
  .route('/forums/delete/:fid', forumsRouter)
  .patch(forumsController.flagForumForDeletion.flagForumForDeletion)
router
  .route('/forums/edit/:fid', forumsRouter)
  .patch(forumsController.editForumById.editForumById)

router
  .route('/deleted-comments', forumsRouter)
  .get(forumsController.getDeletedComments.getDeletedComments)
router
  .route('/comments/delete', forumsRouter)
  .delete(forumsController.permanentlyDeleteComments.permanentlyDeleteComments)
router
  .route('/reported-comments', forumsRouter)
  .get(forumsController.getReportedComments.getReportedComments)

module.exports = router
