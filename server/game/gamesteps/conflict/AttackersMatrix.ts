import { ConflictType, EffectName } from '../../Constants.js';
import type Player from '../../Player.js';
import type Ring from '../../Ring.js';
import type DrawCard from '../../DrawCard.js';
import type { ProvinceCard } from '../../ProvinceCard.js';
import type Game from '../../Game.js';

class AttackerInfo {
    ring: Ring;
    conflictType: ConflictType;
    province: ProvinceCard;
    availableAttackers: DrawCard[];
    forcedAttackersDueToDeclarationAmountRequirement: DrawCard[];
    forcedAttackersDueToDeclarationRequirement: DrawCard[];

    constructor(ring: Ring, conflictType: ConflictType, province: ProvinceCard, availableAttackers: DrawCard[], forcedAttackersDueToDeclarationAmountRequirement: DrawCard[], forcedAttackersDueToDeclarationRequirement: DrawCard[]) {
        this.ring = ring;
        this.conflictType = conflictType;
        this.province = province;
        this.availableAttackers = availableAttackers;
        this.forcedAttackersDueToDeclarationAmountRequirement = forcedAttackersDueToDeclarationAmountRequirement;
        this.forcedAttackersDueToDeclarationRequirement = forcedAttackersDueToDeclarationRequirement;
    }

    getMaximumAvailableAttackers(): number {
        return this.availableAttackers.length;
    }

    getNumberOfForcedAttackers(): number {
        return this.forcedAttackersDueToDeclarationAmountRequirement.length;
    }
}

export class AttackersMatrix {
    player: Player;
    characters: DrawCard[];
    attackers: Record<string, Record<string, Record<string, AttackerInfo>>>;
    forcedNumberOfAttackers: number;
    requiredNumberOfAttackers: number;
    maximumNumberOfAttackers: number;
    defaultAttackers: DrawCard[];
    canPass: boolean;
    game: Game;
    defaultRing: Ring | null;
    defaultType: ConflictType;

    constructor(player: Player, characters: DrawCard[], game: Game) {
        this.player = player;
        this.characters = characters;
        this.attackers = {};
        this.forcedNumberOfAttackers = 0;
        this.requiredNumberOfAttackers = 0; //For Seven Stings Keep
        this.maximumNumberOfAttackers = 0; //For Seven Stings Keep
        this.defaultAttackers = [];
        this.canPass = true;
        this.game = game;
        this.defaultRing = null;
        this.defaultType = ConflictType.Military;
        this.buildMatrix(game);
    }

    isCombinationValid(ring: Ring, conflictType: ConflictType, province?: ProvinceCard | null): boolean {
        if(province && !Object.prototype.hasOwnProperty.call(this.attackers[ring.name][conflictType], String(province))) {
            return false;
        }

        const max = province ? this.attackers[ring.name][conflictType][String(province)].getMaximumAvailableAttackers() : Math.max(...Object.values(this.attackers[ring.name][conflictType]).map((a) => a.getMaximumAvailableAttackers()));
        const enoughAttackers = this.requiredNumberOfAttackers <= max;
        if(this.requiredNumberOfAttackers > 0) {
            return enoughAttackers;
        } else if(this.forcedNumberOfAttackers === 0) {
            return true;
        }
        if(province) {
            return this.attackers[ring.name][conflictType][String(province)].getNumberOfForcedAttackers() === this.forcedNumberOfAttackers && enoughAttackers;
        }
        return Object.values(this.attackers[ring.name][conflictType]).some((a) => a.getNumberOfForcedAttackers() === this.forcedNumberOfAttackers && enoughAttackers);
    }

    buildMatrix(game: Game): void {
        const rings: Ring[] = [game.rings.air, game.rings.earth, game.rings.fire, game.rings.void, game.rings.water];
        const conflictTypes: ConflictType[] = [ConflictType.Military, ConflictType.Political];
        const provinces: ProvinceCard[] = this.player.opponent ? this.player.opponent.getProvinces() : [];

        this.forcedNumberOfAttackers = 0;
        this.defaultRing = game.rings.air;
        this.defaultType = ConflictType.Military;
        rings.forEach((ring: Ring) => {
            this.attackers[ring.name] = {};
            conflictTypes.forEach((type) => {
                this.attackers[ring.name][type] = {};
                provinces.forEach((province: ProvinceCard) => {
                    if(province.canDeclare(type, ring)) {
                        const forcedAttackersDueToDeclarationAmountRequirement = this.getForcedAttackersByDeclarationAmountRequirement(ring, type, province);
                        const forcedAttackersDueToDeclarationRequirement = this.getForcedAttackersByDeclarationRequirement(ring, type, province);
                        const availableAttackers = this.getAvailableAttackers(ring, type, province);
                        const matrix = new AttackerInfo(ring, type, province, availableAttackers, forcedAttackersDueToDeclarationAmountRequirement, forcedAttackersDueToDeclarationRequirement);
                        this.attackers[ring.name][type][String(province)] = matrix;
                        if(matrix.getMaximumAvailableAttackers() > this.maximumNumberOfAttackers) {
                            this.maximumNumberOfAttackers = matrix.getMaximumAvailableAttackers();
                        }

                        if(matrix.getNumberOfForcedAttackers() > this.forcedNumberOfAttackers) {
                            this.forcedNumberOfAttackers = matrix.getNumberOfForcedAttackers();
                            this.defaultRing = ring;
                            this.defaultType = type;
                        }
                    }
                });
            });
        });
    }

    getAvailableAttackers(ring: Ring, conflictType: ConflictType, province: ProvinceCard): DrawCard[] {
        if(!this.player.hasLegalConflictDeclaration({ type: conflictType, ring: ring })) {
            return [];
        }

        const cards = this.characters;
        const availableAttackers: DrawCard[] = [];
        cards.forEach((card) => {
            if(card.canDeclareAsAttacker(conflictType, ring, province, availableAttackers)) {
                availableAttackers.push(card);
            }
        });
        return availableAttackers;
    }

    /** The ring and type may not be chosen yet: attackers can be picked first. */
    getForcedAttackers(ring: Ring | undefined, conflictType: ConflictType | undefined, province?: ProvinceCard | null): DrawCard[] {
        const optional = this.getOptionallyForcedAttackersByDeclarationRequirement(ring, conflictType, province);
        const optionalNumberOfAttackers = optional.length;
        if(this.requiredNumberOfAttackers + optionalNumberOfAttackers <= 0) {
            return this.getForcedAttackersByDeclarationAmountRequirement(ring, conflictType, province);
        }

        const normalForced = this.getForcedAttackersByDeclarationRequirement(ring, conflictType, province);
        const combined = [...optional, ...normalForced];
        return combined;
    }

    //Internal use only
    getForcedAttackersByDeclarationAmountRequirement(ring: Ring | undefined, conflictType: ConflictType | undefined, province?: ProvinceCard | null): DrawCard[] {
        if(!this.player.hasLegalConflictDeclaration({ type: conflictType, ring: ring, province: province })) {
            return [];
        }

        if(this.player.getEffects(EffectName.MustDeclareMaximumAttackers).some((effect) => effect === 'both' || effect === conflictType)) {
            const cards = this.characters;
            const forcedAttackers: DrawCard[] = [];
            cards.forEach((card) => {
                if(card.canDeclareAsAttacker(conflictType, ring, province, forcedAttackers)) {
                    forcedAttackers.push(card);
                }
            });
            if(forcedAttackers.length > 0) {
                this.canPass = false;
            }
            return forcedAttackers;
        }

        return this.characters.filter((card) =>
            card.canDeclareAsAttacker(conflictType, ring, province) &&
            card.getEffects(EffectName.MustBeDeclaredAsAttacker).some((effect) => effect === 'both' || effect === conflictType));
    }

    //Internal use only
    getOptionallyForcedAttackersByDeclarationRequirement(ring: Ring | undefined, conflictType: ConflictType | undefined, province?: ProvinceCard | null): DrawCard[] {
        if(!this.player.hasLegalConflictDeclaration({ type: conflictType, ring: ring, province: province })) {
            return [];
        }
        return this.characters.filter((card) =>
            card.canDeclareAsAttacker(conflictType, ring, province) &&
            card.getEffects(EffectName.MustBeDeclaredAsAttackerIfType).some((effect) => effect === 'both' || effect === conflictType));
    }

    getForcedAttackersByDeclarationRequirement(ring: Ring | undefined, conflictType: ConflictType | undefined, province?: ProvinceCard | null): DrawCard[] {
        if(!this.player.hasLegalConflictDeclaration({ type: conflictType, ring: ring, province: province })) {
            return [];
        }
        return this.characters.filter((card) =>
            card.canDeclareAsAttacker(conflictType, ring, province) &&
            card.getEffects(EffectName.MustBeDeclaredAsAttacker).some((effect) => effect === 'both' || effect === conflictType));
    }
}

