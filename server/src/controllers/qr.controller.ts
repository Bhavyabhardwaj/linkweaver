import { Response, NextFunction, Request } from "express";
import { AuthenticatedRequest } from "../types";
import { QRCodeGenerator } from '../utils/qrCode';
import { qrValidation } from "../validation";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createQRCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user.id;
    const validateData = qrValidation.qrCodeValidator.parse(req.body);

    // Generate QR code
    const qrCodeDataUrl = await QRCodeGenerator.generateQRCode(validateData.url, {
      size: validateData.size,
      color: {
        dark: validateData.color,
        light: validateData.backgroundColor
      }
    });

    // Save QR code record to database
    const qrCode = await prisma.qRCode.create({
      data: {
        title: validateData.title,
        url: validateData.url,
        description: validateData.description,
        size: validateData.size,
        color: validateData.color,
        backgroundColor: validateData.backgroundColor,
        qrCodeUrl: qrCodeDataUrl,
        userId: userId,
        scans: 0
      }
    });

    res.status(201).json({
      status: "success",
      message: "QR code created successfully",
      data: qrCode,
    });
  } catch (error: any) {
    next(error);
  }
};

export const getQRCodes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user.id;

    const qrCodes = await prisma.qRCode.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      status: "success",
      data: qrCodes,
    });
  } catch (error: any) {
    next(error);
  }
};

export const updateQRCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user.id;
    const validateData = qrValidation.qrCodeUpdateValidator.parse(req.body);

    // Check if QR code exists and belongs to user
    const existingQRCode = await prisma.qRCode.findFirst({
      where: { id, userId }
    });

    if (!existingQRCode) {
      return res.status(404).json({
        status: "error",
        message: "QR code not found"
      });
    }

    // If URL changed, regenerate QR code
    let qrCodeDataUrl = existingQRCode.qrCodeUrl;
    if (validateData.url && validateData.url !== existingQRCode.url) {
      qrCodeDataUrl = await QRCodeGenerator.generateQRCode(validateData.url, {
        size: validateData.size || existingQRCode.size,
        color: {
          dark: validateData.color || existingQRCode.color,
          light: validateData.backgroundColor || existingQRCode.backgroundColor
        }
      });
    }

    const updatedQRCode = await prisma.qRCode.update({
      where: { id },
      data: {
        ...validateData,
        qrCodeUrl: qrCodeDataUrl
      }
    });

    res.json({
      status: "success",
      message: "QR code updated successfully",
      data: updatedQRCode,
    });
  } catch (error: any) {
    next(error);
  }
};

export const deleteQRCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user.id;

    // Check if QR code exists and belongs to user
    const existingQRCode = await prisma.qRCode.findFirst({
      where: { id, userId }
    });

    if (!existingQRCode) {
      return res.status(404).json({
        status: "error",
        message: "QR code not found"
      });
    }

    await prisma.qRCode.delete({
      where: { id }
    });

    res.json({
      status: "success",
      message: "QR code deleted successfully"
    });
  } catch (error: any) {
    next(error);
  }
};

export const incrementQRCodeScans = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const updatedQRCode = await prisma.qRCode.update({
      where: { id },
      data: {
        scans: { increment: 1 }
      }
    });

    res.json({
      status: "success",
      data: updatedQRCode
    });
  } catch (error: any) {
    next(error);
  }
};
