'use strict';

exports.BattleMovedex = {
	"fishiousrend": {
		inherit: true,
		flags: {contact: 1, protect: 1, mirror: 1},
	},
	"fly": {
		inherit: true,
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id) || attacker.types.includes('Flying')) {
				return;
			}
			this.add('-prepare', attacker, move.name, defender);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
	},
	"howl": {
		inherit: true,
		boosts: {
			atk: -1,
		},
		self:{
			boosts:{
				atk: 1,
			}
		}
		target: "AllAdjacentFoes",
	},
	"octolock": {
		inherit: true,
		onTryImmunity: null,
		effect: {
			onStart(pokemon, source) {
				this.add('-activate', pokemon, 'move: Octolock', '[of] ' + source);
			},
			onResidualOrder: 11,
			onResidual(pokemon) {
				const source = this.effectData.source;
				if (source && (!source.isActive || source.hp <= 0 || !source.activeTurns)) {
					delete pokemon.volatiles['octolock'];
					this.add('-end', pokemon, 'Octolock', '[partiallytrapped]', '[silent]');
					return;
				}
				this.boost({def: -1, spd: -1, spe: -1}, pokemon, source, this.dex.getActiveMove("Octolock"));
			},
			onTrapPokemon(pokemon) {
				if (this.effectData.source && this.effectData.source.isActive) pokemon.tryTrap();
			},
		},
	},
//------------------------------------------------------ Dynamax Moves ------------------------------------------------------------------
	"maxairstream": {
		inherit: true,
		self: {
			onHit(source) {
				if (!source.volatiles['dynamax']) return;
				for (let pokemon of source.side.active) {
					this.boost( {spe: 1,
								spa: -1,
								atk: -1},
								pokemon );
				}
			},
		},
	},
	"maxdarkness": {
		inherit: true,
		self: {
			onHit(source) {
				if (!source.volatiles['dynamax']) return;
				for (let pokemon of source.side.foe.active) {
					this.boost({spd: -1}, pokemon);
				}
				for (let pokemon of source.side.active) {
					pokemon.addVolatile('torment');
				}
			},
		},
	},
	"maxflare": {
		inherit: true,
		self: {
			onHit(source) {
				if (!source.volatiles['dynamax']) return;
				this.field.setWeather('sunnyday');
			},
		},
		onAfterHit(target, source) {
			if (source.hp) {
				let item = source.takeItem();
				if (item) {
					this.add('-enditem', source, item.name, '[from] move: Max Flare', '[of] ' + source);
				}
			}
		},
	},
	"maxflutterby": {
		inherit: true,
		self: {
			onHit(source) {
				if (!source.volatiles['dynamax']) return;
				for (let pokemon of source.side.foe.active) {
					this.boost({spa: -1}, pokemon);
				}
				for (let pokemon of source.side.active) {
					this.boost( {spd: -1}, pokemon );
				}
			},
		},
	},
	"maxgeyser": {
		inherit: true,
		self: {
			onHit(source) {
				if (!source.volatiles['dynamax']) return;
				this.field.setWeather('raindance');
				for (let pokemon of source.side.active) {
					this.boost( {def: -1}, pokemon );
				}
			},
		},
	},
	"maxhailstorm": {
		inherit: true,
		self: {
			onHit(source) {
				if (!source.volatiles['dynamax']) return;
				this.field.setWeather('hail');
				this.add('-clearboost', source);
			},
		},
	},
	"maxknuckle": {
		inherit: true,
		self: {
			onHit(source) {
				if (!source.volatiles['dynamax']) return;
				for (let pokemon of source.side.active) {
					this.boost({atk: 1}, pokemon);
				}
			},
		},
		recoil: [50, 100],
	},
	"maxlightning": {
		inherit: true,
		self: {
			onHit(source) {
				if (!source.volatiles['dynamax']) return;
				this.field.setTerrain('electricterrain');
			},
		},
		recoil: [33, 100],
	},
	"maxmindstorm": {
		inherit: true,
		self: {
			onHit(source) {
				if (!source.volatiles['dynamax']) return;
				this.field.setTerrain('psychicterrain');
				source.usedMindstorm = true;
			},
		},
	},
	"maxooze": {
		inherit: true,
		self: {
			onHit(target, source, move) {
				if (!source.volatiles['dynamax']) return;
				for (let pokemon of source.side.active) {
					this.boost({spa: 1}, pokemon);
				}
				if ( !source.status ){
					source.setStatus( 'tox', source, move, true );
				}
			},
		},
	},
	"maxovergrowth": {
		inherit: true,
		self: {
			onHit(target, source, move) {
				if (!source.volatiles['dynamax']) return;
				this.field.setTerrain('grassyterrain');
				source.addVolatile( 'leechseed', target );
			},
		},
	},
	"maxphantasm": {
		inherit: true,
		self: {
			onHit(source) {
				if (!source.volatiles['dynamax']) return;
				for (let pokemon of source.side.foe.active) {
					this.boost({def: -1}, pokemon);
				}
				source.addVolatile('curse');
			},
		},
	},
	"maxquake": {
		inherit: true,
		self: {
			onHit(source) {
				if (!source.volatiles['dynamax']) return;
				for (let pokemon of source.side.active) {
					this.boost({spd: 1, accuracy: -1}, pokemon);
				}
			},
		},
	},
	"maxrockfall": {
		inherit: true,
		self: {
			onHit(source) {
				if (!source.volatiles['dynamax']) return;
				this.field.setWeather('sandstorm');
				for (let pokemon of source.side.active) {
					this.boost({atk: -1}, pokemon);
				}
			},
		},
	},
	"maxstarfall": {
		inherit: true,
		self: {
			onHit(source) {
				if (!source.volatiles['dynamax']) return;
				this.field.setTerrain('mistyterrain');
				for (let pokemon of source.side.active) {
					this.boost({spa: -1}, pokemon);
				}
			},
		},
	},
	"maxsteelspike": {
		inherit: true,
		self: {
			onHit(source) {
				if (!source.volatiles['dynamax']) return;
				for (let pokemon of source.side.active) {
					this.boost({def: 1, spe: -1}, pokemon);
				}
			},
		},
	},
	"maxstrike": {
		inherit: true,
		self: {
			onHit(source) {
				if (!source.volatiles['dynamax']) return;
				for (let pokemon of source.side.foe.active) {
					this.boost({spe: -1}, pokemon);
				}
			},
			volatileStatus: 'maxstrike',
			effect: {
				noCopy: true,
				onStart(pokemon) {
					this.add('-start', pokemon, 'Max Strike');
				},
				onNegateImmunity(pokemon, type) {
					if (pokemon.hasType('Ghost') && ['Normal', 'Fighting'].includes(type)) return false;
					if (pokemon.hasType('Normal') && ['Ghost'].includes(type)) return false;
				},
			},
		},
	},
	"maxwyrmwind": {
		inherit: true,
		self: {
			onHit(source) {
				if (!source.volatiles['dynamax']) return;
				for (let pokemon of source.side.foe.active) {
					this.boost({atk: -1}, pokemon);
				}
				source.addVolatile('confusion');
			},
		},
	},
//------------------------------------------------------ Gigantamax Moves ------------------------------------------------------------------
	"gmaxbefuddle": {
		inherit: true,
		self: {
			onHit(source) {
				for (let pokemon of source.side.foe.active) {
					let result = this.random(3);
					if (result === 0) {
						pokemon.trySetStatus('slp', source);
					} else if (result === 1) {
						pokemon.trySetStatus('par', source);
					} else {
						pokemon.trySetStatus('psn', source);
					}
				}
				for (let pokemon of source.side.active) {
					this.boost( {spd: -1}, pokemon );
				}
			},
		},
	},
	"gmaxcentiferno": {
		inherit: true,
		self: {
			onHit(source) {
				for (let pokemon of source.side.foe.active) {
					pokemon.addVolatile('partiallytrapped', source, this.dex.getActiveMove('G-Max Centiferno'), 'trapper');
				}
			},
		},
		onAfterHit(target, source) {
			if (source.hp) {
				let item = source.takeItem();
				if (item) {
					this.add('-enditem', source, item.name, '[from] move: G-Max Centiferno', '[of] ' + source);
				}
			}
		},
	},
	"gmaxchistrike": {
		inherit: true,
		self: {
			onHit(source) {
				for (let pokemon of source.side.active) {
					pokemon.addVolatile('focusenergy');
				}
			},
		},
		recoil: [50, 100],
	},
	"gmaxcuddle": {
		inherit: true,
		self: {
			onHit(source) {
				for (let pokemon of source.side.foe.active) {
					pokemon.addVolatile('attract');
				}
			},
			volatileStatus: 'maxstrike',
			effect: {
				noCopy: true,
				onStart(pokemon) {
					this.add('-start', pokemon, 'G-Max Cuddle');
				},
				onNegateImmunity(pokemon, type) {
					if (pokemon.hasType('Ghost') && ['Normal', 'Fighting'].includes(type)) return false;
					if (pokemon.hasType('Normal') && ['Ghost'].includes(type)) return false;
				},
			},
		},
	},
	"gmaxdepletion": {
		inherit: true,
		self: {
			onHit(source) {
				source.addVolatile('confusion');
			},
			onAfterHit(source) {
				for (let pokemon of source.side.foe.active) {
					const move = pokemon.lastMove;
					if (move && !move.isZ && !move.isMax) {
						let ppDeducted = pokemon.deductPP(move.id, 4);
						if (ppDeducted) {
							this.add("-activate", pokemon, 'move: Max Depletion', move.name, ppDeducted);
							return;
						}
					}
					return false;
				}
			},
		},
	},
	"gmaxfinale": {
		inherit: true,
		self: {
			onAfterHit(source) {
				for (let pokemon of source.side.active) {
					this.heal(pokemon.maxhp / 6, pokemon, source);
				}
			},
			onHit(source) {
				for (let pokemon of source.side.active) {
					this.boost({spa: -1}, pokemon);
				}
			},
		},
	},
	"gmaxfoamburst": {
		inherit: true,
		self: {
			onHit(source) {
				for (let pokemon of source.side.foe.active) {
					this.boost({spe: -2}, pokemon);
				}
				let success = false;
				let removeTarget = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
				for (const targetCondition of removeTarget) {
					if (source.side.foe.removeSideCondition(targetCondition)) {
						if (!removeAll.includes(targetCondition)) continue;
						this.add('-sideend', source.side.foe, this.dex.getEffect(targetCondition).name, '[from] move: G-Max Wind Rage', '[of] ' + source);
						success = true;
					}
				}
				return success;
			},
		},
	},
	"gmaxgoldrush": {
		inherit: true,
		self: {
			onHit(source) {
				for (let pokemon of source.side.foe.active) {
					pokemon.addVolatile('confusion');
				}
			},
			volatileStatus: 'maxstrike',
			effect: {
				noCopy: true,
				onStart(pokemon) {
					this.add('-start', pokemon, 'G-Max Cuddle');
				},
				onNegateImmunity(pokemon, type) {
					if (pokemon.hasType('Ghost') && ['Normal', 'Fighting'].includes(type)) return false;
					if (pokemon.hasType('Normal') && ['Ghost'].includes(type)) return false;
				},
			},
		},
	},
	"gmaxgravitas": {
		inherit: true,
		self: {
			pseudoWeather: 'gravity',
			onHit(source) {
				if (!source.volatiles['dynamax']) return;
				source.usedMindstorm = true;
			},
		},
	},
	"gmaxmalodor": {
		inherit: true,
		isMax: "Garbodor",
		self: {
			onHit(source) {
				for (let pokemon of source.side.foe.active) {
					pokemon.trySetStatus('psn', source);
				}
				if ( !source.status ){
					source.setStatus( 'tox', source, move, true );
				}
			},
		},
	},
	"gmaxmeltdown": {
		self: {
			onHit(source) {
				for (let pokemon of source.side.foe.active) {
					pokemon.addVolatile('torment');
				}
				for (let pokemon of source.side.active) {
					this.boost({def: 1, spe: -1}, pokemon);
				}
			},
		},
	},
	"gmaxreplenish": {
		inherit: true,
		self: {
			onHit(source) {
				if (this.random(2) === 0) return;
				for (let pokemon of source.side.active) {
					if (!pokemon.item && pokemon.lastItem && this.dex.getItem(pokemon.lastItem).isBerry) {
						let item = pokemon.lastItem;
						pokemon.lastItem = '';
						this.add('-item', pokemon, this.dex.getItem(item), '[from] move: G-Max Replenish');
						pokemon.setItem(item);
					}
				}
			},
			volatileStatus: 'maxstrike',
			effect: {
				noCopy: true,
				onStart(pokemon) {
					this.add('-start', pokemon, 'Max Strike');
				},
				onNegateImmunity(pokemon, type) {
					if (pokemon.hasType('Ghost') && ['Normal', 'Fighting'].includes(type)) return false;
					if (pokemon.hasType('Normal') && ['Ghost'].includes(type)) return false;
				},
			},
		},
	},
	"gmaxresonance": {
		inherit: true,
		self: {
			sideCondition: 'auroraveil',
			onHit(source) {
				if (!source.volatiles['dynamax']) return;
				this.add('-clearboost', source);
			},
		},
	},
	"gmaxsandblast": {
		inherit: true,
		self: {
			onHit(source) {
				for (let pokemon of source.side.foe.active) {
					pokemon.addVolatile('partiallytrapped', source, this.dex.getActiveMove('G-Max Sandblast'), 'trapper');
				}
				for (let pokemon of source.side.active) {
					this.boost({accuracy: -1}, pokemon);
				}
			},
		},
	},
	"gmaxsmite": {
		inherit: true,
		self: {
			onHit(source) {
				for (let pokemon of source.side.foe.active) {
					pokemon.addVolatile('confusion', source);
				}
				for (let pokemon of source.side.active) {
					this.boost({spa: -1}, pokemon);
				}
			},
		},
	},
	"gmaxsnooze": {
		inherit: true,
		self: {
			onHit(source) {
				if (!source.volatiles['dynamax']) return;
				for (let pokemon of source.side.active) {
					pokemon.addVolatile('torment');
				}
			},
		},
	},
	"gmaxsteelsurge": {
		inherit: true,
		self: {
			onHit(source) {
				source.side.foe.addSideCondition('gmaxsteelsurge');
				for (let pokemon of source.side.active) {
					this.boost({spe: -1}, pokemon);
				}
			},
		},
		effect: {
			onStart(side) {
				this.add('-sidestart', side, 'move: G-Max Steelsurge');
			},
			onSwitchIn(pokemon) {
				if (pokemon.hasItem('heavydutyboots')) return;
				let typeMod = this.dex.clampIntRange(pokemon.runEffectiveness(this.dex.getActiveMove('G-Max Steelsurge')), -6, 6);
				this.damage(pokemon.maxhp * Math.pow(2, typeMod) / 8);
			},
		},
	},
	"gmaxstonesurge": {
		inherit: true,
		self: {
			onHit(source) {
				source.side.foe.addSideCondition('stealthrock');
				for (let pokemon of source.side.active) {
					this.boost( {def: -1}, source );
				}
			},
		},
	},
	"gmaxstunshock": {
		inherit: true,
		self: {
			onHit(source) {
				for (let pokemon of source.side.foe.active) {
					let result = this.random(2);
					if (result === 0) {
						pokemon.trySetStatus('par', source);
					} else {
						pokemon.trySetStatus('psn', source);
					}
				}
			},
		},
		recoil: [33, 100],
	},
	"gmaxsweetness": {
		inherit: true,
		self: {
			onHit(target, source) {
				if (target.hasType('Grass')) return null;
				target.addVolatile('leechseed', source);
				for (let pokemon of source.side.active) {
					this.boost( {spd: -1}, source );
				}
			},
		},
	},
	"gmaxtartness": {
		inherit: true,
		self: {
			onHit(target, source, move) {
				for (const pokemon of source.side.foe.active) {
					this.boost({def: -1}, pokemon);
				}
				for (const pokemon of source.side.active) {
					this.boost({accuracy: -1}, pokemon);
				}
			},
		},
		recoil: [33, 100],
	},
	"gmaxterror": {
		inherit: true,
		self: {
			onHit(source) {
				for (const pokemon of source.side.foe.active) {
					pokemon.addVolatile('trapped', source, null, 'trapper');
				}
				source.addVolatile('curse');
			},
		},
	},
	"gmaxvolcalith": {
		inherit: true,
		self: {
			onHit(source) {
				source.side.foe.addSideCondition('gmaxvolcalith');
				for (let pokemon of source.side.active) {
					this.boost({atk: -1}, pokemon);
				}
			},
		},
		effect: {
			duration: 4,
			onStart(targetSide) {
				this.add('-sidestart', targetSide, 'G-Max Volcalith');
			},
			onResidual(targetSide) {
				for (const pokemon of targetSide.active) {
					this.damage(pokemon.baseMaxhp / 8, pokemon);
				}
			},
			onEnd(targetSide) {
				this.add('-sideend', targetSide, 'G-Max Volcalith');
			},
		},
	},
	"gmaxvoltcrash": {
		inherit: true,
		self: {
			onHit(source) {
				for (const pokemon of source.side.foe.active) {
					pokemon.trySetStatus('par', source);
				}
			},
		},
		ignoreImmunity: {'Electric': true},
		ignoreAbility: true,
		recoil: [33, 100],
	},
	"gmaxwildfire": {
		inherit: true,
		recoil: [33, 100],
		onAfterHit(target, source) {
			if (source.hp) {
				let item = source.takeItem();
				if (item) {
					this.add('-enditem', target, item.name, '[from] move: Max Flare', '[of] ' + target);
				}
			}
		},
	},
	"gmaxwindrage": {
		inherit: true,
		self: {
			onHit(source) {
				let success = false;
				let removeTarget = ['reflect', 'lightscreen', 'auroraveil', 'safeguard', 'mist', 'spikes', 'toxicspikes', 'stealthrock', 'stickyweb'];
				let removeAll = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
				for (const targetCondition of removeTarget) {
					if (source.side.foe.removeSideCondition(targetCondition)) {
						if (!removeAll.includes(targetCondition)) continue;
						this.add('-sideend', source.side.foe, this.dex.getEffect(targetCondition).name, '[from] move: G-Max Wind Rage', '[of] ' + source);
						success = true;
					}
				}
				for (const sideCondition of removeAll) {
					if (source.side.removeSideCondition(sideCondition)) {
						this.add('-sideend', source.side, this.dex.getEffect(sideCondition).name, '[from] move: G-Max Wind Rage', '[of] ' + source);
						success = true;
					}
				}
				this.field.clearTerrain();
				for (let pokemon of source.side.active) {
					this.boost( { spa: -1, atk: -1}, pokemon );
				}
				return success;
			},
		},
	},
};
