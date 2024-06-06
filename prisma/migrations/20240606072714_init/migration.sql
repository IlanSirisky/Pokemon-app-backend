-- CreateTable
CREATE TABLE "Pokemon" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "isOwned" BOOLEAN NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "Pokemon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "pokemon_id" INTEGER NOT NULL,
    "height" TEXT NOT NULL,
    "weight" TEXT NOT NULL,
    "ability" TEXT[],
    "types" TEXT[]
);

-- CreateTable
CREATE TABLE "BaseStats" (
    "pokemon_id" INTEGER NOT NULL,
    "hp" INTEGER NOT NULL,
    "attack" INTEGER NOT NULL,
    "defense" INTEGER NOT NULL,
    "sp_attack" INTEGER NOT NULL,
    "sp_defense" INTEGER NOT NULL,
    "speed" INTEGER NOT NULL,
    "power_level" INTEGER NOT NULL,

    CONSTRAINT "BaseStats_pkey" PRIMARY KEY ("pokemon_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_pokemon_id_key" ON "Profile"("pokemon_id");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_pokemon_id_fkey" FOREIGN KEY ("pokemon_id") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BaseStats" ADD CONSTRAINT "BaseStats_pokemon_id_fkey" FOREIGN KEY ("pokemon_id") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
