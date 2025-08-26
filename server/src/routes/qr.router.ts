import { Router } from "express";
import * as qrController from "../controllers/qr.controller";

const qrRouter = Router();

/**
 * @swagger
 * /api/qr-codes:
 *   post:
 *     summary: Create a new QR code
 *     tags: [QR Codes]
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
 *                 example: My Website QR
 *               url:
 *                 type: string
 *                 example: https://example.com
 *               description:
 *                 type: string
 *                 example: QR code for my website
 *               size:
 *                 type: number
 *                 example: 300
 *               color:
 *                 type: string
 *                 example: "#000000"
 *               backgroundColor:
 *                 type: string
 *                 example: "#ffffff"
 *     responses:
 *       201:
 *         description: QR code created successfully
 */
qrRouter.post('/', qrController.createQRCode);

/**
 * @swagger
 * /api/qr-codes:
 *   get:
 *     summary: Get all QR codes for authenticated user
 *     tags: [QR Codes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: QR codes fetched successfully
 */
qrRouter.get('/', qrController.getQRCodes);

/**
 * @swagger
 * /api/qr-codes/{id}:
 *   put:
 *     summary: Update a QR code
 *     tags: [QR Codes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the QR code to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               url:
 *                 type: string
 *               description:
 *                 type: string
 *               size:
 *                 type: number
 *               color:
 *                 type: string
 *               backgroundColor:
 *                 type: string
 *     responses:
 *       200:
 *         description: QR code updated successfully
 */
qrRouter.put('/:id', qrController.updateQRCode);

/**
 * @swagger
 * /api/qr-codes/{id}:
 *   delete:
 *     summary: Delete a QR code
 *     tags: [QR Codes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the QR code to delete
 *     responses:
 *       200:
 *         description: QR code deleted successfully
 */
qrRouter.delete('/:id', qrController.deleteQRCode);

/**
 * @swagger
 * /api/qr-codes/{id}/scan:
 *   post:
 *     summary: Increment scan count for a QR code
 *     tags: [QR Codes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the QR code to increment scans
 *     responses:
 *       200:
 *         description: Scan count incremented successfully
 */
qrRouter.post('/:id/scan', qrController.incrementQRCodeScans);

export default qrRouter;
