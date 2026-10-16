import { msg } from './GameChat.js';
import { BaseAction } from './BaseAction.js';
import { chooseFate } from './costs/variableAndOptionalCosts.js';
import { payReduceableFateCost } from './costs/fateAndHonorCosts.js';
import { putIntoPlay } from './GameActions/GameActions.js';
import { EffectName, Phase, PlayType, Blocker, RestrictionType } from './Constants.js';
import type { AbilityContext } from './AbilityContext.js';
import type BaseCard from './BaseCard.js';
import type DrawCard from './DrawCard.js';
import { isEffectOf } from './Effects/types.js';
import { createCardPlayedEvent } from './Events/cardPlayedEvent.js';
import { getExtraFateWhenPlayed, getPlayBlocker } from './playActionHelpers.js';

export class DynastyCardAction extends BaseAction {
    override title = 'Play this character';
    declare card: DrawCard;

    constructor(card: BaseCard) {
        super(card, [chooseFate(PlayType.PlayFromProvince), payReduceableFateCost()]);
    }

    override meetsRequirements(context: AbilityContext = this.createContext(), ignoredBlockers: Blocker[] = []): Blocker {
        if(!ignoredBlockers.includes(Blocker.Facedown) && this.card.isFacedown()) {
            return Blocker.Facedown;
        } else if(!ignoredBlockers.includes(Blocker.WrongPlayer) && context.player !== this.card.controller) {
            return Blocker.WrongPlayer;
        } else if(!ignoredBlockers.includes(Blocker.WrongPhase) && context.game.currentPhase !== Phase.Dynasty) {
            return Blocker.WrongPhase;
        }
        return getPlayBlocker(this.card, context, ignoredBlockers, PlayType.PlayFromProvince) ?? super.meetsRequirements(context, ignoredBlockers);
    }

    override displayMessage(context: AbilityContext): void {
        context.game.addMessage(msg`${context.player} plays ${context.source} with ${context.chooseFate} additional fate`);
        if(context.source.checkRestrictions(RestrictionType.PlaceFate, context)) {
            for(const effect of context.source.getRawEffects()) {
                if(isEffectOf(effect, EffectName.GainExtraFateWhenPlayed)) {
                    context.game.addMessage(msg`${context.source} enters play with ${effect.getValue(context.source)} additional fate due to ${effect.context.source}`);
                }
            }
        }
    }

    override executeHandler(context: AbilityContext<DrawCard>): void {
        const extraFate = getExtraFateWhenPlayed(context.source, context);
        const status = context.source.getEffects(EffectName.EntersPlayWithStatus)[0];
        const enterPlayEvent = putIntoPlay({ fate: context.chooseFate + extraFate, status }).getEvent(
            context.source,
            context
        );
        context.game.openEventWindow([enterPlayEvent, createCardPlayedEvent(context, context.source, PlayType.PlayFromProvince)]);
    }

    override isCardPlayed(): boolean {
        return true;
    }
}

