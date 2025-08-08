import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, authenticateToken } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Person erstellen
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const {
      firstName,
      lastName,
      birthName,
      birthYear,
      deathYear,
      gender,
      familyId
    } = req.body;

    if (!firstName || !lastName || !gender || !familyId) {
      return res.status(400).json({ 
        error: 'Vorname, Nachname, Geschlecht und Familie sind erforderlich' 
      });
    }

    // Prüfen ob Familie existiert und Benutzer Zugriff hat
    const family = await prisma.family.findUnique({
      where: { id: familyId }
    });

    if (!family) {
      return res.status(404).json({ error: 'Familie nicht gefunden' });
    }

    if (family.createdBy !== req.user!.id && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Keine Berechtigung für diese Familie' });
    }

    const person = await prisma.person.create({
      data: {
        firstName,
        lastName,
        birthName,
        birthYear: birthYear ? parseInt(birthYear) : null,
        deathYear: deathYear ? parseInt(deathYear) : null,
        gender,
        familyId
      }
    });

    res.status(201).json(person);
  } catch (error) {
    res.status(500).json({ error: 'Fehler beim Erstellen der Person' });
  }
});

// Person bearbeiten
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      birthName,
      birthYear,
      deathYear,
      gender
    } = req.body;

    // Prüfen ob Person existiert und Benutzer Zugriff hat
    const person = await prisma.person.findUnique({
      where: { id },
      include: { family: true }
    });

    if (!person) {
      return res.status(404).json({ error: 'Person nicht gefunden' });
    }

    if (person.family.createdBy !== req.user!.id && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Keine Berechtigung für diese Person' });
    }

    const updatedPerson = await prisma.person.update({
      where: { id },
      data: {
        firstName,
        lastName,
        birthName,
        birthYear: birthYear ? parseInt(birthYear) : null,
        deathYear: deathYear ? parseInt(deathYear) : null,
        gender
      }
    });

    res.json(updatedPerson);
  } catch (error) {
    res.status(500).json({ error: 'Fehler beim Bearbeiten der Person' });
  }
});

// Beziehung erstellen
router.post('/:id/relationships', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { relatedPersonId, type, startDate, endDate } = req.body;

    if (!relatedPersonId || !type) {
      return res.status(400).json({ 
        error: 'Verwandte Person und Beziehungstyp sind erforderlich' 
      });
    }

    // Prüfen ob beide Personen existieren und Benutzer Zugriff hat
    const [person, relatedPerson] = await Promise.all([
      prisma.person.findUnique({
        where: { id },
        include: { family: true }
      }),
      prisma.person.findUnique({
        where: { id: relatedPersonId },
        include: { family: true }
      })
    ]);

    if (!person || !relatedPerson) {
      return res.status(404).json({ error: 'Person(en) nicht gefunden' });
    }

    if (person.family.createdBy !== req.user!.id && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Keine Berechtigung' });
    }

    const relationship = await prisma.relationship.create({
      data: {
        personId: id,
        relatedPersonId,
        type,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null
      }
    });

    res.status(201).json(relationship);
  } catch (error) {
    res.status(500).json({ error: 'Fehler beim Erstellen der Beziehung' });
  }
});

export { router as personRoutes };