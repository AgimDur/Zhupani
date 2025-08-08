import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, authenticateToken } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Alle Familien abrufen
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const families = await prisma.family.findMany({
      where: {
        OR: [
          { isPublic: true },
          { createdBy: req.user!.id }
        ]
      },
      include: {
        creator: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        _count: {
          select: {
            persons: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    res.json(families);
  } catch (error) {
    res.status(500).json({ error: 'Fehler beim Laden der Familien' });
  }
});

// Familie erstellen
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { name, description, isPublic } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Familienname ist erforderlich' });
    }

    const family = await prisma.family.create({
      data: {
        name,
        description,
        isPublic: isPublic || false,
        createdBy: req.user!.id
      },
      include: {
        creator: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });

    res.status(201).json(family);
  } catch (error) {
    res.status(500).json({ error: 'Fehler beim Erstellen der Familie' });
  }
});

// Familie mit Personen abrufen
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const family = await prisma.family.findUnique({
      where: { id },
      include: {
        persons: {
          include: {
            relationshipsFrom: {
              include: {
                relatedPerson: true
              }
            },
            relationshipsTo: {
              include: {
                person: true
              }
            }
          }
        },
        creator: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });

    if (!family) {
      return res.status(404).json({ error: 'Familie nicht gefunden' });
    }

    // Prüfen ob Benutzer Zugriff hat
    if (!family.isPublic && family.createdBy !== req.user!.id && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Kein Zugriff auf diese Familie' });
    }

    res.json(family);
  } catch (error) {
    res.status(500).json({ error: 'Fehler beim Laden der Familie' });
  }
});

export { router as familyRoutes };