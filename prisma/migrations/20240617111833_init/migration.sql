-- CreateTable
CREATE TABLE "Pokemon" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
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
    "power_level" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "sub" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsersPokemons" (
    "user_id" INTEGER NOT NULL,
    "pokemon_id" INTEGER NOT NULL,

    CONSTRAINT "UsersPokemons_pkey" PRIMARY KEY ("user_id","pokemon_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_pokemon_id_key" ON "Profile"("pokemon_id");

-- CreateIndex
CREATE INDEX "Profile_pokemon_id_idx" ON "Profile"("pokemon_id");

-- CreateIndex
CREATE UNIQUE INDEX "BaseStats_pokemon_id_key" ON "BaseStats"("pokemon_id");

-- CreateIndex
CREATE INDEX "BaseStats_pokemon_id_idx" ON "BaseStats"("pokemon_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_sub_key" ON "User"("sub");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "UsersPokemons_user_id_idx" ON "UsersPokemons"("user_id");

-- CreateIndex
CREATE INDEX "UsersPokemons_pokemon_id_idx" ON "UsersPokemons"("pokemon_id");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_pokemon_id_fkey" FOREIGN KEY ("pokemon_id") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BaseStats" ADD CONSTRAINT "BaseStats_pokemon_id_fkey" FOREIGN KEY ("pokemon_id") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersPokemons" ADD CONSTRAINT "UsersPokemons_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersPokemons" ADD CONSTRAINT "UsersPokemons_pokemon_id_fkey" FOREIGN KEY ("pokemon_id") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
