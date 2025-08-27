import { linkValidation } from "../validation";
import prisma from "../config/db";
import { slugUtil, bcryptUtil } from "../utils";
import { BadRequestError, NotFoundError } from "../errors";
import { QRCodeGenerator } from '../utils/qrCode';
import { LinkType } from "../generated/prisma";

export const createBioLink = async (userId: string, linkData: linkValidation.BioLinkInput) => {
    const maxOrder = await prisma.link.findFirst({
        where: { userId, type: LinkType.BIO },
        orderBy: { order: 'desc' },
        select: { order: true }
    })

    const nextOrder = (maxOrder?.order ?? 0) + 1;

    return await prisma.link.create({
        data: {
            ...linkData,
            user: { connect: { id: userId } },
            type: LinkType.BIO,
            order: linkData.order ?? nextOrder,
            slug: null
        }
    });
}

export const createShortLink = async (userId: string, linkData: linkValidation.ShortLinkInput) => {
    let slug = linkData.slug;
    if (!slug) {
        slug = await slugUtil.generateUniqueSlug();
    } else {
        const exists = await prisma.link.findFirst({ where: { slug } });
        if (exists) {
            throw new BadRequestError("Slug already exists");
        }
    }

    // Validate expiration date
    if (linkData.expiresAt && linkData.expiresAt <= new Date()) {
        throw new BadRequestError("Expiration date must be in the future");
    }

    // Hash password if provided
    let hashedPassword = null;
    if (linkData.password) {
        hashedPassword = await bcryptUtil.generateHashPassword(linkData.password);
    }

    return await prisma.link.create({
        data: {
            ...linkData,
            user: { connect: { id: userId } },
            type: LinkType.SHORT,
            slug,
            order: null,
            password: hashedPassword
        }
    })
};

export const getBioLinks = async (userId: string) => {
    return await prisma.link.findMany({
        where: {
            userId,
            type: LinkType.BIO
        },
        orderBy: {
            order: 'asc'
        },
        include: {
            _count: {
                select: { linkClicks: true }
            }
        }
    });
}

export const getShortLinks = async (userId: string) => {
    return await prisma.link.findMany({
        where: {
            userId,
            type: LinkType.SHORT,
            active: true
        },
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            _count: {
                select: { linkClicks: true }
            }
        }
    });
}

export const getLinkById = async (linkId: string, userId: string) => {
    const link = await prisma.link.findUnique({
        where: {
            id: linkId,
            userId,
            active: true
        }
    });
    return link;
}
export const updateLink = async (linkId: string, userId: string, updateData: Partial<linkValidation.LinkUpdateInput>) => {
    const updatedLink = await prisma.link.update({
        where: {
            id: linkId,
            userId,
        },
        data: updateData
    });
    return updatedLink;
}

export const deleteLink = async (linkId: string, userId: string) => {
    const deletedLink = await prisma.link.update({
        where: {
            id: linkId,
            userId,
            active: true
        },
        data: {
            active: false
        }
    });
    return deletedLink;
}

export const reorderLinks = async (userId: string, linkIds: string[]) => {
    const links = await prisma.link.findMany({
        where: {
            userId,
            id: {
                in: linkIds
            },
            active: true
        },
        orderBy: {
            order: 'asc'
        }
    });

    const updatedLinks = await Promise.all(links.map((link, index) => {
        return prisma.link.update({
            where: {
                id: link.id
            },
            data: {
                order: index
            }
        });
    }));

    return updatedLinks;
}

export const generateQrCode = async (linkId: string, userId: string) => {
    const link = await prisma.link.findUnique({
        where: {
            id: linkId,
            userId,
            active: true
        }
    });

    if (!link) {
        throw new BadRequestError("Link not found");
    }

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(link.url)}&size=200x200`;

    const updatedLink = await prisma.link.update({
        where: { id: link.id },
        data: { qrCode: qrCodeUrl }
    });

    return updatedLink;
}

export const generateQRCode = async (url: string): Promise<string> => {
    const qr = require('qrcode');
    return await qr.toDataURL(url);
};

export const regenerateQRCode = async (linkId: string, options?: any) => {
    const link = await prisma.link.findUnique({ where: { id: linkId } });
    if (!link) throw new Error('Link not found');

    const shortUrl = `${process.env.BASE_URL || 'http://localhost:3000'}/${link.slug}`;
    const qrCode = await QRCodeGenerator.generateForLink(shortUrl, options);

    return await prisma.link.update({
        where: { id: linkId },
        data: { qrCode }
    });
};

// Link expiration utility functions
export const isLinkExpired = (link: any): boolean => {
    if (!link.expiresAt) return false;
    return new Date() > new Date(link.expiresAt);
};

export const isLinkClickLimitReached = (link: any): boolean => {
    if (!link.clickLimit) return false;
    return link.clickCount >= link.clickLimit;
};

export const isLinkAccessible = (link: any): boolean => {
    if (!link.active) return false;
    if (isLinkExpired(link)) return false;
    if (isLinkClickLimitReached(link)) return false;
    return true;
};

export const getLinkWithExpiration = async (slug: string) => {
    const link = await prisma.link.findUnique({
        where: { slug },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    name: true
                }
            }
        }
    });

    if (!link) {
        throw new BadRequestError("Link not found");
    }

    if (!isLinkAccessible(link)) {
        if (isLinkExpired(link)) {
            throw new BadRequestError("This link has expired");
        }
        if (isLinkClickLimitReached(link)) {
            throw new BadRequestError("This link has reached its click limit");
        }
        if (!link.active) {
            throw new BadRequestError("This link is no longer active");
        }
    }

    return link;
};

export const getActiveLinks = async (userId: string, type?: LinkType) => {
    const where: any = {
        userId,
        active: true,
        OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } }
        ]
    };

    if (type) {
        where.type = type;
    }

    return await prisma.link.findMany({
        where,
        orderBy: type === LinkType.BIO ? { order: 'asc' } : { createdAt: 'desc' },
        include: {
            _count: {
                select: { linkClicks: true }
            }
        }
    });
};

export const extendLinkExpiration = async (linkId: string, userId: string, newExpirationDate: Date) => {
    if (newExpirationDate <= new Date()) {
        throw new BadRequestError("New expiration date must be in the future");
    }

    const link = await prisma.link.findUnique({
        where: { id: linkId, userId }
    });

    if (!link) {
        throw new BadRequestError("Link not found");
    }

    return await prisma.link.update({
        where: { id: linkId },
        data: { expiresAt: newExpirationDate }
    });
};

export const removeExpiration = async (linkId: string, userId: string) => {
    const link = await prisma.link.findUnique({
        where: { id: linkId, userId }
    });

    if (!link) {
        throw new BadRequestError("Link not found");
    }

    return await prisma.link.update({
        where: { id: linkId },
        data: { expiresAt: null }
    });
};

export const getExpiredLinks = async (userId: string) => {
    return await prisma.link.findMany({
        where: {
            userId,
            active: true,
            expiresAt: {
                lt: new Date()
            }
        },
        orderBy: { expiresAt: 'desc' },
        include: {
            _count: {
                select: { linkClicks: true }
            }
        }
    });
};

export const cleanupExpiredLinks = async (userId?: string) => {
    const where: any = {
        active: true,
        expiresAt: {
            lt: new Date()
        }
    };

    if (userId) {
        where.userId = userId;
    }

    return await prisma.link.updateMany({
        where,
        data: { active: false }
    });
};

// Cleanup links that have reached their click limit
export const cleanupClickLimitReachedLinks = async (userId?: string) => {
    // First, find links that have reached their click limit
    const linksToDeactivate = await prisma.link.findMany({
        where: {
            active: true,
            clickLimit: { not: null },
            userId: userId || undefined
        },
        select: {
            id: true,
            clickCount: true,
            clickLimit: true
        }
    });

    // Filter links where clickCount >= clickLimit
    const linkIdsToDeactivate = linksToDeactivate
        .filter(link => link.clickLimit && link.clickCount >= link.clickLimit)
        .map(link => link.id);

    if (linkIdsToDeactivate.length === 0) {
        return { count: 0 };
    }

    return await prisma.link.updateMany({
        where: {
            id: { in: linkIdsToDeactivate }
        },
        data: { active: false }
    });
};

// Verify password for password-protected links
export const verifyLinkPassword = async (id: string, password: string): Promise<boolean> => {
    const link = await prisma.link.findUnique({
        where: { id },
    });

    if (!link) {
        throw new NotFoundError('Link not found');
    }

    if (!link.password) {
        return true; // No password protection
    }

    return await bcryptUtil.verifyPassword(password, link.password);
};