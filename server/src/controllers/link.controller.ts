// Get total views for all bio links for the authenticated user
export const getTotalBioLinkViews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user.id;
    const totalViews = await linkService.getTotalBioLinkViews(userId);
    res.status(200).json({
      status: "success",
      message: "Total bio link views fetched successfully",
      data: { totalViews }
    });
  } catch (error) {
    next(error);
  }
};
import { NotFoundError } from "../errors";
import { linkService } from "../services";
import { Response, NextFunction, Request } from "express";
import { AuthenticatedRequest } from "../types";
import { slugUtil } from "../utils";
import { QRCodeGenerator } from '../utils/qrCode';
import { linkValidation } from "../validation";

// Controller functions for handling link-related API requests

export const createBioLink = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user.id;
    const validateData = linkValidation.bioLinkValidator.parse(req.body);
    const bioLink = await linkService.createBioLink(userId, validateData);
    res.status(201).json({
      status: "success",
      message: "Bio link created successfully",
      data: bioLink,
    });
  } catch (error: any) {
    next(error);
  };
};

export const createShortLink = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user.id;
    const validateData = linkValidation.shortLinkValidator.parse(req.body);
    const shortLink = await linkService.createShortLink(userId, validateData);
    res.status(201).json({
      status: "success",
      message: "Short link created successfully",
      data: {
        ...shortLink,
        shortUrl: `${process.env.BASE_URL || 'http://localhost:3000'}/${shortLink.slug}`,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getBioLinks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user.id;
    const bioLinks = await linkService.getBioLinks(userId);
    res.status(200).json({
      status: "success",
      message: "Bio links fetched successfully",
      data: bioLinks
    });
  } catch (error: any) {
    next(error);
  }
};

export const getShortLinks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user.id;
    const shortLinks = await linkService.getShortLinks(userId);
    res.status(200).json({
      status: "success",
      message: "Short links fetched successfully",
      data: {
        shortLinks: shortLinks.map(link => ({
          ...link,
          shortUrl: `${process.env.BASE_URL || 'http://localhost:3000'}/${link.slug}`
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

// Handles fetching a single link by its ID for the authenticated user
export const getLinkById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const linkId = req.params.id;
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user.id;
    const link = await linkService.getLinkById(linkId, userId);
    if (!link) {
      throw new NotFoundError("Link not found");
    } else {
      res.status(200).json({
        status: "success",
        message: "Link fetched successfully",
        data: link,
      });
    }
  } catch (error: any) {
    next(error);
  }
};

// Handles updating a link by its ID for the authenticated user
export const updateLink = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const linkId = req.params.id;
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user.id;
    const updateData = req.body;
    const updatedLink = await linkService.updateLink(linkId, userId, updateData);
    res.status(200).json({
      status: "success",
      message: "Link updated successfully",
      data: updatedLink,
    });
  } catch (error: any) {
    next(error);
  }
}

// Handles soft-deleting a link by its ID for the authenticated user
export const deleteLink = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const linkId = req.params.id;
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user.id;
    const deletedLink = await linkService.deleteLink(linkId, userId);
    res.status(200).json({
      status: "success",
      message: "Link deleted successfully",
      data: deletedLink,
    });
  } catch (error: any) {
    next(error);
  }
}

// Handles reordering of links for the authenticated user
export const reorderLinks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user.id;
    const { linkIds } = req.body;
    const reorderedLinks = await linkService.reorderLinks(userId, linkIds);
    res.status(200).json({
      status: "success",
      message: "Links reordered successfully",
      data: reorderedLinks,
    });
  } catch (error: any) {
    next(error);
  }
}

export const getQRCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { format = 'png', size = 200 } = req.query;
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user.id;

    const link = await linkService.getLinkById(id, userId);
    if (!link) return res.status(404).json({ error: 'Link not found' });

    const shortUrl = `${process.env.BASE_URL || 'http://localhost:3000'}/${link.slug}`;

    if (format === 'svg') {
      const svgQR = await QRCodeGenerator.generateQRCode(shortUrl, {
        format: 'svg',
        size: Number(size)
      });
      res.setHeader('Content-Type', 'image/svg+xml');
      return res.send(svgQR);
    }

    // Return base64 image
    const qrCode = await QRCodeGenerator.generateQRCode(shortUrl, {
      size: Number(size)
    });
    res.json({ qrCode, shortUrl });

  } catch (error) {
    next(error);
  }
};

export const regenerateQRCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const options = req.body;

    const updatedLink = await linkService.regenerateQRCode(id, options);
    res.json({
      message: 'QR code regenerated successfully',
      qrCode: updatedLink.qrCode
    });

  } catch (error) {
    next(error);
  }
};

// Link expiration controllers
export const extendLinkExpiration = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user.id;
    const { expiresAt } = linkValidation.linkExpirationValidator.parse(req.body);

    const updatedLink = await linkService.extendLinkExpiration(id, userId, expiresAt);
    
    res.status(200).json({
      status: "success",
      message: "Link expiration updated successfully",
      data: updatedLink
    });
  } catch (error) {
    next(error);
  }
};

export const removeLinkExpiration = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user.id;

    const updatedLink = await linkService.removeExpiration(id, userId);
    
    res.status(200).json({
      status: "success",
      message: "Link expiration removed successfully",
      data: updatedLink
    });
  } catch (error) {
    next(error);
  }
};

export const getExpiredLinks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user.id;
    const expiredLinks = await linkService.getExpiredLinks(userId);
    
    res.status(200).json({
      status: "success",
      message: "Expired links fetched successfully",
      data: expiredLinks
    });
  } catch (error) {
    next(error);
  }
};

export const cleanupExpiredLinks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user.id;
    const result = await linkService.cleanupExpiredLinks(userId);
    
    res.status(200).json({
      status: "success",
      message: `Cleaned up ${result.count} expired links`,
      data: { cleanedCount: result.count }
    });
  } catch (error) {
    next(error);
  }
};

export const getLinkStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user.id;
    const link = await linkService.getLinkById(id, userId);
    
    if (!link) {
      throw new NotFoundError("Link not found");
    }

    const status = {
      id: link.id,
      title: link.title,
      active: link.active,
      isExpired: linkService.isLinkExpired(link),
      isClickLimitReached: linkService.isLinkClickLimitReached(link),
      isAccessible: linkService.isLinkAccessible(link),
      expiresAt: link.expiresAt,
      clickLimit: link.clickLimit,
      clickCount: link.clickCount,
      remainingClicks: link.clickLimit ? Math.max(0, link.clickLimit - link.clickCount) : null,
      daysUntilExpiration: link.expiresAt ? Math.ceil((new Date(link.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null
    };
    
    res.status(200).json({
      status: "success",
      message: "Link status fetched successfully",
      data: status
    });
  } catch (error) {
    next(error);
  }
};

export const verifyLinkPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const validateData = linkValidation.linkPasswordAccessValidator.parse(req.body);
    
    const isValid = await linkService.verifyLinkPassword(id, validateData.password);
    
    res.status(200).json({
      status: "success",
      message: isValid ? "Password is correct" : "Invalid password",
      data: { valid: isValid }
    });
  } catch (error) {
    next(error);
  }
};
