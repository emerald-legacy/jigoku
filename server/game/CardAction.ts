import type { AbilityContext } from './AbilityContext.js';
import { CardAbility } from './CardAbility.js';
import { AbilityType, CardType, EffectName, Phase, Blocker } from './Constants.js';
import type { ActionProps } from './Interfaces.js';
import type BaseCard from './BaseCard.js';
import type { ProvinceCard } from './ProvinceCard.js';

export class CardAction extends CardAbility {
    declare properties: ActionProps;
    abilityType = AbilityType.Action;

    anyPlayer: boolean;
    canTriggerOutsideConflict: boolean;
    conflictProvinceCondition: (province: ProvinceCard, context: AbilityContext) => boolean;
    phase: Phase | 'any';
    evenDuringDynasty: boolean;

    constructor(card: BaseCard, properties: ActionProps) {
        super(card, properties);

        this.phase = properties.phase ?? 'any';
        this.evenDuringDynasty = properties.evenDuringDynasty ?? false;
        this.anyPlayer = properties.anyPlayer ?? false;
        this.conflictProvinceCondition = properties.conflictProvinceCondition ?? ((province) => province === this.card);
        this.canTriggerOutsideConflict = !!properties.canTriggerOutsideConflict;
    }

    #passDynastyPhaseRequirements() {
        if(this.phase === Phase.Dynasty || this.evenDuringDynasty) {
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

    meetsRequirements(context: AbilityContext = this.createContext(), ignoredBlockers: Blocker[] = []) {
        if(!ignoredBlockers.includes(Blocker.WrongLocation) && !this.isInValidLocation(context)) {
            return Blocker.WrongLocation;
        }

        if(!ignoredBlockers.includes(Blocker.WrongProvince) && !this.checkProvinceCondition(context)) {
            return Blocker.WrongProvince;
        }

        if(!ignoredBlockers.includes(Blocker.WrongPhase) && this.phase !== 'any' && this.phase !== this.game.currentPhase) {
            return Blocker.WrongPhase;
        }

        if(
            !ignoredBlockers.includes(Blocker.WrongPhase) &&
            this.game.currentPhase === Phase.Dynasty &&
            !this.#passDynastyPhaseRequirements()
        ) {
            return Blocker.WrongPhase;
        }

        const canOpponentTrigger = this.card.anyEffect(EffectName.CanBeTriggeredByOpponent);
        const canPlayerTrigger = this.anyPlayer || context.player === this.card.controller || canOpponentTrigger;
        if(!ignoredBlockers.includes(Blocker.WrongPlayer) && this.card.type !== CardType.Event && !canPlayerTrigger) {
            return Blocker.WrongPlayer;
        }

        if(!ignoredBlockers.includes(Blocker.ConditionNotMet) && this.condition && !this.condition(context)) {
            return Blocker.ConditionNotMet;
        }

        return super.meetsRequirements(context, ignoredBlockers);
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
