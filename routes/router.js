const express = require('express')
const requireDir = require('require-dir')

const auth = require('../utils/authClient')
const permissionsClient = require('../utils/permissionsClient')

const router = express.Router()
const usersRouter = express.Router({ mergeParams: true })
const proposalsRouter = express.Router({ mergeParams: true })
const forumsRouter = express.Router({ mergeParams: true })

const usersController = requireDir('./users')
const proposalsController = requireDir('./proposals')
const forumsController = requireDir('./forums')

// USERS endpoints
router
  .route('/view-profile/:uid', usersRouter)
  .patch(usersController.viewUserProfile.viewUserProfile)
router
  .route('/agora-activity', usersRouter)
  .get(usersController.getAgoraRecentActivity.getAgoraRecentActivity)
router
  .route('/user-activity-admin/:uid', usersRouter)
  .get([auth, permissionsClient, usersController.getUserActivityForAdminView.getUserActivityForAdminView])
router
  .route('/login', usersRouter)
  .post(usersController.login.login)
router
  .route('/register', usersRouter)
  .post(usersController.register.register)
router
  .route('/login-admin', usersRouter)
  .post(usersController.adminUiLogin.adminUiLogin)

router
  .route('/user/:uid', usersRouter)
  .get([auth, usersController.getUserById.getUserById])

router
  .route('/users/non-admin', usersRouter)
  .get([auth, usersController.getNonAdminUsers.getNonAdminUsers])

router
  .route('/users/admin', usersRouter)
  .get(usersController.getAdminUsers.getAdminUsers)

router
  .route('/users/banned', usersRouter)
  .get([auth, permissionsClient, usersController.getBannedUsers.getBannedUsers])

router
  .route('/users/general', usersRouter)
  .get([auth, usersController.getGeneralUsers.getGeneralUsers])

router
  .route('/users/ban/:uid', usersRouter)
  .patch([auth, permissionsClient, usersController.banUser.banUser])

router
  .route('/users/edit-nickname/:uid', usersRouter)
  .patch([auth, usersController.editUserNickname.editUserNickname])
router
  .route('/users/edit-pfp/:uid', usersRouter)
  .patch([auth, usersController.editUserPFP.editUserPFP])
router
  .route('/proposals-by-user/:uid', usersRouter)
  .get([auth, usersController.getProposalsCreatedByUser.getProposalsCreatedByUser])

router
  .route('/votes-by-user/:uid', proposalsRouter)
  .get([auth, proposalsController.getVotesByUser.getVotesByUser])

router
  .route('/users/revoke-ban/:uid', usersRouter)
  .patch([auth, permissionsClient, usersController.revokeUserBan.revokeUserBan])

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
    [auth, permissionsClient, proposalsController.getRejectedInReviewProposals
      .getRejectedInReviewProposals]
  )

router
  .route('/proposal-stats', proposalsRouter)
  .get(proposalsController.getProposalStats.getProposalStats)
router
  .route('/proposal-tags', proposalsRouter)
  .get(proposalsController.getProposalTags.getProposalTags)

router
  .route('/proposals/approve/:pid', proposalsRouter)
  .patch([auth, permissionsClient, proposalsController.approveProposal.approveProposal])
router
  .route('/proposals/withdraw/:pid', proposalsRouter)
  .patch([auth, proposalsController.withdrawProposal.withdrawProposal])
router
  .route('/proposals/reject/:pid', proposalsRouter)
  .patch([auth, proposalsController.rejectProposal.rejectProposal])
router
  .route('/proposals/patch-sc-id/:pid', proposalsRouter)
  .patch([auth, proposalsController.patchProposalSCId.patchProposalSCId])
router
  .route('/proposals/close-voting/:pid', proposalsRouter)
  .patch([auth, proposalsController.closeProposalVoting.closeProposalVoting])
router
  .route('/proposals/edit/:pid', proposalsRouter)
  .patch([auth, proposalsController.editProposalById.editProposalById])
router
  .route('/proposals/request-review/:pid', proposalsRouter)
  .patch([auth, permissionsClient, proposalsController.requestProposalReview.requestProposalReview])
router
  .route('/proposals/approved/:pid', proposalsRouter)
  .get(proposalsController.getApprovedProposalById.getApprovedProposalById)
router
  .route('/proposal-votes/:pid', proposalsRouter)
  .get(proposalsController.getProposalVotes.getProposalVotes)
router
  .route('/like-proposal/:pid/:uid', proposalsRouter)
  .patch([auth, proposalsController.likeProposal.likeProposal])
router
  .route('/unlike-proposal/:pid/:uid', proposalsRouter)
  .patch([auth, proposalsController.unlikeProposal.unlikeProposal])
router
  .route('/view-proposal/:pid', proposalsRouter)
  .patch(proposalsController.viewProposal.viewProposal)
router
  .route('/vote-proposal/:pid', proposalsRouter)
  .post([auth, proposalsController.voteForProposal.voteForProposal])
router
  .route('/new-proposal', proposalsRouter)
  .post([auth, proposalsController.postProposal.postProposal])
// FORUMS endpoints

router.route('/forums', forumsRouter).get(forumsController.getForums.getForums)
router.route('/agora-forums', forumsRouter).get(forumsController.getAgoraForums.getAgoraForums)
router.route('/agora-forums/:fid', forumsRouter).get(forumsController.getAgoraTopicById.getAgoraTopicById)
router.route('/agora-comments/:fid', forumsRouter).get(forumsController.getAgoraTopicCommentsById.getAgoraTopicCommentsById)
router.route('/forums/categories', forumsRouter).get(forumsController.getForumCategories.getForumCategories)
router
  .route('/reported-forums', forumsRouter)
  .get([auth, permissionsClient, forumsController.getReportedForums.getReportedForums])

router
  .route('/deleted-forums', forumsRouter)
  .get([auth, permissionsClient, forumsController.getDeletedForums.getDeletedForums])
router
  .route('/forums/delete', forumsRouter)
  .delete([auth, permissionsClient, forumsController.permanentlyDeleteForums.permanentlyDeleteForums])
router
  .route('/forums/flag-for-deletion', forumsRouter)
  .patch([auth, permissionsClient, forumsController.flagForumsForDeletion.flagForumsForDeletion])

router
  .route('/forums/pin/:fid', forumsRouter)
  .patch([auth, permissionsClient, forumsController.pinForum.pinForum])
router
  .route('/view-forum/:fid', forumsRouter)
  .patch(forumsController.viewForum.viewForum)
router
  .route('/forums/un-pin/:fid', forumsRouter)
  .patch([auth, permissionsClient, forumsController.unPinForum.unPinForum])
router
  .route('/forums/revive/:fid', forumsRouter)
  .patch([auth, permissionsClient, forumsController.reviveForum.reviveForum])
router
  .route('/forums/delete/:fid', forumsRouter)
  .patch([auth, permissionsClient, forumsController.flagForumForDeletion.flagForumForDeletion])
router
  .route('/forums/edit/:fid', forumsRouter)
  .patch([auth, permissionsClient, forumsController.editForumById.editForumById])
router
  .route('/forums/new', forumsRouter)
  .post([auth, forumsController.postForumTopic.postForumTopic])
router
  .route('/comments/new', forumsRouter)
  .post([auth, forumsController.postForumComment.postForumComment])
router
  .route('/deleted-comments', forumsRouter)
  .get([auth, permissionsClient, forumsController.getDeletedComments.getDeletedComments])
router
  .route('/comments/delete', forumsRouter)
  .delete([auth, permissionsClient, forumsController.permanentlyDeleteComments.permanentlyDeleteComments])
router
  .route('/comments/revive/:cid', forumsRouter)
  .patch([auth, permissionsClient, forumsController.reviveComment.reviveComment])

router
  .route('/comments/flag-for-deletion', forumsRouter)
  .patch([auth, permissionsClient, forumsController.flagCommentsForDeletion.flagCommentsForDeletion])
router
  .route('/reported-comments', forumsRouter)
  .get([auth, permissionsClient, forumsController.getReportedComments.getReportedComments])
router
  .route('/comments/report/:cid', forumsRouter)
  .patch([auth, forumsController.reportForumComment.reportForumComment])
router
  .route('/forums/report/:fid', forumsRouter)
  .patch([auth, forumsController.reportForum.reportForum])
router
  .route('/forums-by-user/:uid', forumsRouter)
  .get([auth, forumsController.getForumsByUser.getForumsByUser])
router
  .route('/like-forum/:fid/:uid', forumsRouter)
  .patch([auth, forumsController.likeForum.likeForum])
router
  .route('/unlike-forum/:fid/:uid', forumsRouter)
  .patch([auth, forumsController.unLikeForum.unLikeForum])
router
  .route('/like-forum-comment/:cid/:uid', forumsRouter)
  .patch([auth, forumsController.likeForumComment.likeForumComment])
router
  .route('/unlike-forum-comment/:cid/:uid', forumsRouter)
  .patch([auth, forumsController.unlikeForumComment.unlikeForumComment])
router
  .route('/moc-balance/:wid', usersRouter)
  .get([usersController.getUserMocBalance.getUserMocBalance])
module.exports = router
