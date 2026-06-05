import type { AbilityContext } from './AbilityContext.js';
import BaseAction from './BaseAction.js';
import { EffectName, EventName, Location, Phases, PlayType, Players } from './Constants.js';
import { chooseFate } from './costs/variableAndOptionalCosts.js';
import { payReduceableFateCost } from './costs/fateAndHonorCosts.js';
import { putIntoConflict, putIntoPlay } from './GameActions/GameActions.js';
import { parseGameMode } from './GameMode.js';
import type BaseCard from './BaseCard.js';
import type DrawCard from './DrawCard.js';

export enum PlayCharacterIntoLocation {
    Any,
    Conflict,
    Home
}

type ExecutionContext = AbilityContext & { chooseFate: number; onPlayCardSource: any };

export class PlayCharacterAction extends BaseAction {
    public title = 'Play this character';

    public constructor(card: BaseCard, private intoLocation = PlayCharacterIntoLocation.Any) {
        super(card, [chooseFate(PlayType.PlayFromHand), payReduceableFateCost()]);
    }

    public meetsRequirements(context = this.createContext(), ignoredRequirements: string[] = []): string {
        if(
            !ignoredRequirements.includes('phase') &&
            context.game.currentPhase === Phases.Dynasty &&
            !parseGameMode(context.game.gameMode).dynastyPhaseCanPlayConflictCharacters
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
            !(context.source as DrawCard).canPlay(context, PlayType.PlayFromHand)
        ) {
            return 'cannotTrigger';
        }
        if((context.source as DrawCard).anotherUniqueInPlay(context.player)) {
            return 'unique';
        }
        if(
            !context.player.checkRestrictions('playCharacter', context) ||
            !context.player.checkRestrictions('enterPlay', context)
        ) {
            return 'restriction';
        }
        return super.meetsRequirements(context);
    }

    public executeHandler(context: ExecutionContext): void {
        const legendaryFate = context.source.sumEffects(EffectName.LegendaryFate);
        let extraFate = context.source.sumEffects(EffectName.GainExtraFateWhenPlayed);
        if(!context.source.checkRestrictions('placeFate', context)) {
            extraFate = 0;
        }
        extraFate = extraFate + legendaryFate;
        const cardPlayedEvent = context.game.getEvent(EventName.OnCardPlayed, {
            player: context.player,
            card: context.source,
            context: context,
            originalLocation: context.source.location,
            originallyOnTopOfConflictDeck:
                context.player && context.player.conflictDeck && context.player.conflictDeck[0] === context.source,
            onPlayCardSource: context.onPlayCardSource,
            playType: PlayType.PlayFromHand
        });
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
            this.intoLocation !== PlayCharacterIntoLocation.Home
        ) {
            if(this.intoLocation === PlayCharacterIntoLocation.Conflict) {
                return intoConflictHandler();
            }

            return context.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Where do you wish to play this character?',
                source: context.source,
                choices: ['Conflict', 'Home'],
                handlers: [intoConflictHandler, atHomeHandler]
            });
        }

        return atHomeHandler();
    }

    public isCardPlayed(): boolean {
        return true;
    }
}
