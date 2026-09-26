import { GameModes } from '../GameModes.js';
import { EffectName, Element, Location } from './Constants.js';
import type { ElementSymbolInfo } from './ElementSymbol.js';
import AbilityDsl from './abilitydsl.js';
import BaseCard from './BaseCard.js';
import type Player from './Player.js';
import type DrawCard from './DrawCard.js';
import StatModifier from './StatModifier.js';
import type { CardData } from './types/CardData.js';
import { type CardEffect, isEffectOf } from './Effects/types.js';
import type { NumericEffectName } from './Effects/EffectValueMap.js';
import type { StateViewer } from './types/StateViewer.js';

export class ProvinceCard extends BaseCard {
    isProvince = true;
    isBroken = false;
    menu = [
        { command: 'break', text: 'Break/unbreak this province' },
        { command: 'hide', text: 'Flip face down' },
        { command: 'dishonor', text: 'Dishonor' },
        { command: 'honor', text: 'Honor' },
        { command: 'taint', text: 'Taint/Cleanse' }
    ];

    constructor(
        owner: Player,
        cardData: CardData = {
            strength: 3,
            elements: [],
            type: 'province',
            side: 'province',
            name: 'Skirmish Province',
            id: 'skirmish-province'
        }
    ) {
        super(owner, cardData);
        this.persistentEffect({
            condition: (context) => context.source.hasEminent(),
            location: Location.Any,
            effect: AbilityDsl.effects.cardCannot('turnFacedown')
        });
    }

    override checkForIllegalAttachments(): boolean {
        return this.attachmentHost.checkForIllegalAttachments();
    }

    get strength() {
        return this.getStrength();
    }

    getStrength(): number {
        if(this.anyEffect(EffectName.SetProvinceStrength)) {
            return this.mostRecentEffect(EffectName.SetProvinceStrength);
        }

        const strength =
            this.baseStrength +
            this.sumEffects(EffectName.ModifyProvinceStrength) +
            this.getDynastyOrStrongholdCardModifier();
        const multipliedStrength = this.getEffects(EffectName.ModifyProvinceStrengthMultiplier).reduce(
            (total: number, value: number) => total * value,
            strength
        );
        return Math.max(0, multipliedStrength);
    }

    get baseStrength() {
        return this.getBaseStrength();
    }

    get printedStrength() {
        const parsed = parseInt(String(this.cardData.strength ?? ''), 10);
        return isNaN(parsed) ? 0 : parsed;
    }

    getCardStrength(): number {
        const copiedProvince = this.mostRecentEffect(EffectName.CopyProvince);
        const strength = (copiedProvince || this).cardData.strength;
        return parseInt(String(strength ?? '')) || 0;
    }

    getBaseStrength(): number {
        if(this.anyEffect(EffectName.SetBaseProvinceStrength)) {
            return this.mostRecentEffect(EffectName.SetBaseProvinceStrength);
        }
        return this.sumEffects(EffectName.ModifyBaseProvinceStrength) + this.getCardStrength();
    }

    getDynastyOrStrongholdCardModifier(): number {
        const canBeIncreased = !this.anyEffect(EffectName.ProvinceCannotHaveSkillIncreased);
        return this.controller.getSourceList(this.location).reduce((total, card) => {
            const bonus = card.getProvinceStrengthBonus();
            return total + (canBeIncreased ? bonus : Math.min(bonus, 0));
        }, 0);
    }

    getStrengthModifiers(): StatModifier[] {
        const effectsOf = <N extends NumericEffectName>(type: N) => this.getRawEffects().filter((effect) => isEffectOf(effect, type));
        const setModifier = (effect: CardEffect<NumericEffectName>) =>
            StatModifier.fromEffect(effect.getValue(this), effect, true, StatModifier.getEffectName(effect));

        // Set effects override everything
        const setEffect = effectsOf(EffectName.SetProvinceStrength).at(-1);
        if(setEffect) {
            return [setModifier(setEffect)];
        }

        const modifiers: StatModifier[] = [];
        const setBaseEffect = effectsOf(EffectName.SetBaseProvinceStrength).at(-1);
        if(setBaseEffect) {
            modifiers.push(setModifier(setBaseEffect));
        } else {
            modifiers.push(new StatModifier(this.getCardStrength(), 'Printed', false, undefined));
            for(const effect of effectsOf(EffectName.ModifyBaseProvinceStrength)) {
                modifiers.push(StatModifier.fromEffect(effect.getValue(this), effect, false));
            }
        }
        for(const effect of effectsOf(EffectName.ModifyProvinceStrength)) {
            modifiers.push(StatModifier.fromEffect(effect.getValue(this), effect, false));
        }

        // Dynasty/stronghold card bonus
        const dynastyBonus = this.getDynastyOrStrongholdCardModifier();
        if(dynastyBonus !== 0) {
            modifiers.push(new StatModifier(dynastyBonus, 'Cards in Province', false, undefined));
        }

        return modifiers;
    }

    get strengthSummary(): { stat?: string; modifiers?: StatModifier[] } {
        if(this.facedown) {
            return {};
        }
        const modifiers = this.getStrengthModifiers().map((modifier) => Object.assign({}, modifier));
        return { stat: this.getStrength().toString(), modifiers };
    }

    get element() {
        return this.getElement();
    }

    getElement(): Element[] {
        const copiedProvince = this.mostRecentEffect(EffectName.CopyProvince);
        if(copiedProvince) {
            return copiedProvince.getElement();
        }
        return this.getCurrentElementSymbols()
            .filter((symbol) => symbol.key.startsWith('province-element'))
            .map((symbol) => symbol.element);
    }

    isElement(element: string): boolean {
        return this.element.some((provinceElement) => provinceElement === element);
    }

    hasElementSymbols(): boolean {
        return !!this.cardData.elements && this.cardData.elements.length > 0;
    }

    getPrintedElementSymbols(): ElementSymbolInfo[] {
        if(!this.hasElementSymbols()) {
            return [];
        }
        const elements = this.cardData.elements === 'all' ? [Element.Air, Element.Earth, Element.Fire, Element.Void, Element.Water] : this.cardData.elements ?? [];
        return elements.map((element, index) => ({
            key: `province-element-${index}`,
            prettyName: 'The Province\'s Element',
            element
        }));
    }

    flipFaceup() {
        this.facedown = false;
    }

    leavesPlay() {
        this.removeAllTokens();
        this.makeOrdinary();
        super.leavesPlay();
    }

    isConflictProvince(): boolean {
        return !!this.game.currentConflict?.getConflictProvinces().includes(this);
    }

    canBeAttacked() {
        const fateCostToAttack = this.getFateCostToAttack();
        const attackers = this.game.isDuringConflict() && this.game.currentConflict ? this.game.currentConflict.attackers : [];
        const fateToDeclareAttackers = attackers.reduce((total, card) => total + card.sumEffects(EffectName.FateCostToAttack), 0);

        return (
            !this.isBroken &&
            !this.anyEffect(EffectName.CannotBeAttacked) &&
            (!this.controller.opponent || this.controller.opponent.fate >= fateCostToAttack + fateToDeclareAttackers) &&
            (this.location !== Location.StrongholdProvince ||
                this.controller.getProvinces((card) => card.isBroken).length > 2 ||
                this.controller.anyEffect(EffectName.StrongholdCanBeAttacked))
        );
    }

    canDeclare(type: string, _ring: unknown): boolean {
        return this.canBeAttacked() && !this.getEffects(EffectName.CannotHaveConflictsDeclaredOfType).includes(type);
    }

    getFateCostToAttack() {
        return this.sumEffects(EffectName.FateCostToRingToDeclareConflictAgainst);
    }

    isBlank(): boolean {
        const ignoreTokens =
            !!this.game.currentConflict?.anyEffect(EffectName.ConflictIgnoreStatusTokens) && this.isConflictProvince();
        const dishonored = this.isDishonored && !ignoreTokens;
        return this.isBroken || dishonored || super.isBlank();
    }

    breakProvince(): void {
        this.isBroken = true;
        this.removeAllTokens();
        if(!this.controller.opponent) {
            return;
        }

        this.game.addMessage('{0} has broken {1}!', this.controller.opponent, this);

        if(
            this.location === Location.StrongholdProvince ||
            (this.game.gameMode === GameModes.Skirmish &&
                this.controller.getProvinces((card: ProvinceCard) => card.isBroken).length > 2)
        ) {
            this.game.recordWinner(this.controller.opponent, 'conquest');
            return;
        }

        if(!this.game.isDuringConflict()) {
            return;
        }

        const choosingPlayer = this.game.currentConflict?.attackingPlayer ?? this.controller.opponent;
        for(const dynastyCard of this.cardsInSelf()) {
            if(!dynastyCard) {
                continue;
            }
            const cardLabel = () => (dynastyCard.isFacedown() ? 'the facedown card' : dynastyCard);
            this.game.promptWithHandlerMenu(choosingPlayer, {
                activePromptTitle: `Do you wish to discard ${dynastyCard.isFacedown() ? 'the facedown card' : dynastyCard.name}?`,
                source: `Break ${this.name}`,
                choices: ['Yes', 'No'],
                handlers: [
                    () => {
                        this.game.addMessage('{0} chooses to discard {1}', choosingPlayer, cardLabel());
                        this.game.applyGameAction(this.game.getFrameworkContext(), { discardCard: dynastyCard });
                    },
                    () => this.game.addMessage('{0} chooses not to discard {1}', choosingPlayer, cardLabel())
                ]
            });
        }
    }

    restoreProvince(): void {
        this.isBroken = false;
        this.facedown = false;
    }

    cannotBeStrongholdProvince(): boolean {
        return this.hasEminent();
    }

    startsGameFaceup(): boolean {
        return this.hasEminent();
    }

    hideWhenFacedown(): boolean {
        return false;
    }

    getMenu() {
        const menu = super.getMenu();
        if(!menu) {
            return menu;
        }
        if(
            this.game.isDuringConflict() &&
            !this.isConflictProvince() &&
            this.canBeAttacked() &&
            this.game.currentConflict?.getConflictProvinces().some((a) => a.controller === this.controller)
        ) {
            menu.push({ command: 'move_conflict', text: 'Move Conflict' });
        }
        if(this.cardsInSelf().length === 0) {
            menu.push({ command: 'refill', text: 'Refill Province' });
        }
        return menu;
    }

    getSummary(activePlayer: StateViewer, hideWhenFaceup: boolean) {
        const baseSummary = super.getSummary(activePlayer, hideWhenFaceup);
        return {
            ...baseSummary,
            isProvince: this.isProvince,
            isBroken: this.isBroken,
            strengthSummary: this.strengthSummary,
            attachments: this.attachments.map((attachment) => attachment.getSummary(activePlayer, hideWhenFaceup))
        };
    }

    /** Provinces take any attachment: their 'no attachments' restrictions don't apply. */
    allowAttachment(_attachment: DrawCard): boolean {
        return true;
    }

    hasEminent(): boolean {
        //Facedown provinces are out of play and their effects don't evaluate, so we check for the printed keyword
        return this.hasKeyword('eminent') || (!this.isBlank() && this.hasPrintedKeyword('eminent'));
    }

    isFaceup(): boolean {
        return this.game.gameMode !== GameModes.Skirmish && super.isFaceup();
    }

    isFacedown(): boolean {
        return this.game.gameMode !== GameModes.Skirmish && super.isFacedown();
    }

    cardsInSelf(): DrawCard[] {
        return this.controller.getDynastyCardsInProvince(this.location);
    }
}

export function isProvinceCard(card: BaseCard): card is ProvinceCard {
    return card.isProvince;
}
