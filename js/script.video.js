jQuery(document).ready(function($) {
	$('form').on('submit', function(e) {
		e.preventDefault();

		var types = $('input.types')
									.val()
									.replace(/\s*/g, '')
									.split(',');

		var trainerTypes = types.map(function(type) {
			return $.ajax({
				url: 'http://pokeapi.co/api/v2/type/'+type,
				method: 'GET',
				dataType: 'json'
			});

		});

		$.when.apply(null, trainerTypes)
			.then(function() {
				var pokeTypes = [].slice.call(arguments);

				getDoubleDmgTypes(pokeTypes);

			});

	});

	function getDoubleDmgTypes(pokeTypes) {
		pokeTypes = pokeTypes.map(function(type) {
			return type[0]['damage_relations']['double_damage_from'];
		});

		pokeTypes = flatten(pokeTypes);

		var damageTypes = pokeTypes.map(function(type) {
			return $.ajax({
				url: type.url,
				method: 'GET',
				dataType: 'json'
			})
		});

		$.when.apply(null, damageTypes)
			.then(function() {
				var pokemons = [].slice.call(arguments);

				buildTeam(pokemons);

			});

	}

	function buildTeam(pokemons) {
		var team = [];

		pokemons = pokemons.map(function(pokemon) {
			return pokemon[0]['pokemon'];
		});

		pokemons = flatten(pokemons);

		var i = 0;
		while(i++ <= 6)
			team.push( getRandomPokemon(pokemons) );

		team = team.map(function(pokemon) {
			return $.ajax({
				url: pokemon['pokemon'].url,
				method: 'GET',
				dataType: 'json'
			});
		});

		$.when.apply(null, team)
			.then(function() {
				var pokeTeam = [].slice.call(arguments);

				pokeTeam = pokeTeam.map(function(pokemon) {
					return pokemon[0]
				});

				displayPokemon(pokeTeam);

			})

	}

	function displayPokemon(pokeTeam) {
		pokeTeam.forEach(function(pokemon) {
			var $container = $('<div>').addClass('pokemon');
			var $image = $('<img>')
									 	.attr(
									 		'src',
									 		'http://pokeapi.co/media/img/'+pokemon.id+'.png'
									 	);
			var $title = $('<h2>').text(pokemon.name);
			$container.append($image, $title);

			$('.poke-container').append($container);

		})

	}

	function getRandomPokemon(pokemons) {
		var index = Math.floor(Math.random() * pokemons.length);
		return pokemons[index];

	}

	function flatten(arr) {
		return arr.reduce(function(a, b) {
			return a.concat(b);
		});
	}

});
