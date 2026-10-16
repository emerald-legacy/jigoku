import { msg } from '../../GameChat.js';
import { addTrait } from '../../effects.js';
import type BaseCard from '../../BaseCard.js';
import { CardType, type EventName, Location, PlayType, Trait } from '../../Constants.js';
import type { EventPayload } from '../../Events/EventPayloads.js';
import { playCard } from '../../GameActions/GameActions.js';
import type { PlayCardProperties } from '../../GameActions/PlayCardAction.js';
import DrawCard from '../../DrawCard.js';
import { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';

export default class DragonTattoo extends DrawCard {
    static id = 'dragon-tattoo';

    public override setupCardAbilities() {
        this.attachmentConditions({ myControl: true });

        this.whileAttached({ effect: addTrait(Trait.Tattooed) });

        this.reaction('Play card again')
            .when({
                onCardPlayed: (event, context) =>
                    event.card.type === CardType.Event &&
                    event.card.controller === context.player &&
                    (event.card.location === Location.ConflictDiscardPile ||
                        event.card.location === Location.DynastyDiscardPile) &&
                    // chosenCardTargets covers the whole triggering, sub-resolutions included
                    (event.context?.triggeringContext.chosenCardTargets ?? []).some((card) =>
                        this.isValidTargetForTattoo(card, context))
            })
            .ifAble()
            .playCard((context) => this.getPlayAgainProperties(context.event))
            .otherwise()
            .moveCard((context) => ({
                target: context.event.card,
                destination: Location.RemovedFromGame
            }))
            .chatText((context) => playCard(this.getPlayAgainProperties(context.event)).hasLegalTarget(context)
                ? msg`play ${context.event.card.name}`
                : msg`remove ${context.event.card.name} from the game`);
    }

    private getPlayAgainProperties(event: EventPayload<EventName.OnCardPlayed>): PlayCardProperties {
        const played = event.context;
        return {
            source: this,
            target: event.card,
            resetOnCancel: true,
            playType: PlayType.Other,
            destination: Location.RemovedFromGame,
            payCosts: true,
            allowReactions: true,
            event: played instanceof TriggeredAbilityContext ? played.event : undefined
        };
    }

    private isValidTargetForTattoo(card: BaseCard, context: TriggeredAbilityContext) {
        return (
            card.type === CardType.Character &&
            card.controller === context.player &&
            card === context.source.parentCharacter &&
            card.location === Location.PlayArea
        );
    }
}
