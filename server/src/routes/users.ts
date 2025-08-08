import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, authenticateToken, requireRole } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();
const prisma = new PrismaClient();

// Alle Benutzer abrufen (nur Admin)
router.get('/', authenticateToken, requireRole([UserRole.ADMIN]), async (req: AuthRequest, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Fehler beim Laden der Benutzer' });
  }
});

// Benutzerrolle ändern (nur Admin)
router.patch('/:id/role', authenticateToken, requireRole([UserRole.ADMIN]), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!Object.values(UserRole).includes(role)) {
      return res.status(400).json({ error: 'Ungültige Rolle' });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true
      }
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Fehler beim Ändern der Benutzerrolle' });
  }
});

export { router as userRoutes };