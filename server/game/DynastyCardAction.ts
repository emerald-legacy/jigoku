import BaseAction from './BaseAction.js';
import { chooseFate } from './costs/variableAndOptionalCosts.js';
import { payReduceableFateCost } from './costs/fateAndHonorCosts.js';
import * as GameActions from './GameActions/GameActions.js';
import { EffectName, Phases, PlayType, EventName } from './Constants.js';
import type { AbilityContext } from './AbilityContext.js';
import type BaseCard from './BaseCard.js';
import type DrawCard from './DrawCard.js';
import type { EffectValue } from './Effects/EffectValue.js';

class DynastyCardAction extends BaseAction {
    title = 'Play this character';
    declare card: DrawCard;

    constructor(card: BaseCard) {
        super(card, [chooseFate(PlayType.PlayFromProvince), payReduceableFateCost()]);
    }

    meetsRequirements(context: AbilityContext = this.createContext(), ignoredRequirements: string[] = []): string {
        if(!ignoredRequirements.includes('facedown') && this.card.isFacedown()) {
            return 'facedown';
        } else if(!ignoredRequirements.includes('player') && context.player !== this.card.controller) {
            return 'player';
        } else if(!ignoredRequirements.includes('phase') && context.game.currentPhase !== Phases.Dynasty) {
            return 'phase';
        } else if(
            !ignoredRequirements.includes('location') &&
            !context.player.isCardInPlayableLocation(this.card, PlayType.PlayFromProvince)
        ) {
            return 'location';
        } else if(
            !ignoredRequirements.includes('cannotTrigger') &&
            !this.card.canPlay(context, PlayType.PlayFromProvince)
        ) {
            return 'cannotTrigger';
        } else if(this.card.anotherUniqueInPlay(context.player)) {
            return 'unique';
        }
        return super.meetsRequirements(context);
    }

    displayMessage(context: AbilityContext): void {
        context.game.addMessage(
            '{0} plays {1} with {2} additional fate',
            context.player,
            context.source,
            (context as AbilityContext & { chooseFate: number }).chooseFate
        );
        if(context.source.checkRestrictions('placeFate', context)) {
            context.source
                .getRawEffects()
                .filter((effect) => effect.type === EffectName.GainExtraFateWhenPlayed)
                .map((effect) =>
                    context.game.addMessage(
                        '{0} enters play with {1} additional fate due to {2}',
                        context.source,
                        (effect.value as EffectValue<number>).value,
                        effect.context.source
                    )
                );
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
        const enterPlayEvent = GameActions.putIntoPlay({ fate: (context as AbilityContext & { chooseFate: number }).chooseFate + extraFate, status }).getEvent(
            context.source,
            context
        );
        const cardPlayedEvent = context.game.getEvent(EventName.OnCardPlayed, {
            player: context.player,
            card: context.source,
            context: context,
            originalLocation: context.source.location,
            playType: PlayType.PlayFromProvince
        });
        context.game.openEventWindow([enterPlayEvent, cardPlayedEvent]);
    }

    isCardPlayed(): boolean {
        return true;
    }
}

export default DynastyCardAction;
