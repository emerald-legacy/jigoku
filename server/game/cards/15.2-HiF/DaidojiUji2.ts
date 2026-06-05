import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { EventName, Location, Players, PlayType, TargetMode, Decks } from '../../Constants.js';
import type { GameEvent, EventPayload } from '../../Events/EventPayloads.js';
import type Player from '../../Player.js';

class DaidojiUji2 extends DrawCard {
    static id = 'daidoji-uji-2';

    setupCardAbilities() {
        this.reaction({
            title: 'Search your conflict deck',
            when: { onCharacterEntersPlay: (event, context) => event.card === context.source },
            gameAction: AbilityDsl.actions.deckSearch({
                targetMode: TargetMode.UpTo,
                numCards: 4,
                deck: Decks.ConflictDeck,
                reveal: false,
                selectedCardsHandler: (context, event, cards) => {
                    const searchEvent = event as GameEvent<EventName.OnDeckSearch> & { player: Player };
                    if(cards.length > 0) {
                        this.game.addMessage('{0} selects {1} cards', searchEvent.player, cards.length);
                        cards.forEach(card => {
                            context.player.moveCard(card, this.uuid);
                            card.controller = context.source.controller;
                            card.facedown = false;
                            card.lastingEffect(() => ({
                                until: {
                                    onCardMoved: (event: EventPayload<EventName.OnCardMoved>) => event.card === card && event.originalLocation === this.uuid
                                },
                                match: card,
                                effect: [
                                    AbilityDsl.effects.hideWhenFaceUp()
                                ]
                            }));
                        });
                    } else {
                        this.game.addMessage('{0} selects no cards', searchEvent.player);
                    }
                }
            })
        });

        this.persistentEffect({
            condition: context => context.source.isHonored,
            location: Location.PlayArea,
            targetLocation: this.uuid,
            targetController: Players.Self,
            match: card => {
                return card.location === this.uuid;
            },
            effect: [
                AbilityDsl.effects.canPlayFromOutOfPlay((player: Player) => {
                    return player === this.controller;
                }, PlayType.PlayFromHand),
                AbilityDsl.effects.registerToPlayFromOutOfPlay()
            ]
        });
    }
}


export default DaidojiUji2;
