-- Zhupani Family Tree Database Schema für Supabase
-- Führe dieses SQL in Supabase SQL Editor aus

-- Erstelle Enums für bessere Datenintegrität
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'FAMILY_MEMBER', 'VISITOR');
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');
CREATE TYPE "RelationType" AS ENUM ('PARENT', 'CHILD', 'SPOUSE', 'EX_SPOUSE', 'SIBLING');
CREATE TYPE "PostVisibility" AS ENUM ('PUBLIC', 'FAMILY', 'ADMIN');

-- Users Tabelle
CREATE TABLE "users" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'FAMILY_MEMBER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- Families Tabelle
CREATE TABLE "families" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "families_pkey" PRIMARY KEY ("id")
);

-- Persons Tabelle
CREATE TABLE "persons" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "birthName" TEXT,
    "birthYear" INTEGER,
    "deathYear" INTEGER,
    "gender" "Gender" NOT NULL,
    "photo" TEXT,
    "familyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "persons_pkey" PRIMARY KEY ("id")
);

-- Relationships Tabelle
CREATE TABLE "relationships" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "personId" TEXT NOT NULL,
    "relatedPersonId" TEXT NOT NULL,
    "type" "RelationType" NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "relationships_pkey" PRIMARY KEY ("id")
);

-- Posts Tabelle
CREATE TABLE "posts" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "images" TEXT[],
    "visibility" "PostVisibility" NOT NULL DEFAULT 'FAMILY',
    "authorId" TEXT NOT NULL,
    "familyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- Comments Tabelle
CREATE TABLE "comments" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "content" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- Unique Constraints
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "relationships_personId_relatedPersonId_type_key" ON "relationships"("personId", "relatedPersonId", "type");

-- Foreign Key Constraints
ALTER TABLE "families" ADD CONSTRAINT "families_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "persons" ADD CONSTRAINT "persons_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "families"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "relationships" ADD CONSTRAINT "relationships_personId_fkey" FOREIGN KEY ("personId") REFERENCES "persons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "relationships" ADD CONSTRAINT "relationships_relatedPersonId_fkey" FOREIGN KEY ("relatedPersonId") REFERENCES "persons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "posts" ADD CONSTRAINT "posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "posts" ADD CONSTRAINT "posts_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "families"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "comments" ADD CONSTRAINT "comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "comments" ADD CONSTRAINT "comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Trigger für updatedAt Felder
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON "users" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_families_updated_at BEFORE UPDATE ON "families" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_persons_updated_at BEFORE UPDATE ON "persons" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON "posts" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON "comments" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indizes für bessere Performance
CREATE INDEX "families_createdBy_idx" ON "families"("createdBy");
CREATE INDEX "persons_familyId_idx" ON "persons"("familyId");
CREATE INDEX "relationships_personId_idx" ON "relationships"("personId");
CREATE INDEX "relationships_relatedPersonId_idx" ON "relationships"("relatedPersonId");
CREATE INDEX "posts_authorId_idx" ON "posts"("authorId");
CREATE INDEX "posts_familyId_idx" ON "posts"("familyId");
CREATE INDEX "comments_postId_idx" ON "comments"("postId");
CREATE INDEX "comments_authorId_idx" ON "comments"("authorId");

-- Row Level Security (RLS) aktivieren für bessere Sicherheit
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "families" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "persons" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "relationships" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "posts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "comments" ENABLE ROW LEVEL SECURITY;

-- Basis RLS Policies (können später erweitert werden)
CREATE POLICY "Users can view their own data" ON "users" FOR SELECT USING (true);
CREATE POLICY "Public families are viewable" ON "families" FOR SELECT USING ("isPublic" = true);
CREATE POLICY "Public posts are viewable" ON "posts" FOR SELECT USING ("visibility" = 'PUBLIC');