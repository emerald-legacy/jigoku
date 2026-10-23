import { ConflictType, EffectName } from './Constants.js';
import type Game from './Game.js';
import type Player from './Player.js';
import type DrawCard from './DrawCard.js';
import type Ring from './Ring.js';
import type { ProvinceCard } from './ProvinceCard.js';

export interface ConflictDeclarationProperties {
    type?: ConflictType | ConflictType[];
    ring?: Ring | Ring[];
    attacker?: DrawCard;
    province?: ProvinceCard | ProvinceCard[] | null;
    forcedDeclaredType?: ConflictType;
}

export class PlayerConflictManager {
    declaredConflictOpportunities: Record<ConflictType, number> = {
        [ConflictType.Military]: 0,
        [ConflictType.Political]: 0,
        [ConflictType.Passed]: 0,
        [ConflictType.Forced]: 0
    };

    defaultAllowedConflicts: Record<ConflictType, number> = {
        [ConflictType.Military]: 1,
        [ConflictType.Political]: 1,
        [ConflictType.Passed]: 0,
        [ConflictType.Forced]: 0
    };

    constructor(private readonly player: Player, private readonly game: Game) { }

    hasLegalConflictDeclaration(properties: ConflictDeclarationProperties): boolean {
        const conflictType = this.getLegalConflictTypes(properties);
        if(conflictType.length === 0) {
            return false;
        }
        let conflictRing = properties.ring || Object.values(this.game.rings);
        conflictRing = Array.isArray(conflictRing) ? conflictRing : [conflictRing];
        conflictRing = conflictRing.filter((ring: Ring) => ring.canDeclare(this.player));
        if(conflictRing.length === 0) {
            return false;
        }
        const cards = properties.attacker ? [properties.attacker] : this.player.cardsInPlay.slice();
        if(!this.player.opponent) {
            return conflictType.some((type) =>
                conflictRing.some((ring: Ring) => cards.some((card: DrawCard) => card.canDeclareAsAttacker(type, ring)))
            );
        }
        let conflictProvince = properties.province || this.player.opponent.getProvinces();
        conflictProvince = Array.isArray(conflictProvince) ? conflictProvince : [conflictProvince];
        return conflictType.some((type) =>
            conflictRing.some((ring: Ring) =>
                conflictProvince.some(
                    (province: ProvinceCard) =>
                        province.canDeclare(type, ring) &&
                        cards.some((card: DrawCard) => card.canDeclareAsAttacker(type, ring, province, this.game.currentConflict?.attackers))
                )
            )
        );
    }

    getConflictOpportunities(): number {
        const opportunities = this.#getUncappedConflictOpportunities();
        const maxDeclared = this.player.mostRecentEffect(EffectName.SetMaxDeclaredConflicts);
        if(maxDeclared === undefined) {
            return opportunities;
        }
        const declared = this.game.getDeclaredConflictCount(this.player);
        return Math.min(opportunities, Math.max(0, maxDeclared - declared));
    }

    #getUncappedConflictOpportunities(): number {
        const maxConflicts = this.player.mostRecentEffect(EffectName.SetMaxConflicts);
        const skirmishModeRRGLimit = this.game.rules.conflictOneFewerOpportunity ? 1 : 0;
        if(maxConflicts) {
            return this.getConflictsWhenMaxIsSet(maxConflicts);
        }

        const declarationType =
            this.player.mostRecentEffect(EffectName.ProvideConflictDeclarationType) ??
            this.player.mostRecentEffect(EffectName.ForceConflictDeclarationType) ??
            this.player.mostRecentEffect(EffectName.SetConflictDeclarationType);
        if(declarationType) {
            return (
                this.getRemainingConflictOpportunitiesForType(declarationType) -
                this.declaredConflictOpportunities[ConflictType.Passed] -
                this.declaredConflictOpportunities[ConflictType.Forced]
            );
        }

        return (
            this.getRemainingConflictOpportunitiesForType(ConflictType.Military) +
            this.getRemainingConflictOpportunitiesForType(ConflictType.Political) -
            this.declaredConflictOpportunities[ConflictType.Passed] -
            this.declaredConflictOpportunities[ConflictType.Forced] -
            skirmishModeRRGLimit
        );
    }

    getRemainingConflictOpportunitiesForType(type: ConflictType): number {
        return Math.max(0, this.getMaxConflictOpportunitiesForPlayerByType(type) - this.declaredConflictOpportunities[type]);
    }

    getLegalConflictTypes(properties: ConflictDeclarationProperties): ConflictType[] {
        let types = properties.type || [ConflictType.Military, ConflictType.Political];
        types = Array.isArray(types) ? types : [types];
        const forcedDeclaredType =
            properties.forcedDeclaredType ||
            (this.game.currentConflict && this.game.currentConflict.forcedDeclaredType);
        if(forcedDeclaredType) {
            return [forcedDeclaredType].filter(
                (type) =>
                    types.includes(type) &&
                    this.getConflictOpportunities() > 0 &&
                    !this.player.getEffects(EffectName.CannotDeclareConflictsOfType).includes(type)
            );
        }

        if(this.getConflictOpportunities() === 0) {
            return [];
        }

        return types.filter(
            (type) =>
                this.getRemainingConflictOpportunitiesForType(type) > 0 &&
                !this.player.getEffects(EffectName.CannotDeclareConflictsOfType).includes(type)
        );
    }

    getConflictsWhenMaxIsSet(maxConflicts: number): number {
        return Math.max(0, maxConflicts - this.game.getConflicts(this.player).length);
    }

    getMaxConflictOpportunitiesForPlayerByType(type: ConflictType): number {
        let setConflictType: ConflictType | undefined = this.player.mostRecentEffect(EffectName.SetConflictDeclarationType);
        let forceConflictType: ConflictType | undefined = this.player.mostRecentEffect(EffectName.ForceConflictDeclarationType);
        const provideConflictDeclarationType = this.player.mostRecentEffect(EffectName.ProvideConflictDeclarationType);
        const additionalConflictEffects = this.player.getEffects(EffectName.AdditionalConflict);
        const additionalConflictsForType = additionalConflictEffects.filter((x) => x === type).length;
        let baselineAvailableConflicts =
            this.defaultAllowedConflicts[ConflictType.Military] +
            this.defaultAllowedConflicts[ConflictType.Political];
        if(provideConflictDeclarationType && setConflictType !== provideConflictDeclarationType) {
            setConflictType = undefined;
        }
        if(provideConflictDeclarationType && forceConflictType !== provideConflictDeclarationType) {
            forceConflictType = undefined;
        }

        if(this.game.rules.conflictOneFewerOpportunity) {
            baselineAvailableConflicts = 1;
        }

        if(setConflictType && type === setConflictType) {
            const declaredConflictsOfOtherType = this.declaredConflictOpportunities[setConflictType === ConflictType.Military ? ConflictType.Political : ConflictType.Military];
            return baselineAvailableConflicts + additionalConflictEffects.length - declaredConflictsOfOtherType;
        } else if(setConflictType && type !== setConflictType) {
            return 0;
        }
        if(forceConflictType && type === forceConflictType) {
            const declaredConflictsOfOtherType = this.declaredConflictOpportunities[forceConflictType === ConflictType.Military ? ConflictType.Political : ConflictType.Military];
            return baselineAvailableConflicts + additionalConflictEffects.length - declaredConflictsOfOtherType;
        } else if(forceConflictType && type !== forceConflictType) {
            return 0;
        }
        if(provideConflictDeclarationType) {
            const declaredConflictsOfOtherType = this.declaredConflictOpportunities[type === ConflictType.Military ? ConflictType.Political : ConflictType.Military];
            const availableAll =
                baselineAvailableConflicts +
                additionalConflictEffects.length -
                declaredConflictsOfOtherType;
            if(type === provideConflictDeclarationType) {
                return availableAll;
            }
            const maxType = this.defaultAllowedConflicts[type] + additionalConflictsForType;
            const declaredType = this.declaredConflictOpportunities[type];
            return Math.min(maxType - declaredType, availableAll);
        }
        return this.defaultAllowedConflicts[type] + additionalConflictsForType;
    }

    resetConflictOpportunities(): void {
        this.declaredConflictOpportunities[ConflictType.Military] = 0;
        this.declaredConflictOpportunities[ConflictType.Political] = 0;
        this.declaredConflictOpportunities[ConflictType.Passed] = 0;
        this.declaredConflictOpportunities[ConflictType.Forced] = 0;
    }
}
