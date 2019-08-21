'use strict';

exports.BattleItems = {
    "shulkiumz": {
        id: "shulkiumz",
        name: "Shulkium Z",
        onTakeItem: false,
        zMove: "Monado Buster",
        zMoveFrom: "Sacred Sword",
        zMoveUser: ["Shulk"],
        desc: "If held by Shulk with Sacred Sword, he can use Monado Buster.",
    },
	 "christmasspirit": { 
		  id: "christmasspirit",
		  name: "Christmas Spirit",
		  spritenum: "184",
		  megaStone: "Smolitzer-Mega",
		  megaEvolves: "Smolitzer",
		  onTakeItem(item, source) {
			  if (item.megaEvolves === source.baseTemplate.baseSpecies) return false;
			  return true;
		  },
		 desc: "If held by the Smolitzer, this item allows it to Mega Evolve in battle."
	 },
    "siivagunniumz": {
        id: "siivagunniumz",
        name: "SiIvaGunniumZ",
        onTakeItem: false,
        zMove: "Stone Halation",
        zMoveFrom: "Snow Halation",
        zMoveUser: ["SiIvaGunner"],
        desc: "If held by SiIvaGunner with Snow Halation, he can use Stone Halation.",
    },
	"lifeorb": {
		id: "lifeorb",
		name: "Life Orb",
		spritenum: 249,
		fling: {
			basePower: 30,
		},
		onModifyDamage(damage, source, target, move) {
			return this.chainModify([0x14CC, 0x1000]);
		},
		onAfterMoveSecondarySelf(source, target, move) {
			if (source && source !== target && move && move.category !== 'Status' && !(source.hasAbility('abilitytodestroyanything') && move.hasSheerForce)) {
				this.damage(source.maxhp / 10, source, source, this.getItem('lifeorb'));
			}
		},
		num: 270,
		gen: 4,
		desc: "Holder's attacks do 1.3x damage, and it loses 1/10 its max HP after the attack.",
	},
};
