import type { AbilityContext } from './AbilityContext.js';
import { PlayCardSourceAction } from './PlayCardSourceAction.js';
import { EffectName, Location, Phase, PlayType, Players } from './Constants.js';
import { chooseFate } from './costs/variableAndOptionalCosts.js';
import { payReduceableFateCost } from './costs/fateAndHonorCosts.js';
import { putIntoConflict, putIntoPlay } from './GameActions/GameActions.js';
import type DrawCard from './DrawCard.js';
import { createCardPlayedEvent } from './Events/cardPlayedEvent.js';

/** Where a played character enters play: the player chooses (Any), or only one of them. */
export enum PlayIntoLocation {
    Any,
    Conflict,
    Home
}

export class PlayCharacterAction extends PlayCardSourceAction {
    public title = 'Play this character';

    public constructor(card: DrawCard, private intoLocation = PlayIntoLocation.Any) {
        super(card, [chooseFate(PlayType.PlayFromHand), payReduceableFateCost()]);
    }

    public meetsRequirements(context: AbilityContext<DrawCard>, ignoredRequirements: string[] = []): string {
        if(
            !ignoredRequirements.includes('phase') &&
            context.game.currentPhase === Phase.Dynasty &&
            !context.game.rules.dynastyPhaseCanPlayConflictCharacters
        ) {
            return 'phase';
        }
        if(
            !ignoredRequirements.includes('location') &&
            !context.player.isCardInPlayableLocation(context.source, PlayType.PlayFromHand)
        ) {
            return 'location';
        }
        if(
            !ignoredRequirements.includes('cannotTrigger') &&
            !context.source.canPlay(context, PlayType.PlayFromHand)
        ) {
            return 'cannotTrigger';
        }
        if(context.source.anotherUniqueInPlay(context.player)) {
            return 'unique';
        }
        if(
            !context.player.checkRestrictions('playCharacter', context) ||
            !context.player.checkRestrictions('enterPlay', context)
        ) {
            return 'restriction';
        }
        return super.meetsRequirements(context, ignoredRequirements);
    }

    public executeHandler(context: AbilityContext<DrawCard>): void {
        const legendaryFate = context.source.sumEffects(EffectName.LegendaryFate);
        let extraFate = context.source.sumEffects(EffectName.GainExtraFateWhenPlayed);
        if(!context.source.checkRestrictions('placeFate', context)) {
            extraFate = 0;
        }
        extraFate = extraFate + legendaryFate;
        const cardPlayedEvent = createCardPlayedEvent(context, context.source, PlayType.PlayFromHand);
        const atHomeHandler = () => {
            context.game.addMessage(
                '{0} plays {1} at home with {2} additional fate',
                context.player,
                context.source,
                context.chooseFate
            );
            const effect = context.source.getEffects(EffectName.EntersPlayForOpponent);
            const player = effect.length > 0 ? Players.Opponent : Players.Self;
            context.game.openEventWindow([
                putIntoPlay({
                    fate: context.chooseFate + extraFate,
                    controller: player,
                    overrideLocation: Location.Hand
                }).getEvent(context.source, context),
                cardPlayedEvent
            ]);
        };
        const intoConflictHandler = () => {
            context.game.addMessage(
                '{0} plays {1} into the conflict with {2} additional fate',
                context.player,
                context.source,
                context.chooseFate
            );
            context.game.openEventWindow([
                putIntoConflict({ fate: context.chooseFate }).getEvent(context.source, context),
                cardPlayedEvent
            ]);
        };
        if(
            context.source.allowGameAction('putIntoConflict', context) &&
            this.intoLocation !== PlayIntoLocation.Home
        ) {
            if(this.intoLocation === PlayIntoLocation.Conflict) {
                return intoConflictHandler();
            }

            return context.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Where do you wish to play this character?',
                source: context.source,
                options: [{ text: 'Conflict', handler: intoConflictHandler }, { text: 'Home', handler: atHomeHandler }]
            });
        }

        return atHomeHandler();
    }

    public isCardPlayed(): boolean {
        return true;
    }
}
