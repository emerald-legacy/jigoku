import { msg } from './GameChat.js';
import { CardType, type ConflictType, EffectName, Element, Location, RestrictionType } from './Constants.js';
import type { ElementSymbolInfo } from './ElementSymbol.js';
import { cardCannot } from './effects.js';
import BaseCard from './BaseCard.js';
import type Player from './Player.js';
import type DrawCard from './DrawCard.js';
import type Ring from './Ring.js';
import { StatModifier, type StatModifierSummary } from './StatModifier.js';
import type { CardData } from './types/CardData.js';
import { isEffectOf } from './Effects/types.js';
import type { EffectApplier } from './Effects/EffectApplier.js';
import { fateCostToDeclare } from './gamesteps/conflict/declarationCosts.js';
import type { NumericEffectName } from './Effects/EffectValueMap.js';
import type { StateViewer } from './types/StateViewer.js';
import { discardCard } from './GameActions/GameActions.js';

export class ProvinceCard extends BaseCard {
    override isProvince = true;
    isBroken = false;
    override menu = [
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
            type: CardType.Province,
            side: 'province',
            name: 'Skirmish Province',
            id: 'skirmish-province'
        }
    ) {
        super(owner, cardData);
        this.persistentEffect({
            condition: (context) => context.source.hasEminent(),
            location: Location.Any,
            effect: cardCannot(RestrictionType.TurnFacedown)
        });
    }

    override checkForIllegalAttachments(): boolean {
        return this.attachmentHost.checkForIllegalAttachments();
    }

    get strength() {
        return this.getStrength();
    }

    getStrength(): number {
        const setStrength = this.mostRecentEffect(EffectName.SetProvinceStrength);
        if(setStrength !== undefined) {
            return setStrength;
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

    /** A copy has the copied province's printed strength (Illusionary Terrain). */
    get printedStrength(): number {
        const copiedProvince = this.mostRecentEffect(EffectName.CopyProvince);
        return parseInt(String((copiedProvince || this).cardData.strength ?? '')) || 0;
    }

    getBaseStrength(): number {
        const setBaseStrength = this.mostRecentEffect(EffectName.SetBaseProvinceStrength);
        if(setBaseStrength !== undefined) {
            return setBaseStrength;
        }
        return this.sumEffects(EffectName.ModifyBaseProvinceStrength) + this.printedStrength;
    }

    getDynastyOrStrongholdCardModifier(): number {
        const canBeIncreased = !this.anyEffect(EffectName.ProvinceCannotHaveSkillIncreased);
        return this.controller.getSourceList(this.location).reduce((total, card) => {
            const bonus = card.getProvinceStrengthBonus();
            return total + (canBeIncreased ? bonus : Math.min(bonus, 0));
        }, 0);
    }

    getStrengthModifiers(): StatModifier[] {
        const effectsOf = <EffectType extends NumericEffectName>(type: EffectType) => this.getRawEffects().filter((effect) => isEffectOf(effect, type));
        const setModifier = (effect: EffectApplier<NumericEffectName>) =>
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
            modifiers.push(new StatModifier(this.printedStrength, 'Printed', false, undefined));
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

    get strengthSummary(): { stat?: string; modifiers?: StatModifierSummary[] } {
        if(this.facedown) {
            return {};
        }
        const modifiers = this.getStrengthModifiers().map((modifier) => modifier.toSummary());
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

    isElement(element: Element): boolean {
        return this.element.includes(element);
    }

    override hasElementSymbols(): boolean {
        return !!this.cardData.elements && this.cardData.elements.length > 0;
    }

    override getPrintedElementSymbols(): ElementSymbolInfo[] {
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

    override leavesPlay() {
        this.removeAllTokens();
        this.makeOrdinary();
        super.leavesPlay();
    }

    override isConflictProvince(): boolean {
        return !!this.game.currentConflict?.getConflictProvinces().includes(this);
    }

    /** The conflict province with this province's text: this one, or a copy of it. */
    conflictProvinceWithText(): ProvinceCard | undefined {
        return this.game.currentConflict?.getConflictProvinces().find((province) =>
            !province.hasBlankText() && (province.copiedCard ?? province) === this
        );
    }

    canBeAttacked() {
        const fateCostToAttack = this.getFateCostToAttack();
        const attackers = this.game.currentConflict?.attackers ?? [];

        return (
            !this.isBroken &&
            !this.anyEffect(EffectName.CannotBeAttacked) &&
            (!this.controller.opponent || this.controller.opponent.canSpendFate(fateCostToAttack + fateCostToDeclare(attackers), this.game.getFrameworkCostContext(this.controller.opponent))) &&
            (this.location !== Location.StrongholdProvince ||
                this.controller.getProvinces((card) => card.isBroken).length > 2 ||
                this.controller.anyEffect(EffectName.StrongholdCanBeAttacked))
        );
    }

    canDeclare(type: ConflictType | undefined, ring: Ring | undefined): boolean {
        const blockedTypes: readonly (ConflictType | undefined)[] = this.getEffects(EffectName.CannotHaveConflictsDeclaredOfType);
        return this.canBeAttacked() && !blockedTypes.includes(type) && this.canPayFateToRingToAttack(ring);
    }

    /** "Spend fate to an unclaimed ring" to attack it (Foothills Keep) needs an unclaimed ring other than the one contested. */
    private canPayFateToRingToAttack(contestedRing: Ring | undefined): boolean {
        return this.getFateCostToAttack() === 0 ||
            Object.values(this.game.rings).some((ring) => ring !== contestedRing && ring.isUnclaimed());
    }

    getFateCostToAttack() {
        return this.sumEffects(EffectName.FateCostToRingToDeclareConflictAgainst);
    }

    override isBlank(): boolean {
        return this.hasBlankText() || super.isBlank();
    }

    // blank apart from copying another province
    private hasBlankText(): boolean {
        const ignoreTokens =
            !!this.game.currentConflict?.anyEffect(EffectName.ConflictIgnoreStatusTokens) && this.isConflictProvince();
        const dishonored = this.isDishonored && !ignoreTokens;
        return this.isBroken || dishonored || this.anyEffect(EffectName.Blank);
    }

    breakProvince(breaker: Player | undefined): void {
        this.isBroken = true;
        this.removeAllTokens();
        if(!this.controller.opponent || !breaker) {
            return;
        }

        this.game.addMessage(msg`${breaker} has broken ${this}!`);

        if(this.game.rules.winConReachedConquestVictory(this)) {
            this.game.recordWinner(this.controller.opponent, 'conquest');
            return;
        }

        for(const dynastyCard of this.cardsInSelf()) {
            const cardLabel = () => (dynastyCard.isFacedown() ? 'the facedown card' : dynastyCard);
            this.game.promptWithHandlerMenu(breaker, {
                activePromptTitle: `Do you wish to discard ${dynastyCard.isFacedown() ? 'the facedown card' : dynastyCard.name}?`,
                source: `Break ${this.name}`,
                options: [
                    {
                        text: 'Yes',
                        handler: () => {
                            this.game.addMessage(msg`${breaker} chooses to discard ${cardLabel()}`);
                            this.game.resolveActions([discardCard({ target: dynastyCard })], this.game.getFrameworkContext(dynastyCard.controller));
                        }
                    },
                    { text: 'No', handler: () => this.game.addMessage(msg`${breaker} chooses not to discard ${cardLabel()}`) }
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

    override hideWhenFacedown(): boolean {
        return false;
    }

    override getMenu() {
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

    override getSummary(activePlayer: StateViewer, hideWhenFaceup: boolean) {
        const baseSummary = super.getSummary(activePlayer, hideWhenFaceup);
        return {
            ...baseSummary,
            isProvince: this.isProvince,
            isBroken: this.isBroken,
            strengthSummary: this.isHiddenFrom(activePlayer, hideWhenFaceup) ? {} : this.strengthSummary,
            attachments: this.attachments.map((attachment) => attachment.getSummary(activePlayer, hideWhenFaceup))
        };
    }

    /** Provinces take any attachment: their 'no attachments' restrictions don't apply. */
    override allowAttachment(_attachment: DrawCard): boolean {
        return true;
    }

    hasEminent(): boolean {
        //Facedown provinces are out of play and their effects don't evaluate, so we check for the printed keyword
        return this.hasKeyword('eminent') || (!this.isBlank() && this.hasPrintedKeyword('eminent'));
    }

    override isFaceup(): boolean {
        return this.game.rules.setupHaveProvinceCards && super.isFaceup();
    }

    override isFacedown(): boolean {
        return this.game.rules.setupHaveProvinceCards && super.isFacedown();
    }

    cardsInSelf(): DrawCard[] {
        return this.controller.getDynastyCardsInProvince(this.location);
    }
}
