import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, authenticateToken } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Beiträge abrufen
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { visibility: 'PUBLIC' },
          { 
            AND: [
              { visibility: 'FAMILY' },
              { 
                family: {
                  OR: [
                    { createdBy: req.user!.id },
                    { isPublic: true }
                  ]
                }
              }
            ]
          },
          { 
            AND: [
              { visibility: 'ADMIN' },
              { authorId: req.user!.id }
            ]
          }
        ]
      },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        family: {
          select: {
            name: true
          }
        },
        _count: {
          select: {
            comments: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Fehler beim Laden der Beiträge' });
  }
});

// Beitrag erstellen
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { title, content, visibility, familyId, images } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Titel und Inhalt sind erforderlich' });
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        visibility: visibility || 'FAMILY',
        familyId,
        images: images || [],
        authorId: req.user!.id
      },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        family: {
          select: {
            name: true
          }
        }
      }
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Fehler beim Erstellen des Beitrags' });
  }
});

export { router as postRoutes };