import BaseAction from './BaseAction';
import * as Costs from './Costs';
import * as GameActions from './GameActions/GameActions';
import { EffectNames, Phases, PlayTypes, EventNames } from './Constants';
import type { AbilityContext } from './AbilityContext';
import type BaseCard from './basecard';

class DynastyCardAction extends BaseAction {
    title = 'Play this character';

    constructor(card: BaseCard) {
        super(card, [Costs.chooseFate(PlayTypes.PlayFromProvince), Costs.payReduceableFateCost()]);
    }

    meetsRequirements(context: AbilityContext = this.createContext(), ignoredRequirements: string[] = []): string | undefined {
        if(!ignoredRequirements.includes('facedown') && this.card.isFacedown()) {
            return 'facedown';
        } else if(!ignoredRequirements.includes('player') && context.player !== this.card.controller) {
            return 'player';
        } else if(!ignoredRequirements.includes('phase') && context.game.currentPhase !== Phases.Dynasty) {
            return 'phase';
        } else if(
            !ignoredRequirements.includes('location') &&
            !context.player.isCardInPlayableLocation(this.card, PlayTypes.PlayFromProvince)
        ) {
            return 'location';
        } else if(
            !ignoredRequirements.includes('cannotTrigger') &&
            !this.card.canPlay(context, PlayTypes.PlayFromProvince)
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
            (context as any).chooseFate
        );
        if(context.source.checkRestrictions('placeFate', context)) {
            context.source
                .getRawEffects()
                .filter((effect: any) => effect.type === EffectNames.GainExtraFateWhenPlayed)
                .map((effect: any) =>
                    context.game.addMessage(
                        '{0} enters play with {1} additional fate due to {2}',
                        context.source,
                        effect.value.value,
                        effect.context.source
                    )
                );
        }
    }

    executeHandler(context: AbilityContext): void {
        let extraFate = context.source.sumEffects(EffectNames.GainExtraFateWhenPlayed);
        const legendaryFate = context.source.sumEffects(EffectNames.LegendaryFate);
        if(!context.source.checkRestrictions('placeFate', context)) {
            extraFate = 0;
        }
        extraFate = extraFate + legendaryFate;
        const status = context.source.getEffects(EffectNames.EntersPlayWithStatus)[0] || '';
        const enterPlayEvent = GameActions.putIntoPlay({ fate: (context as any).chooseFate + extraFate, status }).getEvent(
            context.source,
            context
        );
        const cardPlayedEvent = context.game.getEvent(EventNames.OnCardPlayed, {
            player: context.player,
            card: context.source,
            context: context,
            originalLocation: context.source.location,
            playType: PlayTypes.PlayFromProvince
        });
        context.game.openEventWindow([enterPlayEvent, cardPlayedEvent]);
    }

    isCardPlayed(): boolean {
        return true;
    }
}

export = DynastyCardAction;
