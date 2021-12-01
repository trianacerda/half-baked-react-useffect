import { useState, useEffect } from 'react';
import PokemonList from '../../components/PokemonList/PokemonList';
import {
  fetchFilteredPokemon,
  fetchPokemon,
  fetchSearchPokemon,
  fetchTypes,
} from '../../services/pokemon';
import './Compendium.css';
import Controls from '../../components/Controls/Controls';
import pokeball from '../../assets/pokeball.png';

export default function Compendium() {
  const [loading, setLoading] = useState(true);
  const [pokemons, setPokemons] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('all');

  // TODO 😖 help! --DONE
  if (pokemons.count === 0) {
    useEffect(() => {
      async function getPokemon() {
        const pokemonList = await fetchPokemon();
        setPokemons(pokemonList);
        setLoading(false);
      }
      getPokemon();
    }, []);
  }

  //TODO 😖 help!
  useEffect(() => {
    async function getTypes() {
      const pokemonTypes = await fetchTypes();
      setTypes(pokemonTypes);
    }
    getTypes();
  }, []);

  //TODO 😖 help!
  useEffect(() => {
    async function getFilteredPokemon() {
      if (!selectedType) return;
      setLoading(true);

      if (selectedType !== 'all') {
        const filteredPokemon = await fetchFilteredPokemon(selectedType);
        setPokemons(filteredPokemon);
      } else {
        const pokemonList = await fetchPokemon();
        setPokemons(pokemonList);
      }
      setLoading(false);
      setSelectedType(selectedType);
    }

    getFilteredPokemon();
  }, [selectedType]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    fetchSearchPokemon(searchName)
      .then((searchedPokemons) => {
        setPokemons(searchedPokemons);
      })
      .catch((error) => {})
      .finally(() => {
        setLoading(false);
        setSearchName('');
        setSelectedType('');
      });
  };

  return (
    <div className='app'>
      <main>
        <div className='title'>
          <img src={pokeball} alt='pokeball' />
          <h1 className='titleText'>Alchemy Compendium</h1>
        </div>
        <Controls
          name={searchName}
          handleSubmit={handleSubmit}
          handleNameChange={setSearchName}
          types={types}
          filterChange={setSelectedType}
          selectedType={selectedType}
        />
        {loading ? (
          <code>Loading...</code>
        ) : (
          <PokemonList pokemons={pokemons} />
        )}
      </main>
    </div>
  );
}
