export const getRandomPokemonId = () => {
  const pokemonIds = [1, 4, 7, 25];
  const randomIndex = Math.floor(Math.random() * pokemonIds.length);
  return pokemonIds[randomIndex];
};
