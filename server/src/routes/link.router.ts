import { Router } from "express";
import { analyticsController, linkController } from "../controllers";

const linkRouter = Router();

// Get total views for all bio links for the authenticated user
linkRouter.get('/bio/total-views', linkController.getTotalBioLinkViews);

/**
 * @swagger
 * /api/links/bio:
 *   post:
 *     summary: Create a new bio link for profile page
 *     tags: [Bio Links]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - url
 *             properties:
 *               title:
 *                 type: string
 *                 example: My Instagram
 *               url:
 *                 type: string
 *                 example: https://instagram.com/john
 *               description:
 *                 type: string
 *                 example: Follow me on Instagram
 *               icon:
 *                 type: string
 *                 example: 📸
 *               order:
 *                 type: number
 *                 example: 1
 *     responses:
 *       201:
 *         description: Bio link created successfully
 */
linkRouter.post('/bio', linkController.createBioLink);

/**
 * @swagger
 * /api/links/bio:
 *   get:
 *     summary: Get all bio links for authenticated user
 *     tags: [Bio Links]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bio links fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Bio links fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       url:
 *                         type: string
 *                       description:
 *                         type: string
 *                       icon:
 *                         type: string
 *                       order:
 *                         type: number
 *                       clickCount:
 *                         type: number
 */
linkRouter.get('/bio', linkController.getBioLinks);

/**
 * @swagger
 * /api/links/short:
 *   post:
 *     summary: Create a new short link
 *     tags: [Short Links]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - url
 *             properties:
 *               title:
 *                 type: string
 *                 example: Black Friday Sale
 *               url:
 *                 type: string
 *                 example: https://mystore.com/very-long-url-with-lots-of-parameters
 *               description:
 *                 type: string
 *                 example: Special discount for Black Friday
 *               slug:
 *                 type: string
 *                 example: bf2024
 *               customSlug:
 *                 type: boolean
 *                 example: true
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *                 example: 2024-12-31T23:59:59.000Z
 *               clickLimit:
 *                 type: number
 *                 example: 1000
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       201:
 *         description: Short link created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Short link created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     url:
 *                       type: string
 *                     slug:
 *                       type: string
 *                     shortUrl:
 *                       type: string
 *                       example: https://linkmanager.com/bf2024
 */
linkRouter.post('/short', linkController.createShortLink);

/**
 * @swagger
 * /api/links/short:
 *   get:
 *     summary: Get all short links for authenticated user
 *     tags: [Short Links]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Short links fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       url:
 *                         type: string
 *                       slug:
 *                         type: string
 *                       shortUrl:
 *                         type: string
 *                       clickCount:
 *                         type: number
 *                       expiresAt:
 *                         type: string
 *                       createdAt:
 *                         type: string
 */
linkRouter.get('/short', linkController.getShortLinks);

/**
 * @swagger
 * /api/links/update-link/{id}:
 *   put:
 *     summary: Update a link (bio or short)
 *     tags: [Links]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the link to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated Link Title
 *               url:
 *                 type: string
 *                 example: https://updated-url.com
 *               description:
 *                 type: string
 *                 example: Updated description
 *               icon:
 *                 type: string
 *                 example: 🔗
 *               order:
 *                 type: number
 *                 example: 2
 *               active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Link updated successfully
 */
linkRouter.put('/update-link/:id', linkController.updateLink);

/**
 * @swagger
 * /api/links/delete-link/{id}:
 *   delete:
 *     summary: Delete a link
 *     tags: [Links]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the link to delete
 *     responses:
 *       200:
 *         description: Link deleted successfully
 */
linkRouter.delete('/delete-link/:id', linkController.deleteLink);

/**
 * @swagger
 * /api/links/reorder-links:
 *   patch:
 *     summary: Reorder bio links on profile page
 *     tags: [Bio Links]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - linkIds
 *             properties:
 *               linkIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["linkId1", "linkId2", "linkId3"]
 *                 description: Array of link IDs in desired order
 *     responses:
 *       200:
 *         description: Links reordered successfully
 */
linkRouter.patch('/reorder-links', linkController.reorderLinks);

/**
 * @swagger
 * /api/links/generate-qr-code/{id}:
 *   get:
 *     summary: Generate QR code for a link
 *     tags: [Links]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the link to generate QR code for
 *     responses:
 *       200:
 *         description: QR code generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     qrCode:
 *                       type: string
 *                       example: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...
 */
linkRouter.get('/generate-qr-code/:id', (req, res, next) => {
  linkController.getQRCode(req, res, next);
});

/**
 * @swagger
 * /api/links/{id}/analytics:
 *   get:
 *     summary: Get analytics for a specific link
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the link to get analytics for
 *     responses:
 *       200:
 *         description: Link analytics fetched successfully
 */
linkRouter.get('/:id/analytics', analyticsController.getLinkAnalytics);

/**
 * @swagger
 * /api/links/{id}/extend-expiration:
 *   put:
 *     summary: Extend the expiration date of a link
 *     tags: [Link Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the link to extend expiration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - expiresAt
 *             properties:
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-12-31T23:59:59.000Z"
 *     responses:
 *       200:
 *         description: Link expiration updated successfully
 */
linkRouter.put('/:id/extend-expiration', linkController.extendLinkExpiration);

/**
 * @swagger
 * /api/links/{id}/remove-expiration:
 *   put:
 *     summary: Remove expiration date from a link (make it permanent)
 *     tags: [Link Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the link to remove expiration from
 *     responses:
 *       200:
 *         description: Link expiration removed successfully
 */
linkRouter.put('/:id/remove-expiration', linkController.removeLinkExpiration);

/**
 * @swagger
 * /api/links/{id}/status:
 *   get:
 *     summary: Get detailed status of a link (active, expired, click limit, etc.)
 *     tags: [Link Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the link to check status
 *     responses:
 *       200:
 *         description: Link status fetched successfully
 */
linkRouter.get('/:id/status', linkController.getLinkStatus);

/**
 * @swagger
 * /api/links/expired:
 *   get:
 *     summary: Get all expired links for the authenticated user
 *     tags: [Link Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Expired links fetched successfully
 */
linkRouter.get('/expired', linkController.getExpiredLinks);

/**
 * @swagger
 * /api/links/cleanup-expired:
 *   post:
 *     summary: Cleanup (deactivate) all expired links for the authenticated user
 *     tags: [Link Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Expired links cleaned up successfully
 */
linkRouter.post('/cleanup-expired', linkController.cleanupExpiredLinks);

/**
 * @swagger
 * /api/links/{id}/verify-password:
 *   post:
 *     summary: Verify password for a password-protected link
 *     tags: [Link Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Link ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 example: mySecretPassword
 *     responses:
 *       200:
 *         description: Password verification result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Password is correct
 *                 data:
 *                   type: object
 *                   properties:
 *                     valid:
 *                       type: boolean
 *                       example: true
 *       404:
 *         description: Link not found
 */
linkRouter.post('/:id/verify-password', linkController.verifyLinkPassword);

export default linkRouter;