import type { AbilityContext } from './AbilityContext.js';
import CardAbility from './CardAbility.js';
import { AbilityType, CardType, EffectName, Phases } from './Constants.js';
import type { ActionProps } from './Interfaces.js';
import type BaseCard from './BaseCard.js';
import type { ProvinceCard } from './ProvinceCard.js';

export class CardAction extends CardAbility {
    declare properties: ActionProps;
    abilityType = AbilityType.Action;

    anyPlayer: boolean;
    canTriggerOutsideConflict: boolean;
    conflictProvinceCondition: (province: ProvinceCard, context: AbilityContext) => boolean;
    phase: Phases | 'any';
    evenDuringDynasty: boolean;

    condition?: (context: AbilityContext) => boolean;

    constructor(card: BaseCard, properties: ActionProps) {
        super(card, properties);

        this.phase = properties.phase ?? 'any';
        this.evenDuringDynasty = properties.evenDuringDynasty ?? false;
        this.anyPlayer = properties.anyPlayer ?? false;
        this.condition = properties.condition;
        this.conflictProvinceCondition = properties.conflictProvinceCondition ?? ((province) => province === this.card);
        this.canTriggerOutsideConflict = !!properties.canTriggerOutsideConflict;
    }

    #passDynastyPhaseRequirements() {
        if(this.phase === Phases.Dynasty || this.evenDuringDynasty) {
            return true;
        }

        const rules = this.game.rules;
        switch(this.card.type) {
            case CardType.Holding:
                return rules.dynastyPhaseActionsFromCardsInPlay;

            case CardType.Event:
                return rules.dynastyPhaseCanPlayConflictEvents(this);

            case CardType.Character:
            case CardType.Attachment:
                return rules.dynastyPhaseActionsFromCardsInPlay;

            default:
                return false;
        }
    }

    meetsRequirements(context: AbilityContext = this.createContext(), ignoredRequirements: string[] = []) {
        if(!ignoredRequirements.includes('location') && !this.isInValidLocation(context)) {
            return 'location';
        }

        if(!ignoredRequirements.includes('province') && !this.checkProvinceCondition(context)) {
            return 'province';
        }

        if(!ignoredRequirements.includes('phase') && this.phase !== 'any' && this.phase !== this.game.currentPhase) {
            return 'phase';
        }

        if(
            !ignoredRequirements.includes('phase') &&
            this.game.currentPhase === Phases.Dynasty &&
            !this.#passDynastyPhaseRequirements()
        ) {
            return 'phase';
        }

        const canOpponentTrigger = this.card.anyEffect(EffectName.CanBeTriggeredByOpponent);
        const canPlayerTrigger = this.anyPlayer || context.player === this.card.controller || canOpponentTrigger;
        if(!ignoredRequirements.includes('player') && this.card.type !== CardType.Event && !canPlayerTrigger) {
            return 'player';
        }

        if(!ignoredRequirements.includes('condition') && this.condition && !this.condition(context)) {
            return 'condition';
        }

        return super.meetsRequirements(context, ignoredRequirements);
    }

    checkProvinceCondition(context: AbilityContext) {
        return (
            this.card.type !== CardType.Province ||
            this.canTriggerOutsideConflict ||
            (this.game.currentConflict &&
                this.game.currentConflict
                    .getConflictProvinces()
                    .some((p) => this.conflictProvinceCondition(p, context)))
        );
    }

    isAction() {
        return true;
    }

    isCardAction(): this is CardAction {
        return true;
    }
}
