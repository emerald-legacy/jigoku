import BaseCard from './basecard';
import DuplicateUniqueAction from './duplicateuniqueaction.js';
import CourtesyAbility from './KeywordAbilities/CourtesyAbility';
import PrideAbility from './KeywordAbilities/PrideAbility';
import SincerityAbility from './KeywordAbilities/SincerityAbility';
import { RallyAbility } from './KeywordAbilities/RallyAbility.js';
import StatModifier from './StatModifier';

import { Locations, EffectNames, CardTypes, PlayTypes, ConflictTypes, EventNames } from './Constants';
import { GameModes } from '../GameModes';
import { EventRegistrar } from './EventRegistrar';
import { ThrivingAbility } from './KeywordAbilities/ThrivingAbility';
import type Player from './player';
import type Ring from './ring';
import type { AbilityContext } from './AbilityContext';

interface MenuItem {
    command: string;
    text: string;
}

class DrawCard extends BaseCard {
    fromOutOfPlaySource?: BaseCard[];
    eventRegistrarForEphemeral?: EventRegistrar;

    menu: MenuItem[] = [
        { command: 'bow', text: 'Bow/Ready' },
        { command: 'honor', text: 'Honor' },
        { command: 'dishonor', text: 'Dishonor' },
        { command: 'taint', text: 'Taint/Cleanse' },
        { command: 'addfate', text: 'Add 1 fate' },
        { command: 'remfate', text: 'Remove 1 fate' },
        { command: 'move', text: 'Move into/out of conflict' },
        { command: 'control', text: 'Give control' }
    ];

    defaultController: Player;
    parent: DrawCard | null;
    printedMilitarySkill: number;
    printedPoliticalSkill: number;
    printedCost: number | null;
    printedGlory: number;
    printedStrengthBonus: number;
    fate: number;
    bowed: boolean;
    covert: boolean;
    isConflict: boolean;
    isDynasty: boolean;
    allowDuplicatesOfAttachment: boolean;
    inConflict: boolean = false;
    new: boolean = false;

    constructor(owner: Player, cardData: any) {
        super(owner, cardData);

        this.defaultController = owner;
        this.parent = null;

        this.printedMilitarySkill = this.getPrintedSkill('military');
        this.printedPoliticalSkill = this.getPrintedSkill('political');
        this.printedCost = parseInt(this.cardData.cost);

        if (typeof this.printedCost !== 'number' || isNaN(this.printedCost)) {
            if (this.type === CardTypes.Event) {
                this.printedCost = 0;
            } else {
                this.printedCost = null;
            }
        }
        this.printedGlory = parseInt(cardData.glory);
        this.printedStrengthBonus = parseInt(cardData.strength_bonus);
        this.fate = 0;
        this.bowed = false;
        this.covert = false;
        this.isConflict = cardData.side === 'conflict';
        this.isDynasty = cardData.side === 'dynasty';
        this.allowDuplicatesOfAttachment = !!cardData.attachment_allow_duplicates;

        if (cardData.type === CardTypes.Character) {
            this.abilities.reactions.push(new CourtesyAbility(this.game, this));
            this.abilities.reactions.push(new PrideAbility(this.game, this));
            this.abilities.reactions.push(new SincerityAbility(this.game, this));
        }
        if (cardData.type === CardTypes.Attachment) {
            this.abilities.reactions.push(new CourtesyAbility(this.game, this));
            this.abilities.reactions.push(new SincerityAbility(this.game, this));
        }
        if (cardData.type === CardTypes.Event && this.hasEphemeral()) {
            this.eventRegistrarForEphemeral = new EventRegistrar(this.game, this);
            this.eventRegistrarForEphemeral.register([{ [EventNames.OnCardPlayed]: 'handleEphemeral' }]);
        }
        if (this.isDynasty) {
            this.abilities.reactions.push(new RallyAbility(this.game, this));
            this.abilities.reactions.push(new ThrivingAbility(this.game, this));
        }
    }

    handleEphemeral(event: any): void {
        if (event.card === this) {
            if (this.location !== Locations.RemovedFromGame) {
                this.owner.moveCard(this, Locations.RemovedFromGame);
            }
            this.fromOutOfPlaySource = undefined;
        }
    }

    getPrintedSkill(type: string): number {
        if (type === 'military') {
            return this.cardData.military === null || this.cardData.military === undefined
                ? NaN
                : isNaN(parseInt(this.cardData.military))
                ? 0
                : parseInt(this.cardData.military);
        } else if (type === 'political') {
            return this.cardData.political === null || this.cardData.political === undefined
                ? NaN
                : isNaN(parseInt(this.cardData.political))
                ? 0
                : parseInt(this.cardData.political);
        }
        return NaN;
    }

    isLimited(): boolean {
        return this.hasKeyword('limited') || this.hasPrintedKeyword('limited');
    }

    isRestricted(): boolean {
        return this.hasKeyword('restricted');
    }

    isAncestral(): boolean {
        return this.hasKeyword('ancestral');
    }

    isCovert(): boolean {
        return this.hasKeyword('covert');
    }

    hasSincerity(): boolean {
        return this.hasKeyword('sincerity');
    }

    hasPride(): boolean {
        return this.hasKeyword('pride');
    }

    hasCourtesy(): boolean {
        return this.hasKeyword('courtesy');
    }

    hasEphemeral(): boolean {
        return this.hasPrintedKeyword('ephemeral');
    }

    hasPeaceful(): boolean {
        return this.hasPrintedKeyword('peaceful');
    }

    hasNoDuels(): boolean {
        return this.hasKeyword('no duels');
    }

    isDire(): boolean {
        return this.getFate() === 0;
    }

    hasRally(): boolean {
        //Facedown cards are out of play and their keywords don't update until after the reveal reaction window is done, so we need to check for the printed keyword
        return this.hasKeyword('rally') || (!this.isBlank() && this.hasPrintedKeyword('rally'));
    }

    hasThriving(): boolean {
        return this.hasKeyword('thriving') || (!this.isBlank() && this.hasPrintedKeyword('thriving'));
    }

    getCost(): number | null {
        const copyEffect = this.mostRecentEffect(EffectNames.CopyCharacter);
        return copyEffect ? copyEffect.printedCost : this.printedCost;
    }

    getFate(): number {
        const rawEffects = this.getRawEffects().filter((effect: any) => effect.type === EffectNames.SetApparentFate);
        const apparentFate = this.mostRecentEffect(EffectNames.SetApparentFate);
        return rawEffects.length > 0 ? apparentFate : this.fate;
    }

    isInConflictProvince(): boolean {
        return this.game.currentConflict.isCardInConflictProvince(this);
    }

    costLessThan(num: number): boolean {
        const cost = this.printedCost;
        return num && (cost || cost === 0) && cost < num;
    }

    anotherUniqueInPlay(player: Player): boolean {
        return (
            this.isUnique() &&
            this.game.allCards.some(
                (card: any) =>
                    card.isInPlay() &&
                    card.printedName === this.printedName &&
                    card !== this &&
                    (card.owner === player || card.controller === player || card.owner === this.owner)
            )
        );
    }

    anotherUniqueInPlayControlledBy(player: Player): boolean {
        return (
            this.isUnique() &&
            this.game.allCards.some(
                (card: any) =>
                    card.isInPlay() &&
                    card.printedName === this.printedName &&
                    card !== this &&
                    card.controller === player
            )
        );
    }

    createSnapshot(): DrawCard {
        const clone = new DrawCard(this.owner, this.cardData);

        clone.attachments = this.attachments.map((attachment: DrawCard) => attachment.createSnapshot());
        clone.childCards = this.childCards.map((card: DrawCard) => card.createSnapshot());
        clone.effects = [...this.effects];
        clone.controller = this.controller;
        clone.bowed = this.bowed;
        clone.statusTokens = [...this.statusTokens];
        clone.location = this.location;
        clone.parent = this.parent;
        clone.fate = this.fate;
        clone.inConflict = this.inConflict;
        clone.traits = Array.from(this.getTraits());
        clone.uuid = this.uuid;
        return clone;
    }

    hasDash(type: string = ''): boolean {
        if (type === 'glory' || this.printedType !== CardTypes.Character) {
            return false;
        }

        const baseSkillModifiers = this.getBaseSkillModifiers();

        if (type === 'military') {
            return isNaN(baseSkillModifiers.baseMilitarySkill);
        } else if (type === 'political') {
            return isNaN(baseSkillModifiers.basePoliticalSkill);
        }

        return isNaN(baseSkillModifiers.baseMilitarySkill) || isNaN(baseSkillModifiers.basePoliticalSkill);
    }

    getContributionToConflict(type: string): number {
        const skillFunction = this.mostRecentEffect(EffectNames.ChangeContributionFunction);
        if (skillFunction) {
            return skillFunction(this);
        }
        return this.getSkill(type);
    }

    /**
     * Direct the skill query to the correct sub function.
     * @param type - The type of the skill; military or political
     * @return The chosen skill value
     */
    getSkill(type: string): number {
        if (type === 'military') {
            return this.getMilitarySkill();
        } else if (type === 'political') {
            return this.getPoliticalSkill();
        }
        return 0;
    }

    getBaseSkillModifiers(): {
        baseMilitaryModifiers: any[];
        baseMilitarySkill: number;
        basePoliticalModifiers: any[];
        basePoliticalSkill: number;
    } {
        const baseModifierEffects = [
            EffectNames.CopyCharacter,
            EffectNames.CalculatePrintedMilitarySkill,
            EffectNames.ModifyBaseMilitarySkillMultiplier,
            EffectNames.ModifyBasePoliticalSkillMultiplier,
            EffectNames.SetBaseMilitarySkill,
            EffectNames.SetBasePoliticalSkill,
            EffectNames.SetBaseDash,
            EffectNames.SwitchBaseSkills,
            EffectNames.SetBaseGlory
        ];

        const baseEffects = this.getRawEffects().filter((effect: any) => baseModifierEffects.includes(effect.type));
        let baseMilitaryModifiers = [StatModifier.fromCard(this.printedMilitarySkill, this, 'Printed skill', false)];
        let basePoliticalModifiers = [StatModifier.fromCard(this.printedPoliticalSkill, this, 'Printed skill', false)];
        let baseMilitarySkill = this.printedMilitarySkill;
        let basePoliticalSkill = this.printedPoliticalSkill;

        baseEffects.forEach((effect: any) => {
            switch (effect.type) {
                case EffectNames.CalculatePrintedMilitarySkill: {
                    const skillFunction = effect.getValue(this);
                    const calculatedSkillValue = skillFunction(this);
                    baseMilitarySkill = calculatedSkillValue;
                    baseMilitaryModifiers = baseMilitaryModifiers.filter(
                        (mod: any) => !mod.name.startsWith('Printed skill')
                    );
                    baseMilitaryModifiers.push(
                        StatModifier.fromEffect(
                            baseMilitarySkill,
                            effect,
                            false,
                            `Printed skill due to ${StatModifier.getEffectName(effect)}`
                        )
                    );
                    break;
                }
                case EffectNames.CopyCharacter: {
                    const copiedCard = effect.getValue(this);
                    baseMilitarySkill = copiedCard.getPrintedSkill('military');
                    basePoliticalSkill = copiedCard.getPrintedSkill('political');
                    // replace existing base or copied modifier
                    baseMilitaryModifiers = baseMilitaryModifiers.filter(
                        (mod: any) => !mod.name.startsWith('Printed skill')
                    );
                    basePoliticalModifiers = basePoliticalModifiers.filter(
                        (mod: any) => !mod.name.startsWith('Printed skill')
                    );
                    baseMilitaryModifiers.push(
                        StatModifier.fromEffect(
                            baseMilitarySkill,
                            effect,
                            false,
                            `Printed skill from ${copiedCard.name} due to ${StatModifier.getEffectName(effect)}`
                        )
                    );
                    basePoliticalModifiers.push(
                        StatModifier.fromEffect(
                            basePoliticalSkill,
                            effect,
                            false,
                            `Printed skill from ${copiedCard.name} due to ${StatModifier.getEffectName(effect)}`
                        )
                    );
                    break;
                }
                case EffectNames.SetBaseDash:
                    if (effect.getValue(this) === 'military') {
                        baseMilitaryModifiers.push(
                            StatModifier.fromEffect(undefined, effect, true, StatModifier.getEffectName(effect))
                        );
                        baseMilitarySkill = NaN;
                    }
                    if (effect.getValue(this) === 'political') {
                        basePoliticalModifiers.push(
                            StatModifier.fromEffect(undefined, effect, true, StatModifier.getEffectName(effect))
                        );
                        basePoliticalSkill = NaN;
                    }
                    break;
                case EffectNames.SetBaseMilitarySkill:
                    baseMilitarySkill = effect.getValue(this);
                    baseMilitaryModifiers.push(
                        StatModifier.fromEffect(
                            baseMilitarySkill,
                            effect,
                            true,
                            `Base set by ${StatModifier.getEffectName(effect)}`
                        )
                    );
                    break;
                case EffectNames.SetBasePoliticalSkill:
                    basePoliticalSkill = effect.getValue(this);
                    basePoliticalModifiers.push(
                        StatModifier.fromEffect(
                            basePoliticalSkill,
                            effect,
                            true,
                            `Base set by ${StatModifier.getEffectName(effect)}`
                        )
                    );
                    break;
                case EffectNames.SwitchBaseSkills: {
                    const milChange = Math.max(basePoliticalSkill, 0) - Math.max(baseMilitarySkill, 0);
                    const polChange = Math.max(baseMilitarySkill, 0) - Math.max(basePoliticalSkill, 0);
                    baseMilitarySkill += milChange;
                    basePoliticalSkill += polChange;
                    baseMilitaryModifiers.push(
                        StatModifier.fromEffect(
                            milChange,
                            effect,
                            false,
                            `Base due to ${StatModifier.getEffectName(effect)}`
                        )
                    );
                    basePoliticalModifiers.push(
                        StatModifier.fromEffect(
                            polChange,
                            effect,
                            false,
                            `Base due to ${StatModifier.getEffectName(effect)}`
                        )
                    );
                    break;
                }
                case EffectNames.ModifyBaseMilitarySkillMultiplier: {
                    const milChange = (effect.getValue(this) - 1) * baseMilitarySkill;
                    baseMilitarySkill += milChange;
                    baseMilitaryModifiers.push(
                        StatModifier.fromEffect(
                            milChange,
                            effect,
                            false,
                            `Base due to ${StatModifier.getEffectName(effect)}`
                        )
                    );
                    break;
                }
                case EffectNames.ModifyBasePoliticalSkillMultiplier: {
                    const polChange = (effect.getValue(this) - 1) * basePoliticalSkill;
                    basePoliticalSkill += polChange;
                    basePoliticalModifiers.push(
                        StatModifier.fromEffect(
                            polChange,
                            effect,
                            false,
                            `Base due to ${StatModifier.getEffectName(effect)}`
                        )
                    );
                    break;
                }
            }
        });

        const overridingMilModifiers = baseMilitaryModifiers.filter((mod: any) => mod.overrides);
        if (overridingMilModifiers.length > 0) {
            const lastModifier = overridingMilModifiers.at(-1);
            baseMilitaryModifiers = [lastModifier];
            baseMilitarySkill = lastModifier.amount;
        }
        const overridingPolModifiers = basePoliticalModifiers.filter((mod: any) => mod.overrides);
        if (overridingPolModifiers.length > 0) {
            const lastModifier = overridingPolModifiers.at(-1);
            basePoliticalModifiers = [lastModifier];
            basePoliticalSkill = lastModifier.amount;
        }

        return {
            baseMilitaryModifiers: baseMilitaryModifiers,
            baseMilitarySkill: baseMilitarySkill,
            basePoliticalModifiers: basePoliticalModifiers,
            basePoliticalSkill: basePoliticalSkill
        };
    }

    getStatusTokenSkill(): number {
        const modifiers = this.getStatusTokenModifiers();
        const skill = modifiers.reduce((total: number, modifier: any) => total + modifier.amount, 0);
        if (isNaN(skill)) {
            return 0;
        }
        return skill;
    }

    getStatusTokenModifiers(): any[] {
        let modifiers: any[] = [];
        const modifierEffects = this.getRawEffects().filter(
            (effect: any) => effect.type === EffectNames.ModifyBothSkills
        );

        // skill modifiers
        modifierEffects.forEach((modifierEffect: any) => {
            const value = modifierEffect.getValue(this);
            modifiers.push(StatModifier.fromEffect(value, modifierEffect));
        });
        modifiers = modifiers.filter((modifier: any) => modifier.type === 'token');

        // adjust honor status effects
        this.adjustHonorStatusModifiers(modifiers);
        return modifiers;
    }

    getMilitaryModifiers(exclusions?: any): any[] {
        const baseSkillModifiers = this.getBaseSkillModifiers();
        if (isNaN(baseSkillModifiers.baseMilitarySkill)) {
            return baseSkillModifiers.baseMilitaryModifiers;
        }

        if (!exclusions) {
            exclusions = [];
        }

        let rawEffects;
        if (typeof exclusions === 'function') {
            rawEffects = this.getRawEffects().filter((effect: any) => !exclusions(effect));
        } else {
            rawEffects = this.getRawEffects().filter((effect: any) => !exclusions.includes(effect.type));
        }

        // set effects
        const setEffects = rawEffects.filter(
            (effect: any) => effect.type === EffectNames.SetMilitarySkill || effect.type === EffectNames.SetDash
        );
        if (setEffects.length > 0) {
            const latestSetEffect = setEffects.at(-1);
            const setAmount = latestSetEffect.type === EffectNames.SetDash ? undefined : latestSetEffect.getValue(this);
            return [
                StatModifier.fromEffect(
                    setAmount,
                    latestSetEffect,
                    true,
                    `Set by ${StatModifier.getEffectName(latestSetEffect)}`
                )
            ];
        }

        const modifiers = baseSkillModifiers.baseMilitaryModifiers;

        // skill modifiers
        const modifierEffects = rawEffects.filter(
            (effect: any) =>
                effect.type === EffectNames.AttachmentMilitarySkillModifier ||
                effect.type === EffectNames.ModifyMilitarySkill ||
                effect.type === EffectNames.ModifyBothSkills
        );
        modifierEffects.forEach((modifierEffect: any) => {
            const value = modifierEffect.getValue(this);
            modifiers.push(StatModifier.fromEffect(value, modifierEffect));
        });

        // adjust honor status effects
        this.adjustHonorStatusModifiers(modifiers);

        // multipliers
        const multiplierEffects = rawEffects.filter(
            (effect: any) => effect.type === EffectNames.ModifyMilitarySkillMultiplier
        );
        multiplierEffects.forEach((multiplierEffect: any) => {
            const multiplier = multiplierEffect.getValue(this);
            const currentTotal = modifiers.reduce((total: number, modifier: any) => total + modifier.amount, 0);
            const amount = (multiplier - 1) * currentTotal;
            modifiers.push(StatModifier.fromEffect(amount, multiplierEffect));
        });

        return modifiers;
    }

    getPoliticalModifiers(exclusions?: any): any[] {
        const baseSkillModifiers = this.getBaseSkillModifiers();
        if (isNaN(baseSkillModifiers.basePoliticalSkill)) {
            return baseSkillModifiers.basePoliticalModifiers;
        }

        if (!exclusions) {
            exclusions = [];
        }

        let rawEffects;
        if (typeof exclusions === 'function') {
            rawEffects = this.getRawEffects().filter((effect: any) => !exclusions(effect));
        } else {
            rawEffects = this.getRawEffects().filter((effect: any) => !exclusions.includes(effect.type));
        }

        // set effects
        const setEffects = rawEffects.filter((effect: any) => effect.type === EffectNames.SetPoliticalSkill);
        if (setEffects.length > 0) {
            const latestSetEffect = setEffects.at(-1);
            const setAmount = latestSetEffect.getValue(this);
            return [
                StatModifier.fromEffect(
                    setAmount,
                    latestSetEffect,
                    true,
                    `Set by ${StatModifier.getEffectName(latestSetEffect)}`
                )
            ];
        }

        const modifiers = baseSkillModifiers.basePoliticalModifiers;

        // skill modifiers
        const modifierEffects = rawEffects.filter(
            (effect: any) =>
                effect.type === EffectNames.AttachmentPoliticalSkillModifier ||
                effect.type === EffectNames.ModifyPoliticalSkill ||
                effect.type === EffectNames.ModifyBothSkills
        );
        modifierEffects.forEach((modifierEffect: any) => {
            const value = modifierEffect.getValue(this);
            modifiers.push(StatModifier.fromEffect(value, modifierEffect));
        });

        // adjust honor status effects
        this.adjustHonorStatusModifiers(modifiers);

        // multipliers
        const multiplierEffects = rawEffects.filter(
            (effect: any) => effect.type === EffectNames.ModifyPoliticalSkillMultiplier
        );
        multiplierEffects.forEach((multiplierEffect: any) => {
            const multiplier = multiplierEffect.getValue(this);
            const currentTotal = modifiers.reduce((total: number, modifier: any) => total + modifier.amount, 0);
            const amount = (multiplier - 1) * currentTotal;
            modifiers.push(StatModifier.fromEffect(amount, multiplierEffect));
        });

        return modifiers;
    }

    adjustHonorStatusModifiers(modifiers: any[]): void {
        // This is Yojiro's ability
        const doesNotModifyEffects = this.getRawEffects().filter(
            (effect: any) => effect.type === EffectNames.HonorStatusDoesNotModifySkill
        );
        let doesNotModifyConflictEffects = false;
        if (this.game.currentConflict && this.isParticipating()) {
            doesNotModifyConflictEffects = this.game.currentConflict.anyEffect(EffectNames.ConflictIgnoreStatusTokens);
        }
        if (doesNotModifyEffects.length > 0 || doesNotModifyConflictEffects) {
            modifiers.forEach((modifier: any) => {
                if (modifier.type === 'token' && modifier.amount !== 0) {
                    modifier.amount = 0;
                    modifier.name += ` (${StatModifier.getEffectName(doesNotModifyEffects[0])})`;
                }
            });
        }
        // This is Sadako's ability
        const reverseEffects = this.getRawEffects().filter(
            (effect: any) => effect.type === EffectNames.HonorStatusReverseModifySkill
        );
        if (reverseEffects.length > 0) {
            modifiers.forEach((modifier: any) => {
                if (modifier.type === 'token' && modifier.amount !== 0 && modifier.name === 'Dishonored Token') {
                    modifier.amount = 0 - modifier.amount;
                    modifier.name += ` (${StatModifier.getEffectName(reverseEffects[0])})`;
                }
            });
        }
    }

    get showStats(): boolean {
        return this.location === Locations.PlayArea && this.type === CardTypes.Character;
    }

    get militarySkillSummary(): { stat?: string; modifiers?: any[] } {
        if (!this.showStats) {
            return {};
        }
        const modifiers = this.getMilitaryModifiers().map((modifier: any) => Object.assign({}, modifier));
        const skill = modifiers.reduce((total: number, modifier: any) => total + modifier.amount, 0);
        return {
            stat: isNaN(skill) ? '-' : Math.max(skill, 0).toString(),
            modifiers: modifiers
        };
    }

    get politicalSkillSummary(): { stat?: string; modifiers?: any[] } {
        if (!this.showStats) {
            return {};
        }
        const modifiers = this.getPoliticalModifiers().map((modifier: any) => Object.assign({}, modifier));
        modifiers.forEach((modifier: any) => (modifier = Object.assign({}, modifier)));
        const skill = modifiers.reduce((total: number, modifier: any) => total + modifier.amount, 0);
        return {
            stat: isNaN(skill) ? '-' : Math.max(skill, 0).toString(),
            modifiers: modifiers
        };
    }

    get glorySummary(): { stat?: string; modifiers?: any[] } {
        if (!this.showStats) {
            return {};
        }
        const modifiers = this.getGloryModifiers().map((modifier: any) => Object.assign({}, modifier));
        modifiers.forEach((modifier: any) => (modifier = Object.assign({}, modifier)));
        const stat = modifiers.reduce((total: number, modifier: any) => total + modifier.amount, 0);
        return {
            stat: Math.max(stat, 0).toString(),
            modifiers: modifiers
        };
    }

    get glory(): number {
        return this.getGlory();
    }

    getGlory(): number {
        const gloryModifiers = this.getGloryModifiers();
        const glory = gloryModifiers.reduce((total: number, modifier: any) => total + modifier.amount, 0);
        if (isNaN(glory)) {
            return 0;
        }
        return Math.max(0, glory);
    }

    getGloryModifiers(): any[] {
        const gloryModifierEffects = [
            EffectNames.CopyCharacter,
            EffectNames.SetGlory,
            EffectNames.ModifyGlory,
            EffectNames.SetBaseGlory
        ];

        // glory undefined (Holding etc.)
        if (this.printedGlory === undefined) {
            return [];
        }

        const gloryEffects = this.getRawEffects().filter((effect: any) => gloryModifierEffects.includes(effect.type));

        const gloryModifiers: any[] = [];

        // set effects
        const setEffects = gloryEffects.filter((effect: any) => effect.type === EffectNames.SetGlory);
        if (setEffects.length > 0) {
            const latestSetEffect = setEffects.at(-1);
            const setAmount = latestSetEffect.getValue(this);
            return [
                StatModifier.fromEffect(
                    setAmount,
                    latestSetEffect,
                    true,
                    `Set by ${StatModifier.getEffectName(latestSetEffect)}`
                )
            ];
        }

        // base effects/copy effects/printed glory
        const baseEffects = gloryEffects.filter((effect: any) => effect.type === EffectNames.SetBaseGlory);
        const copyEffects = gloryEffects.filter((effect: any) => effect.type === EffectNames.CopyCharacter);
        if (baseEffects.length > 0) {
            const latestBaseEffect = baseEffects.at(-1);
            const baseAmount = latestBaseEffect.getValue(this);
            gloryModifiers.push(
                StatModifier.fromEffect(
                    baseAmount,
                    latestBaseEffect,
                    true,
                    `Base set by ${StatModifier.getEffectName(latestBaseEffect)}`
                )
            );
        } else if (copyEffects.length > 0) {
            const latestCopyEffect = copyEffects.at(-1);
            const copiedCard = latestCopyEffect.getValue(this);
            gloryModifiers.push(
                StatModifier.fromEffect(
                    copiedCard.printedGlory,
                    latestCopyEffect,
                    false,
                    `Printed glory from ${copiedCard.name} due to ${StatModifier.getEffectName(latestCopyEffect)}`
                )
            );
        } else {
            gloryModifiers.push(StatModifier.fromCard(this.printedGlory, this, 'Printed glory', false));
        }

        // skill modifiers
        const modifierEffects = gloryEffects.filter((effect: any) => effect.type === EffectNames.ModifyGlory);
        modifierEffects.forEach((modifierEffect: any) => {
            const value = modifierEffect.getValue(this);
            gloryModifiers.push(StatModifier.fromEffect(value, modifierEffect));
        });

        return gloryModifiers;
    }

    getProvinceStrengthBonus(): number {
        const modifiers = this.getProvinceStrengthBonusModifiers();
        const bonus = modifiers.reduce((total: number, modifier: any) => total + modifier.amount, 0);
        if (bonus && this.isFaceup()) {
            return bonus;
        }
        return 0;
    }

    getProvinceStrengthBonusModifiers(): any[] {
        const strengthModifierEffects = [EffectNames.SetProvinceStrengthBonus, EffectNames.ModifyProvinceStrengthBonus];

        // strength bonus undefined (not a holding)
        if (this.printedStrengthBonus === undefined) {
            return [];
        }

        const strengthEffects = this.getRawEffects().filter((effect: any) =>
            strengthModifierEffects.includes(effect.type)
        );

        const strengthModifiers: any[] = [];

        // set effects
        const setEffects = strengthEffects.filter(
            (effect: any) => effect.type === EffectNames.SetProvinceStrengthBonus
        );
        if (setEffects.length > 0) {
            const latestSetEffect = setEffects.at(-1);
            const setAmount = latestSetEffect.getValue(this);
            return [
                StatModifier.fromEffect(
                    setAmount,
                    latestSetEffect,
                    true,
                    `Set by ${StatModifier.getEffectName(latestSetEffect)}`
                )
            ];
        }

        // skill modifiers
        strengthModifiers.push(
            StatModifier.fromCard(this.printedStrengthBonus, this, 'Printed province strength bonus', false)
        );
        const modifierEffects = strengthEffects.filter(
            (effect: any) => effect.type === EffectNames.ModifyProvinceStrengthBonus
        );
        modifierEffects.forEach((modifierEffect: any) => {
            const value = modifierEffect.getValue(this);
            strengthModifiers.push(StatModifier.fromEffect(value, modifierEffect));
        });

        return strengthModifiers;
    }

    get militarySkill(): number {
        return this.getMilitarySkill();
    }

    getMilitarySkill(floor: boolean = true): number {
        const modifiers = this.getMilitaryModifiers();
        const skill = modifiers.reduce((total: number, modifier: any) => total + modifier.amount, 0);
        if (isNaN(skill)) {
            return 0;
        }
        return floor ? Math.max(0, skill) : skill;
    }

    getMilitarySkillExcludingModifiers(exclusions: any, floor: boolean = true): number {
        if (!Array.isArray(exclusions) && typeof exclusions !== 'function') {
            exclusions = [exclusions];
        }
        const modifiers = this.getMilitaryModifiers(exclusions);
        const skill = modifiers.reduce((total: number, modifier: any) => total + modifier.amount, 0);
        if (isNaN(skill)) {
            return 0;
        }
        return floor ? Math.max(0, skill) : skill;
    }

    get politicalSkill(): number {
        return this.getPoliticalSkill();
    }

    getPoliticalSkill(floor: boolean = true): number {
        const modifiers = this.getPoliticalModifiers();
        const skill = modifiers.reduce((total: number, modifier: any) => total + modifier.amount, 0);
        if (isNaN(skill)) {
            return 0;
        }
        return floor ? Math.max(0, skill) : skill;
    }

    getPoliticalSkillExcludingModifiers(exclusions: any, floor: boolean = true): number {
        if (!Array.isArray(exclusions) && typeof exclusions !== 'function') {
            exclusions = [exclusions];
        }
        const modifiers = this.getPoliticalModifiers(exclusions);
        const skill = modifiers.reduce((total: number, modifier: any) => total + modifier.amount, 0);
        if (isNaN(skill)) {
            return 0;
        }
        return floor ? Math.max(0, skill) : skill;
    }

    get baseMilitarySkill(): number {
        return this.getBaseMilitarySkill();
    }

    getBaseMilitarySkill(): number {
        const skill = this.getBaseSkillModifiers().baseMilitarySkill;
        if (isNaN(skill)) {
            return 0;
        }
        return Math.max(0, skill);
    }

    get basePoliticalSkill(): number {
        return this.getBasePoliticalSkill();
    }

    getBasePoliticalSkill(): number {
        const skill = this.getBaseSkillModifiers().basePoliticalSkill;
        if (isNaN(skill)) {
            return 0;
        }
        return Math.max(0, skill);
    }

    getContributionToImperialFavor(): number {
        const canConributeWhileBowed = this.anyEffect(EffectNames.CanContributeGloryWhileBowed);
        const contributesGlory = canConributeWhileBowed || !this.bowed;
        return contributesGlory ? this.glory : 0;
    }

    modifyFate(amount: number): void {
        /**
         * @param amount - the amount of fate to modify this card's fate total by
         */
        this.fate = Math.max(0, this.fate + amount);
    }

    bow(): void {
        this.bowed = true;
    }

    ready(): void {
        this.bowed = false;
    }

    canPlay(context: AbilityContext, type: string = 'play'): boolean {
        return (
            this.checkRestrictions(type, context) &&
            context.player.checkRestrictions(type, context) &&
            this.checkRestrictions('play', context) &&
            context.player.checkRestrictions('play', context) &&
            (!this.hasPrintedKeyword('peaceful') || !this.game.currentConflict)
        );
    }

    getActions(location: string = this.location): any[] {
        if (location === Locations.PlayArea || this.type === CardTypes.Event) {
            return super.getActions();
        }
        const actions = this.type === CardTypes.Character ? [new DuplicateUniqueAction(this)] : [];
        return actions.concat(this.getPlayActions(), super.getActions());
    }

    /**
     * Deals with the engine effects of leaving play, making sure all statuses are removed. Anything which changes
     * the state of the card should be here. This is also called in some strange corner cases e.g. for attachments
     * which aren't actually in play themselves when their parent (which is in play) leaves play.
     */
    leavesPlay(): void {
        // If this is an attachment and is attached to another card, we need to remove all links between them
        if (this.parent && this.parent.attachments) {
            this.parent.removeAttachment(this);
            this.parent = null;
        }

        // Remove any cards underneath from the game
        const cardsUnderneath = this.controller.getSourceList(this.uuid).map((a: any) => a);
        if (cardsUnderneath.length > 0) {
            cardsUnderneath.forEach((card: any) => {
                this.controller.moveCard(card, Locations.RemovedFromGame);
            });
            this.game.addMessage(
                '{0} {1} removed from the game due to {2} leaving play',
                cardsUnderneath,
                cardsUnderneath.length === 1 ? 'is' : 'are',
                this
            );
        }

        const cacheParticipating = this.isParticipating();

        if (this.isParticipating()) {
            this.game.currentConflict.removeFromConflict(this);
        }

        const honorStatusDoesNotAffectLeavePlayEffects = this.anyEffect(EffectNames.HonorStatusDoesNotModifySkill);
        let honorStatusDoesNotAffectLeavePlayConflictEffects = false;
        if (this.game.currentConflict) {
            honorStatusDoesNotAffectLeavePlayConflictEffects =
                cacheParticipating && this.game.currentConflict.anyEffect(EffectNames.ConflictIgnoreStatusTokens);
        }
        const ignoreHonorStatus =
            honorStatusDoesNotAffectLeavePlayEffects || honorStatusDoesNotAffectLeavePlayConflictEffects;

        if (this.isDishonored && !ignoreHonorStatus) {
            const frameworkContext = this.game.getFrameworkContext();
            const honorLossAction = this.game.actions.loseHonor();

            if (honorLossAction.canAffect(this.controller, frameworkContext)) {
                this.game.addMessage("{0} loses 1 honor due to {1}'s personal honor", this.controller, this);
            }
            this.game.openThenEventWindow(honorLossAction.getEvent(this.controller, frameworkContext));
        } else if (this.isHonored && !ignoreHonorStatus) {
            const frameworkContext = this.game.getFrameworkContext();
            const honorGainAction = this.game.actions.gainHonor();
            if (honorGainAction.canAffect(this.controller, frameworkContext)) {
                this.game.addMessage("{0} gains 1 honor due to {1}'s personal honor", this.controller, this);
            }
            this.game.openThenEventWindow(honorGainAction.getEvent(this.controller, frameworkContext));
        }

        this.untaint();
        this.makeOrdinary();
        this.bowed = false;
        this.covert = false;
        this.new = false;
        this.fate = 0;
        super.leavesPlay();
    }

    resetForConflict(): void {
        this.covert = false;
        this.inConflict = false;
    }

    canBeBypassedByCovert(context: AbilityContext): boolean {
        return !this.isCovert() && this.checkRestrictions('applyCovert', context);
    }

    canDeclareAsAttacker(
        conflictType: string,
        ring: Ring,
        province?: any,
        incomingAttackers?: DrawCard[]
    ): boolean {
        if (!province) {
            const provinces =
                this.game.currentConflict && this.game.currentConflict.defendingPlayer
                    ? this.game.currentConflict.defendingPlayer.getProvinces()
                    : null;
            if (provinces) {
                return provinces.some(
                    (a: any) =>
                        a.canDeclare(conflictType, ring) &&
                        this.canDeclareAsAttacker(conflictType, ring, a, incomingAttackers)
                );
            }
        }

        let attackers = this.game.isDuringConflict() ? this.game.currentConflict.attackers : [];
        if (incomingAttackers) {
            attackers = incomingAttackers;
        }
        if (!attackers.includes(this)) {
            attackers = attackers.concat(this);
        }

        // Check if I add an element that I can't attack with
        const elementsAdded = this.attachments.reduce(
            (array: any[], attachment: DrawCard) =>
                array.concat(attachment.getEffects(EffectNames.AddElementAsAttacker)),
            this.getEffects(EffectNames.AddElementAsAttacker)
        );

        if (
            elementsAdded.some((element: string) =>
                this.game.rings[element]
                    .getEffects(EffectNames.CannotDeclareRing)
                    .some((match: any) => match(this.controller))
            )
        ) {
            return false;
        }

        if (
            conflictType === ConflictTypes.Military &&
            attackers.reduce(
                (total: number, card: DrawCard) => total + card.sumEffects(EffectNames.CardCostToAttackMilitary),
                0
            ) > this.controller.hand.size()
        ) {
            return false;
        }

        const fateCostToAttackProvince = province ? province.getFateCostToAttack() : 0;
        if (
            attackers.reduce(
                (total: number, card: DrawCard) => total + card.sumEffects(EffectNames.FateCostToAttack),
                0
            ) +
                fateCostToAttackProvince >
            this.controller.fate
        ) {
            return false;
        }
        if (this.anyEffect(EffectNames.CanOnlyBeDeclaredAsAttackerWithElement)) {
            for (const element of this.getEffects(EffectNames.CanOnlyBeDeclaredAsAttackerWithElement)) {
                if (!ring.hasElement(element) && !elementsAdded.includes(element)) {
                    return false;
                }
            }
        }

        if (this.controller.anyEffect(EffectNames.LimitLegalAttackers)) {
            const checks = this.controller.getEffects(EffectNames.LimitLegalAttackers);
            let valid = true;
            checks.forEach((check: any) => {
                if (typeof check === 'function') {
                    valid = valid && check(this);
                }
            });
            if (!valid) {
                return false;
            }
        }

        return (
            this.checkRestrictions('declareAsAttacker', this.game.getFrameworkContext()) &&
            this.canParticipateAsAttacker(conflictType) &&
            this.location === Locations.PlayArea &&
            !this.bowed
        );
    }

    canDeclareAsDefender(conflictType: string = this.game.currentConflict.conflictType): boolean {
        return (
            this.checkRestrictions('declareAsDefender', this.game.getFrameworkContext()) &&
            this.canParticipateAsDefender(conflictType) &&
            this.location === Locations.PlayArea &&
            !this.bowed &&
            !this.covert
        );
    }

    canParticipateAsAttacker(conflictType: string = this.game.currentConflict.conflictType): boolean {
        const effects = this.getEffects(EffectNames.CannotParticipateAsAttacker);
        return !effects.some((value: any) => value === 'both' || value === conflictType) && !this.hasDash(conflictType);
    }

    canParticipateAsDefender(conflictType: string = this.game.currentConflict.conflictType): boolean {
        const effects = this.getEffects(EffectNames.CannotParticipateAsDefender);
        const hasDash = conflictType ? this.hasDash(conflictType) : false;

        return !effects.some((value: any) => value === 'both' || value === conflictType) && !hasDash;
    }

    bowsOnReturnHome(): boolean {
        return !this.anyEffect(EffectNames.DoesNotBow);
    }

    setDefaultController(player: Player): void {
        this.defaultController = player;
    }

    getModifiedController(): Player {
        if (
            this.location === Locations.PlayArea ||
            (this.type === CardTypes.Holding && (this.location as string).includes('province'))
        ) {
            return this.mostRecentEffect(EffectNames.TakeControl) || this.defaultController;
        }
        return this.owner;
    }

    canDisguise(card: DrawCard, context: AbilityContext, intoConflictOnly: boolean): boolean {
        return (
            this.disguisedKeywordTraits.some((trait: string) => card.hasTrait(trait)) &&
            card.allowGameAction('discardFromPlay', context) &&
            !card.isUnique() &&
            (!intoConflictOnly || card.isParticipating())
        );
    }

    play(): void {
        //empty function so playcardaction doesn't crash the game
    }

    allowAttachment(attachment: BaseCard | DrawCard): boolean {
        const frameworkLimitsAttachmentsWithRepeatedNames =
            this.game.gameMode === GameModes.Emerald || this.game.gameMode === GameModes.Obsidian;
        if (frameworkLimitsAttachmentsWithRepeatedNames && this.type === CardTypes.Character) {
            if (
                this.attachments
                    .filter((a: DrawCard) => !a.allowDuplicatesOfAttachment)
                    .some(
                        (a: DrawCard) =>
                            a.id === attachment.id && a.controller === attachment.controller && a !== attachment
                    )
            ) {
                return false;
            }
        }
        return super.allowAttachment(attachment);
    }

    getSummary(activePlayer: Player, hideWhenFaceup?: boolean): any {
        const baseSummary = super.getSummary(activePlayer, hideWhenFaceup);

        return Object.assign(baseSummary, {
            attached: !!this.parent,
            attachments: this.attachments.map((attachment: DrawCard) => {
                return attachment.getSummary(activePlayer, hideWhenFaceup);
            }),
            childCards: this.childCards.map((card: DrawCard) => {
                return card.getSummary(activePlayer, hideWhenFaceup);
            }),
            inConflict: this.inConflict,
            isConflict: this.isConflict,
            isDynasty: this.isDynasty,
            isPlayableByMe: this.isConflict && this.controller.isCardInPlayableLocation(this, PlayTypes.PlayFromHand),
            isPlayableByOpponent:
                this.isConflict &&
                this.controller.opponent &&
                this.controller.opponent.isCardInPlayableLocation(this, PlayTypes.PlayFromHand),
            bowed: this.bowed,
            fate: this.fate,
            new: this.new,
            covert: this.covert,
            showStats: this.showStats,
            militarySkillSummary: this.militarySkillSummary,
            politicalSkillSummary: this.politicalSkillSummary,
            glorySummary: this.glorySummary,
            controller: this.controller.getShortSummary()
        });
    }
}

export = DrawCard;
