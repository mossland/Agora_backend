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
  .route('/agora-activity', usersRouter)
  .get(usersController.getAgoraRecentActivity.getAgoraRecentActivity)
router
  .route('/user-activity-admin/:uid', usersRouter)
  .get(usersController.getUserActivityForAdminView.getUserActivityForAdminView)
router
  .route('/login', usersRouter)
  .post(usersController.login.login)

router
  .route('/login-admin', usersRouter)
  .post(usersController.adminUiLogin.adminUiLogin)

router
  .route('/user/:uid', usersRouter)
  .get(usersController.getUserById.getUserById)

router
  .route('/users/non-admin', usersRouter)
  .get(usersController.getNonAdminUsers.getNonAdminUsers)

router
  .route('/users/admin', usersRouter)
  .get(usersController.getAdminUsers.getAdminUsers)

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
  .route('/users/edit-nickname/:uid', usersRouter)
  .patch(usersController.editUserNickname.editUserNickname)
router
  .route('/users/edit-pfp/:uid', usersRouter)
  .patch(usersController.editUserPFP.editUserPFP)
router
  .route('/proposals-by-user/:uid', usersRouter)
  .get(usersController.getProposalsCreatedByUser.getProposalsCreatedByUser)

router
  .route('/votes-by-user/:uid', proposalsRouter)
  .get(proposalsController.getVotesByUser.getVotesByUser)

router
  .route('/users/revoke-ban/:uid', usersRouter)
  .patch(usersController.revokeUserBan.revokeUserBan)

// PROPOSALS endpoints
router
  .route('/agora-highlights', proposalsRouter)
  .get(proposalsController.getAgoraHighlights.getAgoraHighlights)
router
  .route('/ongoing-proposals', proposalsRouter)
  .get(proposalsController.getOngoingProposals.getOngoingProposals)
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
  .route('/proposal-stats', proposalsRouter)
  .get(proposalsController.getProposalStats.getProposalStats)
router
  .route('/proposal-tags', proposalsRouter)
  .get(proposalsController.getProposalTags.getProposalTags)

router
  .route('/proposals/approve/:pid', proposalsRouter)
  .patch(proposalsController.approveProposal.approveProposal)
router
  .route('/proposals/withdraw/:pid', proposalsRouter)
  .patch(proposalsController.withdrawProposal.withdrawProposal)
router
  .route('/proposals/reject/:pid', proposalsRouter)
  .patch(proposalsController.rejectProposal.rejectProposal)
router
  .route('/proposals/edit/:pid', proposalsRouter)
  .patch(proposalsController.editProposalById.editProposalById)
router
  .route('/proposals/request-review/:pid', proposalsRouter)
  .patch(proposalsController.requestProposalReview.requestProposalReview)
router
  .route('/proposals/approved/:pid', proposalsRouter)
  .get(proposalsController.getApprovedProposalById.getApprovedProposalById)
router
  .route('/proposal-votes/:pid', proposalsRouter)
  .get(proposalsController.getProposalVotes.getProposalVotes)
router
  .route('/like-proposal/:pid/:uid', proposalsRouter)
  .patch(proposalsController.likeProposal.likeProposal)
router
  .route('/unlike-proposal/:pid/:uid', proposalsRouter)
  .patch(proposalsController.unlikeProposal.unlikeProposal)
router
  .route('/view-proposal/:pid', proposalsRouter)
  .patch(proposalsController.viewProposal.viewProposal)
router
  .route('/vote-proposal/:pid', proposalsRouter)
  .post(proposalsController.voteForProposal.voteForProposal)
router
  .route('/new-proposal', proposalsRouter)
  .post(proposalsController.postProposal.postProposal)
// FORUMS endpoints

router.route('/forums', forumsRouter).get(forumsController.getForums.getForums)
router.route('/agora-forums', forumsRouter).get(forumsController.getAgoraForums.getAgoraForums)
router.route('/agora-forums/:fid', forumsRouter).get(forumsController.getAgoraTopicById.getAgoraTopicById)
router.route('/agora-comments/:fid', forumsRouter).get(forumsController.getAgoraTopicCommentsById.getAgoraTopicCommentsById)
router.route('/forums/categories', forumsRouter).get(forumsController.getForumCategories.getForumCategories)
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
  .route('/forums/flag-for-deletion', forumsRouter)
  .patch(forumsController.flagForumsForDeletion.flagForumsForDeletion)

router
  .route('/forums/pin/:fid', forumsRouter)
  .patch(forumsController.pinForum.pinForum)

router
  .route('/forums/un-pin/:fid', forumsRouter)
  .patch(forumsController.unPinForum.unPinForum)
router
  .route('/forums/revive/:fid', forumsRouter)
  .patch(forumsController.reviveForum.reviveForum)
router
  .route('/forums/delete/:fid', forumsRouter)
  .patch(forumsController.flagForumForDeletion.flagForumForDeletion)
router
  .route('/forums/edit/:fid', forumsRouter)
  .patch(forumsController.editForumById.editForumById)
router
  .route('/comments/new', forumsRouter)
  .post(forumsController.postForumComment.postForumComment)
router
  .route('/deleted-comments', forumsRouter)
  .get(forumsController.getDeletedComments.getDeletedComments)
router
  .route('/comments/delete', forumsRouter)
  .delete(forumsController.permanentlyDeleteComments.permanentlyDeleteComments)
router
  .route('/comments/revive/:cid', forumsRouter)
  .patch(forumsController.reviveComment.reviveComment)

router
  .route('/comments/flag-for-deletion', forumsRouter)
  .patch(forumsController.flagCommentsForDeletion.flagCommentsForDeletion)
router
  .route('/reported-comments', forumsRouter)
  .get(forumsController.getReportedComments.getReportedComments)
router
  .route('/comments/report/:cid', forumsRouter)
  .patch(forumsController.reportForumComment.reportForumComment)
router
  .route('/forums/report/:fid', forumsRouter)
  .patch(forumsController.reportForum.reportForum)
router
  .route('/forums-by-user/:uid', forumsRouter)
  .get(forumsController.getForumsByUser.getForumsByUser)
router
  .route('/like-forum/:fid/:uid', forumsRouter)
  .patch(forumsController.likeForum.likeForum)
router
  .route('/unlike-forum/:fid/:uid', forumsRouter)
  .patch(forumsController.unLikeForum.unLikeForum)
router
  .route('/like-forum-comment/:cid/:uid', forumsRouter)
  .patch(forumsController.likeForumComment.likeForumComment)
router
  .route('/unlike-forum-comment/:cid/:uid', forumsRouter)
  .patch(forumsController.unlikeForumComment.unlikeForumComment)
module.exports = router
