import DrawCard from '../../../DrawCard.js';
import { CardType, Players, Location } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import Soldier from '../../Soldier.js';
import type { Event } from '../../../Events/Event.js';

class NobleVanguard extends DrawCard {
    static id = 'noble-vanguard';

    setupCardAbilities() {
        const DummyAttachment = new Soldier(this);

        this.reaction({
            title: 'Attach a follower to a character',
            when: {
                onCharacterEntersPlay: (event, context) => {
                    return event.card === context.source && context.player.conflictDeck.length > 0;
                }
            },
            target: {
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card, context) => context.game.actions.attach({ attachment: DummyAttachment }).canAffect(card, context),
                gameAction: AbilityDsl.actions.handler({
                    handler: context => {
                        const card = context.player.conflictDeck[0];
                        let token = context.game.createToken(card, Soldier);
                        card.owner.removeCardFromPile(card);
                        card.moveTo(Location.RemovedFromGame);
                        const moveEvents: Event[] = [];
                        context.game.actions.attach({ target: context.target, attachment: token }).addEventsToArray(moveEvents, context);
                        context.game.openThenEventWindow(moveEvents);
                        return true;
                    }
                })
            },
            effect: 'attach the top card of their conflict deck to {0} as a +1/+1 attachment'
        });
    }
}


export default NobleVanguard;
