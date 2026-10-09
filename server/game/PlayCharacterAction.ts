import { msg } from './GameChat.js';
import type { AbilityContext } from './AbilityContext.js';
import { PlayCardSourceAction } from './PlayCardSourceAction.js';
import { EffectName, Location, Phase, PlayType, Players, Blocker } from './Constants.js';
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

    public meetsRequirements(context: AbilityContext<DrawCard>, ignoredBlockers: Blocker[] = []): Blocker {
        if(
            !ignoredBlockers.includes(Blocker.WrongPhase) &&
            context.game.currentPhase === Phase.Dynasty &&
            !context.game.rules.dynastyPhaseCanPlayConflictCharacters
        ) {
            return Blocker.WrongPhase;
        }
        if(
            !ignoredBlockers.includes(Blocker.WrongLocation) &&
            !context.player.isCardInPlayableLocation(context.source, PlayType.PlayFromHand)
        ) {
            return Blocker.WrongLocation;
        }
        if(
            !ignoredBlockers.includes(Blocker.CannotTrigger) &&
            !context.source.canPlay(context, PlayType.PlayFromHand)
        ) {
            return Blocker.CannotTrigger;
        }
        if(context.source.anotherUniqueInPlay(context.player)) {
            return Blocker.DuplicateUnique;
        }
        if(
            !context.player.checkRestrictions('playCharacter', context) ||
            !context.player.checkRestrictions('enterPlay', context)
        ) {
            return Blocker.CannotPlaceFate;
        }
        return super.meetsRequirements(context, ignoredBlockers);
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
            context.game.addMessage(msg`${context.player} plays ${context.source} at home with ${context.chooseFate} additional fate`);
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
            context.game.addMessage(msg`${context.player} plays ${context.source} into the conflict with ${context.chooseFate} additional fate`);
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
