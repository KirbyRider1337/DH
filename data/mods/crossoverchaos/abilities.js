'use strict';
exports.BattleAbilities = {
    "karmicretribution": {
        desc: "This Pokemon's damaging moves become multi-hit moves that hit four times. Does not affect moves that have multiple targets or moves that use the target's attacking stats instead of the user's.",
        shortDesc: "This Pokemon's damaging moves hit four times (not Foul Play).",
        onPrepareHit(source, target, move) {
            if (['iceball', 'rollout'].includes(move.id) || move.useTargetOffensive || move.useSourceDefensive) return;
            if (move.category !== 'Status' && !move.selfdestruct && !move.multihit && !move.flags['charge'] && !move.spreadHit && !move.isZ) {
                move.multihit = 4;
                move.multihitType = 'karmicretribution';
            } else if (move.multihit) {
                if (Array.isArray(move.multihit) && move.multihit[1] > 4) {
                    if (move.multihit[0] === 2 && move.multihit[1] === 5 && this.randomChance(1, 3)) {
                        move.multihit = 4;
                    } else {
                        move.multihit = [4, move.multihit[1]];
                    }
                } else move.multihit = 4;
            }
        },
        onSourceModifySecondaries(secondaries, target, source, move) {
            if (move.multihitType === 'karmicretribution' && move.id === 'secretpower' && move.hit < 4) {
                // hack to prevent accidentally suppressing King's Rock/Razor Fang
                return secondaries.filter(effect => effect.volatileStatus === 'flinch');
            }
        },
        id: "karmicretribution",
        name: "Karmic Retribution",
    },
    "baneofdarkness": {
        desc: "This Pokemon's Psychic-type attacks are super-effective against Dark-types and its Fairy-type attacks are super-effective against Poison-types. Psychic-type attacks ignore the Dark-type's immunity.",
        shortDesc: "User's Psychic- and Fairy-type moves are SE against Dark and Poison, respectively, ignoring immunities if applicable.",
		  onModifyMovePriority: -5,
		  onModifyMove(move, source, target) {
			  if (!move.ignoreImmunity) move.ignoreImmunity = {};
			  if (move.ignoreImmunity !== true && target.hasType('Dark')) {
				  move.ignoreImmunity['Psychic'] = true;
			  }
		  },
		  onSourceEffectiveness(typeMod, target, type, move) {
			  if (move && ((type === 'Poison' && move.type === 'Fairy') || (type === 'Dark' && move.type === 'Psychic'))) return 1;
			  return typeMod;
		  },
        id: "baneofdarkness",
        name: "Bane of Darkness",
    },
	"mountaincall": {
		desc: "This Pokemon's sound-based moves become Ice-type moves. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's sound-based moves become Ice type.",
		onModifyMovePriority: -1,
		onModifyMove(move) {
			if (move.flags['sound']) {
				move.type = 'Ice';
			}
		},
		id: "mountaincall",
		name: "Mountain Call",
	},
	"toughitout": {
		desc: "Prevents adjacent opposing Pokemon from choosing to switch out unless they are immune to trapping.",
		shortDesc: "Prevents adjacent foes from choosing to switch.",
		onFoeTrapPokemon(pokemon) {
			if ( this.isAdjacent(pokemon, this.effectData.target)) {
				pokemon.tryTrap(true);
			}
		},
		onFoeMaybeTrapPokemon(pokemon, source) {
			if (!source) source = this.effectData.target;
			if (!source || !this.isAdjacent(pokemon, source)) return;
			pokemon.maybeTrapped = true;
		},
		id: "toughitout",
		name: "Tough It Out!",
	},
	"groundworker": {
		shortDesc: "This Pokemon's attacking stat is multiplied by 1.5 while using a Ground-type attack.",
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Ground') {
				this.debug('Groundworker boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Ground') {
				this.debug('Groundworker boost');
				return this.chainModify(1.5);
			}
		},
		id: "groundworker",
		name: "Groundworker",
	},
	"sonicwind": {
		shortDesc: "This Pokemon's attacking stat is multiplied by 1.5 while using a Flying-type attack.",
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Flying') {
				this.debug('Sonic Wind boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Flying') {
				this.debug('Sonic Wind boost');
				return this.chainModify(1.5);
			}
		},
		id: "sonicwind",
		name: "Sonic Wind",
	},
	"poisondippedclaws": {
		shortDesc: "This Pokemon's attacking stat is multiplied by 1.5 while using a Poison-type attack.",
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Poison') {
				this.debug('Poison-Dipped Claws boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Poison') {
				this.debug('Poison-Dipped Claws boost');
				return this.chainModify(1.5);
			}
		},
		id: "poisondippedclaws",
		name: "Poison-Dipped Claws",
	},
	"divinecourage": {
		desc: "When this Pokemon has more than 1/2 its maximum HP and takes damage from an attack bringing it to 1/2 or less of its maximum HP, its Attack and Defense are raised by 1 stage each. This effect applies after all hits from a multi-hit move; Sheer Force prevents it from activating if the move has a secondary effect.",
		shortDesc: "This Pokemon's Attack and Defense are raised by 1 when it reaches 1/2 or less of its max HP.",
		onAfterMoveSecondary(target, source, move) {
			if (!source || source === target || !target.hp || !move.totalDamage) return;
			if (target.hp <= target.maxhp / 2 && target.hp + move.totalDamage > target.maxhp / 2) {
				this.boost({atk: 1, def: 1});
			}
		},
		id: "divinecourage",
		name: "Divine Courage",
	},
	"divinewisdom": {
		shortDesc: "This Pokemon's Sp. Def is raised by 1 stage after it is damaged by a move.",
		onAfterDamage(damage, target, source, effect) {
			if (effect && effect.effectType === 'Move' && effect.id !== 'confused') {
				this.boost({spd: 1});
			}
		},
		id: "divinewisdom",
		name: "Divine Wisdom",
	},
	"crystalbarrier": {
		shortDesc: "This Pokemon's Defense and Sp. Def are doubled; Every damaging move used against this Pokemon will always hit.",
		onModifyDefPriority: 6,
		onModifyDef(def) {
			return this.chainModify(2);
		},
		onModifySpDPriority: 5,
		onModifySpD(spd) {
			return this.chainModify(2);
		},
		onAnyAccuracy(accuracy, target, source, move) {
			if (!move || typeof accuracy !== 'number' || move.category === 'Status') return;
			return true;
		},
		id: "crystalbarrier",
		name: "Crystal Barrier",
	},
	"powershield": {
		shortDesc: "Incoming moves of over 90 base power have 90 base power instead.",
		onBasePowerPriority: 8,
		onSourceBasePower(basePower, attacker, defender, move) {
			if (basePower > 90) {
				return 90;
			}
		},
		id: "powershield",
		name: "Power Shield",
	},
	"antidotation": {
		desc: "This Pokemon is immune to Poison-type moves and restores 1/4 of its maximum HP, rounded down, when hit by an Poison-type move. The Poisoning status can still be inflicted through non-Poison-type moves.",
		shortDesc: "This Pokemon heals 1/4 of its max HP when hit by Poison moves; Poison immunity.",
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Poison') {
				if (!this.heal(target.maxhp / 4)) {
					this.add('-immune', target, '[from] ability: Antidotation');
				}
				return null;
			}
		},
		id: "antidotation",
		name: "Antidotation",
	},
	"chillingatmosphere": {
		desc: "On switch-in, this Pokemon lowers the Speed of adjacent opposing Pokemon by 1 stage. Pokemon behind a substitute are immune.",
		shortDesc: "On switch-in, this Pokemon lowers the Speed of adjacent opponents by 1 stage.",
		onStart(pokemon) {
			let activated = false;
			for (const target of pokemon.side.foe.active) {
				if (!target || !this.isAdjacent(target, pokemon)) continue;
				if (!activated) {
					this.add('-ability', pokemon, 'Chilling Atmosphere', 'boost');
					activated = true;
				}
				if (target.volatiles['substitute']) {
					this.add('-immune', target);
				} else {
					this.boost({spe: -1}, target, pokemon);
				}
			}
		},
		id: "chillingatmosphere",
		name: "Chilling Atmosphere",
	},
	"decayingdarkness": {
		desc: "Causes adjacent opposing Pokemon to lose 1/8 of their maximum HP, rounded down, at the end of each turn. This Pokemon is immune to Dark-type moves and restores 1/4 of its maximum HP, rounded down, when hit by an Dark-type move.",
		shortDesc: "Causes adjacent foes to lose 1/8 of their max HP at the end of each turn. This Pokemon heals 1/4 of its max HP when hit by Dark moves; Dark immunity. ",
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Dark') {
				if (!this.heal(target.maxhp / 4)) {
					this.add('-immune', target, '[from] ability: Decaying Darkness');
				}
				return null;
			}
		},
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual(pokemon) {
			if (!pokemon.hp) return;
			for (const target of pokemon.side.foe.active) {
				if (!target || !target.hp) continue;
				this.damage(target.maxhp / 8, target, pokemon);
			}
		},
		id: "decayingdarkness",
		name: "Decaying Darkness",
	},
	"powerofsummer": {
		shortDesc: "This Pokemon resists Fire, regardless of typing. x1.5 to all stats in Sun.",
		onModifyAtkPriority: 3,
		onModifyAtk(atk) {
			if (this.field.isWeather(['sunnyday', 'desolateland'])) {
				return this.chainModify(1.5);
			}
		},
		onModifyDefPriority: 5,
		onModifyDef(def) {
			if (this.field.isWeather(['sunnyday', 'desolateland'])) {
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(spa, pokemon) {
			if (this.field.isWeather(['sunnyday', 'desolateland'])) {
				return this.chainModify(1.5);
			}
		},
		onModifySpDPriority: 4,
		onModifySpD(spd) {
			if (this.field.isWeather(['sunnyday', 'desolateland'])) {
				return this.chainModify(1.5);
			}
		},
		onModifySpe(spe) {
			if (this.field.isWeather(['sunnyday', 'desolateland'])) {
				return this.chainModify(1.5);
			}
		},
	  onEffectiveness(typeMod, target, type, move) {
		  if (!move || move.type !== 'Fire') return typeMod;
		  if (type !== target.types[0]) return 0;
		  return -1;
	  },
		id: "powerofsummer",
		name: "Power of Summer",
	},
    "baneoflight": {
        desc: "This Pokemon's Dark-type attacks are super-effective against Fairy-types, and its Poison-type attacks are super-effective against Psychic-types.",
        shortDesc: "User's Dark- and Poison-type moves are SE against Fairy and Psychic, respectively.",
		  onSourceEffectiveness(typeMod, target, type, move) {
			  if (move && ((type === 'Fairy' && move.type === 'Dark') || (type === 'Psychic' && move.type === 'Poison'))) return 1;
			  return typeMod;
		  },
        id: "baneoflight",
        name: "Bane of Light",
    },
    "fourofakind": {
        desc: "This Pokemon's damaging moves become multi-hit moves that hit four times. Does not affect moves that have multiple targets or moves that use the target's attacking stats instead of the user's.",
        shortDesc: "This Pokemon's damaging moves hit four times, but have x0.25 power and halved secondary chances.",
			onModifyMovePriority: -2,
			onModifyMove(move) {
				if (move.secondaries && move.multihitType === 'parentalbond') {
					this.debug('halving secondary chance');
					for (const secondary of move.secondaries) {
						if (secondary.chance) secondary.chance /= 2;
					}
				}
			},
        onPrepareHit(source, target, move) {
            if (['iceball', 'rollout'].includes(move.id)) return;
            if (move.category !== 'Status' && !move.selfdestruct && !move.multihit && !move.flags['charge'] && !move.spreadHit && !move.isZ) {
                move.multihit = 4;
                move.multihitType = 'parentalbond';
					 if (move.secondaries) {
						this.debug('halving secondary chance');
						for (const secondary of move.secondaries) {
							if (secondary.chance) secondary.chance /= 2;
						}
					 }
            }
        },
		onBasePowerPriority: 8,
		onBasePower(basePower, pokemon, target, move) {
			if (move.multihitType === 'parentalbond') return this.chainModify(0.25);
		},
        onSourceModifySecondaries(secondaries, target, source, move) {
            if (move.multihitType === 'parentalbond' && move.id === 'secretpower' && move.hit < 4) {
                // hack to prevent accidentally suppressing King's Rock/Razor Fang
                return secondaries.filter(effect => effect.volatileStatus === 'flinch');
            }
        },
        id: "fourofakind",
        name: "Four of a Kind",
    },
    "fourheads": {
        desc: "This Pokemon's damaging moves become multi-hit moves that hit four times. Does not affect moves that have multiple targets or moves that use the target's attacking stats instead of the user's.",
        shortDesc: "This Pokemon's damaging moves hit four times, but have x0.3 power and halved secondary chances.",
			onModifyMovePriority: -2,
			onModifyMove(move) {
				if (move.secondaries && move.multihitType === 'fourheads') {
					this.debug('halving secondary chance');
					for (const secondary of move.secondaries) {
						if (secondary.chance) secondary.chance /= 2;
					}
				}
			},
        onPrepareHit(source, target, move) {
            if (['iceball', 'rollout'].includes(move.id)) return;
            if (move.category !== 'Status' && !move.selfdestruct && !move.multihit && !move.flags['charge'] && !move.spreadHit && !move.isZ) {
                move.multihit = 4;
                move.multihitType = 'fourheads';
					 if (move.secondaries) {
						this.debug('halving secondary chance');
						for (const secondary of move.secondaries) {
							if (secondary.chance) secondary.chance /= 2;
						}
					 }
            }
        },
		onBasePowerPriority: 8,
		onBasePower(basePower, pokemon, target, move) {
			if (move.multihitType === 'fourheads') return this.chainModify(0.3);
		},
        onSourceModifySecondaries(secondaries, target, source, move) {
            if (move.multihitType === 'fourheads' && move.id === 'secretpower' && move.hit < 4) {
                // hack to prevent accidentally suppressing King's Rock/Razor Fang
                return secondaries.filter(effect => effect.volatileStatus === 'flinch');
            }
        },
        id: "fourheads",
        name: "Four Heads",
    },
	"abilitytodestroyanything": {
		shortDesc: "Sniper + Sheer Force + Super Luck + This Pokemon's moves that would otherwise lack recoil now deal 25% of damage dealt back to the user.",
		onModifyMove(move, pokemon) {
			if (move.secondaries) {
				delete move.secondaries;
				// Technically not a secondary effect, but it is negated
				if (move.id === 'clangoroussoulblaze') delete move.selfBoost;
				// Actual negation of `AfterMoveSecondary` effects implemented in scripts.js
				move.hasSheerForce = true;
			}
			if (!move.recoil){
				move.recoil = [1, 4];
			}
		},
		onBasePowerPriority: 8,
		onBasePower(basePower, pokemon, target, move) {
			if (move.hasSheerForce) return this.chainModify([0x14CD, 0x1000]);
		},
		onModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).crit) {
				this.debug('Sniper boost');
				return this.chainModify(1.5);
			}
		},
		onModifyCritRatio(critRatio) {
			return critRatio + 1;
		},
		id: "abilitytodestroyanything",
		name: "Ability to Destroy Anything",
	},
	"miner": {
		shortDesc: "This Pokemon's attacking stat is multiplied by 1.5 while using a Rock-type attack.",
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Rock') {
				this.debug('Miner boost (except not really because x1.5 multiplier)');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Rock') {
				this.debug('Miner boost (except not really because x1.5 multiplier)');
				return this.chainModify(1.5);
			}
		},
		id: "miner",
		name: "Miner",
	},
	"noncorporeal": {
		shortDesc: "This Pokemon can only be damaged by supereffective or Rock-type moves and indirect damage.",
		onTryHit(target, source, move) {
			if (target === source || move.category === 'Status' || move.type === '???' ||| move.type === 'Rock' || move.id === 'struggle') return;
			this.debug('Wonder Guard immunity: ' + move.id);
			if (target.runEffectiveness(move) <= 0) {
				this.add('-immune', target, '[from] ability: Noncorporeal');
				return null;
			}
		},
		id: "noncorporeal",
		name: "Noncorporeal",
	},
	"kalibersfury": {
		shortDesc: "Any attacks with 60 bp or less get a +1 to priority.",
		onModifyPriority: function(priority, pokemon, target, move, basePower) {
			if (move.category !== 'Status' && move.basePower <= 60) return priority + 1;
		},
		id: "kalibersfury",
		name: "Kaliber's Fury",
	},
	
	
	"mummy": {
		desc: "Pokemon making contact with this Pokemon have their Ability changed to Mummy. Does not affect the Battle Bond, Comatose, Disguise, Multitype, Power Construct, RKS System, Schooling, Shields Down, Stance Change, and Zen Mode Abilities.",
		shortDesc: "Pokemon making contact with this Pokemon have their Ability changed to Mummy.",
		id: "mummy",
		name: "Mummy",
		onAfterDamage(damage, target, source, move) {
			if (source && source !== target && move && move.flags['contact'] && source.ability !== 'mummy') {
				let oldAbility = source.setAbility('mummy', target);
				if (oldAbility) {
					this.add('-activate', target, 'ability: Mummy', this.getAbility(oldAbility).name, '[of] ' + source);
				}
			}
		},
		onBasePower(basePower, pokemon, target, move) {
			if (move.multihitType === 'parentalbond' && move.hit > 1) return this.chainModify(0.25);
			if (move.multihitType === 'fourheads' && move.hit > 1) return this.chainModify(0.3);
		},
		rating: 2.5,
		num: 152,
	},
	"damp": {
		desc: "While this Pokemon is active, Explosion, Mind Blown, Self-Destruct, and the Aftermath Ability are prevented from having an effect.",
		shortDesc: "Prevents Explosion/Mind Blown/Self-Destruct/Creeper Blast/Aftermath while this Pokemon is active.",
		id: "damp",
		onAnyTryMove(target, source, effect) {
			if (['explosion', 'mindblown', 'selfdestruct', 'creeperblast'].includes(effect.id)) {
				this.attrLastMove('[still]');
				this.add('cant', this.effectData.target, 'ability: Damp', effect, '[of] ' + target);
				return false;
			}
		},
		onAnyDamage(damage, target, source, effect) {
			if (effect && effect.id === 'aftermath') {
				return false;
			}
		},
		name: "Damp",
		rating: 1,
		num: 6,
	},
	//Expanded abilities start here.
	
	"cursed": {
		shortDesc: "This Pokemon hits Fairy super-effectively with Dark moves, but is weak to Water and takes an additional 2x damage.",
		onSourceEffectiveness(typeMod, target, type, move) {
			if (move && ((type === 'Fairy' && move.type === 'Dark'))) return 1;
			return typeMod;
		},
		onEffectiveness(typeMod, target, type, move) {
			if (move && move.type === 'Water') return (target.types[0] === type ? 1 : 0);
			return typeMod;
		}, /* I don't know how to force a 4x weakness so I'm going to do a pro gamer move */
		onSourceModifyAtkPriority: 6,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Water') {
				this.debug('Cursed strengthen');
				return this.chainModify(2);
			}
		},
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Water') {
				this.debug('Cursed strengthen');
				return this.chainModify(2);
			}
		},
		id: "cursed",
		name: "Cursed",
    },
	"voiceless": {
		shortDesc: "Punching moves 1.5x power, sound moves Physical.",
		onBasePowerPriority: 8,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['sound']) {
				this.debug('voiceless boost');
				return this.chainModify(1.5);
			}
		},
		onModifyMove(move) {
			if (move.flags['sound'] && move.category !== 'Status') {
				move.category = 'Physical';
				delete move.flags['sound'];
			}
		},
		id: "voiceless",
		name: "voiceless",
	},
};
