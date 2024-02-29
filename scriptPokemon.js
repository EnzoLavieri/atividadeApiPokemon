const fs = require('fs/promises');
const axios = require('axios');

async function buscaPokemon(urlPokemon) {
    try {
        const resposta = await axios.get(urlPokemon);
        const { name, types, weight, height, id, sprites } = resposta.data;

        const dadosPokemon = {
            nome: name,
            tipo: types.map(type => type.type.name),
            peso: weight,
            altura: height,
            numeroDex: id,
            urlSprite: sprites.front_default
        };

        return dadosPokemon;
    } catch (erro) {
        console.error(`Erro ao buscar dados do ${urlPokemon}: ${erro.message}`);
        throw erro;
    }
}

async function buscaUrlPokemons(limite) {
    try {
        const resposta = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${limite}`);
        return resposta.data.results.map(pokemon => pokemon.url);
    } catch (erro) {
        console.error(`Erro ao buscar as URLs dos Pokémons: ${erro.message}`);
        throw erro;
    }
}

async function buscaSalvaPokemons(limite) {
    try {
        const urlsDosPokemons = await buscaUrlPokemons(limite);

        const dadosPokemonsArray = [];
        for (const url of urlsDosPokemons) {
            const dadosPokemon = await buscaPokemon(url);
            dadosPokemonsArray.push(dadosPokemon);
        }

        await fs.writeFile('dadosDosPokemons.json', JSON.stringify(dadosPokemonsArray, null, 2));
        console.log(`Dados para ${limite} Pokémons salvos com sucesso.`);
    } catch (erro) {
        console.error(`Erro ao buscar e salvar dados dos Pokémons: ${erro.message}`);
    }
}

buscaSalvaPokemons(151);
