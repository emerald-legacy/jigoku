import { EffectNames } from '../../Constants.js';
import type Player from '../../player.js';

class AttackerInfo {
    ring: any;
    conflictType: string;
    province: any;
    availableAttackers: any[];
    forcedAttackersDueToDeclarationAmountRequirement: any[];
    forcedAttackersDueToDeclarationRequirement: any[];

    constructor(ring: any, conflictType: string, province: any, availableAttackers: any[], forcedAttackersDueToDeclarationAmountRequirement: any[], forcedAttackersDueToDeclarationRequirement: any[]) {
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

class AttackersMatrix {
    player: Player;
    characters: any[];
    attackers: Record<string, Record<string, Record<any, AttackerInfo>>>;
    forcedNumberOfAttackers: number;
    requiredNumberOfAttackers: number;
    maximumNumberOfAttackers: number;
    defaultAttackers: any[];
    canPass: boolean;
    game: any;
    defaultRing: any;
    defaultType: string;

    constructor(player: Player, characters: any[], game: any) {
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
        this.defaultType = 'military';
        this.buildMatrix(game);
    }

    isCombinationValid(ring: any, conflictType: string, province?: any): boolean {
        if(province && !Object.prototype.hasOwnProperty.call(this.attackers[ring.name][conflictType], province)) {
            return false;
        }

        let max = province ? this.attackers[ring.name][conflictType][province].getMaximumAvailableAttackers() : Math.max(...Object.values(this.attackers[ring.name][conflictType]).map(a => a.getMaximumAvailableAttackers()));
        let enoughAttackers = this.requiredNumberOfAttackers <= max;
        if(this.requiredNumberOfAttackers > 0) {
            return enoughAttackers;
        } else if(this.forcedNumberOfAttackers === 0) {
            return true;
        }
        if(province) {
            return this.attackers[ring.name][conflictType][province].getNumberOfForcedAttackers() === this.forcedNumberOfAttackers && enoughAttackers;
        }
        return Object.values(this.attackers[ring.name][conflictType]).some(a => a.getNumberOfForcedAttackers() === this.forcedNumberOfAttackers && enoughAttackers);
    }

    buildMatrix(game: any): void {
        const rings = [game.rings.air, game.rings.earth, game.rings.fire, game.rings.void, game.rings.water];
        const conflictTypes = ['military', 'political'];
        const provinces = (this.player as any).opponent ? (this.player as any).opponent.getProvinces() : [];

        this.forcedNumberOfAttackers = 0;
        this.defaultRing = game.rings.air;
        this.defaultType = 'military';
        rings.forEach((ring: any) => {
            this.attackers[ring.name] = {};
            conflictTypes.forEach(type => {
                this.attackers[ring.name][type] = {};
                provinces.forEach((province: any) => {
                    if(province.canDeclare(type, ring)) {
                        let forcedAttackersDueToDeclarationAmountRequirement = this.getForcedAttackersByDeclarationAmountRequirement(ring, type, province);
                        let forcedAttackersDueToDeclarationRequirement = this.getForcedAttackersByDeclarationRequirement(ring, type, province);
                        let availableAttackers = this.getAvailableAttackers(ring, type, province);
                        let matrix = new AttackerInfo(ring, type, province, availableAttackers, forcedAttackersDueToDeclarationAmountRequirement, forcedAttackersDueToDeclarationRequirement);
                        this.attackers[ring.name][type][province] = matrix;
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

    getAvailableAttackers(ring: any, conflictType: string, province: any): any[] {
        if(!(this.player as any).hasLegalConflictDeclaration({ type: conflictType, ring: ring })) {
            return [];
        }

        let cards = this.characters;
        let availableAttackers: any[] = [];
        cards.forEach(card => {
            if(card.canDeclareAsAttacker(conflictType, ring, province, availableAttackers)) {
                availableAttackers.push(card);
            }
        });
        return availableAttackers;
    }

    getForcedAttackers(ring: any, conflictType: string, province: any): any[] {
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
    getForcedAttackersByDeclarationAmountRequirement(ring: any, conflictType: string, province: any): any[] {
        if(!(this.player as any).hasLegalConflictDeclaration({ type: conflictType, ring: ring, province: province })) {
            return [];
        }

        if((this.player as any).getEffects(EffectNames.MustDeclareMaximumAttackers).some((effect: any) => effect === 'both' || effect === conflictType)) {
            let cards = this.characters;
            let forcedAttackers: any[] = [];
            cards.forEach(card => {
                if(card.canDeclareAsAttacker(conflictType, ring, province, forcedAttackers)) {
                    forcedAttackers.push(card);
                }
            });
            if(forcedAttackers.length > 0) {
                this.canPass = false;
            }
            return forcedAttackers;
        }

        return this.characters.filter(card =>
            card.canDeclareAsAttacker(conflictType, ring, province) &&
            card.getEffects(EffectNames.MustBeDeclaredAsAttacker).some((effect: any) => effect === 'both' || effect === conflictType));
    }

    //Internal use only
    getOptionallyForcedAttackersByDeclarationRequirement(ring: any, conflictType: string, province: any): any[] {
        if(!(this.player as any).hasLegalConflictDeclaration({ type: conflictType, ring: ring, province: province })) {
            return [];
        }
        return this.characters.filter(card =>
            card.canDeclareAsAttacker(conflictType, ring, province) &&
            card.getEffects(EffectNames.MustBeDeclaredAsAttackerIfType).some((effect: any) => effect === 'both' || effect === conflictType));
    }

    getForcedAttackersByDeclarationRequirement(ring: any, conflictType: string, province: any): any[] {
        if(!(this.player as any).hasLegalConflictDeclaration({ type: conflictType, ring: ring, province: province })) {
            return [];
        }
        return this.characters.filter(card =>
            card.canDeclareAsAttacker(conflictType, ring, province) &&
            card.getEffects(EffectNames.MustBeDeclaredAsAttacker).some((effect: any) => effect === 'both' || effect === conflictType));
    }
}

export default AttackersMatrix;
