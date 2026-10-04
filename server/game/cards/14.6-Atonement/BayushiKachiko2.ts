import AbilityDsl from '../../abilitydsl.js';
import { CardType, EventName, Location, Players, PlayType, ConflictType } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import type { EventPayload } from '../../Events/EventPayloads.js';
import { EventRegistrar } from '../../EventRegistrar.js';

const MAXIMUM_CARDS_ALLOWED = 3;

export default class BayushiKachiko2 extends DrawCard {
    static id = 'bayushi-kachiko-2';

    private cardsPlayedThisRound = 0;
    private mostRecentEvent?: EventPayload<EventName.OnCardPlayed>;

    public setupCardAbilities() {
        new EventRegistrar(this.game, this).register([EventName.OnRoundEnded, EventName.OnCharacterEntersPlay]);

        this.persistentEffect({
            effect: AbilityDsl.effects.delayedEffect<this>({
                when: {
                    onCardPlayed: (event, context) => {
                        if(this.cardsPlayedThisRound >= MAXIMUM_CARDS_ALLOWED) {
                            return false;
                        }
                        this.mostRecentEvent = event;
                        return (
                            event.originalLocation === Location.ConflictDiscardPile &&
                            event.card.owner === context.player.opponent &&
                            event.card.type === CardType.Event &&
                            !event.onPlayCardSource &&
                            !event.card.fromOutOfPlaySource &&
                            event.player === context.player &&
                            !event.sourceOfCardPlayedFromConflictDiscard &&
                            context.game.isDuringConflict(ConflictType.Political) &&
                            context.source.isParticipating()
                        );
                    }
                },
                gameAction: AbilityDsl.actions.handler({
                    handler: (context) => {
                        const mostRecentEvent = this.mostRecentEvent;
                        if(!mostRecentEvent) {
                            return;
                        }
                        if(
                            mostRecentEvent.sourceOfCardPlayedFromConflictDiscard &&
                            mostRecentEvent.sourceOfCardPlayedFromConflictDiscard !== this
                        ) {
                            return;
                        }

                        mostRecentEvent.sourceOfCardPlayedFromConflictDiscard = this;
                        this.cardsPlayedThisRound++;
                        this.game.addMessage(
                            '{0} plays a card from their opponent\'s conflict discard pile due to the ability of {1} ({2} use{3} remaining)',
                            context.player,
                            context.source,
                            MAXIMUM_CARDS_ALLOWED - this.cardsPlayedThisRound,
                            MAXIMUM_CARDS_ALLOWED - this.cardsPlayedThisRound === 1 ? '' : 's'
                        );
                        this.game.addMessage(
                            '{0} is removed from the game due to the ability of {1}',
                            mostRecentEvent.card,
                            context.source
                        );
                        mostRecentEvent.card.owner.moveCard(mostRecentEvent.card, Location.RemovedFromGame);
                    }
                })
            })
        });

        this.persistentEffect({
            condition: (context) =>
                context.game.isDuringConflict(ConflictType.Political) &&
                context.source.isParticipating() &&
                this.cardsPlayedThisRound < MAXIMUM_CARDS_ALLOWED,
            location: Location.PlayArea,
            targetLocation: Location.ConflictDiscardPile,
            targetController: Players.Opponent,
            match: (card, context) =>
                card.type === CardType.Event &&
                card.location === Location.ConflictDiscardPile &&
                card.owner === context?.player.opponent,
            effect: [
                AbilityDsl.effects.canPlayFromOutOfPlay(
                    (player, card) => player !== card.owner,
                    PlayType.PlayFromHand
                ),
                AbilityDsl.effects.registerToPlayFromOutOfPlay()
            ]
        });
    }

    public onRoundEnded() {
        this.cardsPlayedThisRound = 0;
    }

    public onCharacterEntersPlay(event: EventPayload<EventName.OnCharacterEntersPlay>) {
        if(event.card === this) {
            this.cardsPlayedThisRound = 0;
        }
    }
}
