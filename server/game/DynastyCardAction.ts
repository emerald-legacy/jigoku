import { msg } from './GameChat.js';
import { BaseAction } from './BaseAction.js';
import { chooseFate } from './costs/variableAndOptionalCosts.js';
import { payReduceableFateCost } from './costs/fateAndHonorCosts.js';
import * as GameActions from './GameActions/GameActions.js';
import { EffectName, Phase, PlayType, EventName, Blocker } from './Constants.js';
import type { AbilityContext } from './AbilityContext.js';
import type BaseCard from './BaseCard.js';
import type DrawCard from './DrawCard.js';
import { isEffectOf } from './Effects/types.js';

export class DynastyCardAction extends BaseAction {
    title = 'Play this character';
    declare card: DrawCard;

    constructor(card: BaseCard) {
        super(card, [chooseFate(PlayType.PlayFromProvince), payReduceableFateCost()]);
    }

    meetsRequirements(context: AbilityContext = this.createContext(), ignoredBlockers: Blocker[] = []): Blocker {
        if(!ignoredBlockers.includes(Blocker.Facedown) && this.card.isFacedown()) {
            return Blocker.Facedown;
        } else if(!ignoredBlockers.includes(Blocker.WrongPlayer) && context.player !== this.card.controller) {
            return Blocker.WrongPlayer;
        } else if(!ignoredBlockers.includes(Blocker.WrongPhase) && context.game.currentPhase !== Phase.Dynasty) {
            return Blocker.WrongPhase;
        } else if(
            !ignoredBlockers.includes(Blocker.WrongLocation) &&
            !context.player.isCardInPlayableLocation(this.card, PlayType.PlayFromProvince)
        ) {
            return Blocker.WrongLocation;
        } else if(
            !ignoredBlockers.includes(Blocker.CannotTrigger) &&
            !this.card.canPlay(context, PlayType.PlayFromProvince)
        ) {
            return Blocker.CannotTrigger;
        } else if(this.card.anotherUniqueInPlay(context.player)) {
            return Blocker.DuplicateUnique;
        }
        return super.meetsRequirements(context, ignoredBlockers);
    }

    displayMessage(context: AbilityContext): void {
        context.game.addMessage(msg`${context.player} plays ${context.source} with ${context.chooseFate} additional fate`);
        if(context.source.checkRestrictions('placeFate', context)) {
            for(const effect of context.source.getRawEffects()) {
                if(isEffectOf(effect, EffectName.GainExtraFateWhenPlayed)) {
                    context.game.addMessage(msg`${context.source} enters play with ${effect.getValue(context.source)} additional fate due to ${effect.context.source}`);
                }
            }
        }
    }

    executeHandler(context: AbilityContext): void {
        let extraFate = context.source.sumEffects(EffectName.GainExtraFateWhenPlayed);
        const legendaryFate = context.source.sumEffects(EffectName.LegendaryFate);
        if(!context.source.checkRestrictions('placeFate', context)) {
            extraFate = 0;
        }
        extraFate = extraFate + legendaryFate;
        const status = context.source.getEffects(EffectName.EntersPlayWithStatus)[0];
        const enterPlayEvent = GameActions.putIntoPlay({ fate: context.chooseFate + extraFate, status }).getEvent(
            context.source,
            context
        );
        const card = this.card;
        context.game.openEventWindow([enterPlayEvent, context.game.getEvent(EventName.OnCardPlayed, {
            player: context.player,
            card,
            context: context,
            originalLocation: card.location,
            playType: PlayType.PlayFromProvince
        })]);
    }

    isCardPlayed(): boolean {
        return true;
    }
}

