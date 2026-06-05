import { CardType, Location, Players } from '../../../Constants.js';
import { StrongholdCard } from '../../../StrongholdCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import Soldier from '../../Soldier.js';
import type DrawCard from '../../../DrawCard.js';
import type { Event } from '../../../Events/Event.js';

export default class Pride extends StrongholdCard {
    static id = 'pride';

    setupCardAbilities() {
        const DummyAttachment = Soldier.createDummy(this.controller);

        this.action({
            title: 'Give a character a +1/+1 attachment',
            cost: AbilityDsl.costs.bowSelf(),
            condition: (context) => context.player.conflictDeck.length > 0,
            target: {
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card, context) =>
                    card.attachments.filter((a: DrawCard) => a.hasTrait('follower')).length === 0 &&
                    context.game.actions.attach({ attachment: DummyAttachment }).canAffect(card, context),
                gameAction: AbilityDsl.actions.handler({
                    handler: (context) => {
                        const card = context.player.conflictDeck[0];
                        const token = context.game.createToken(card, Soldier);
                        card.owner.removeCardFromPile(card);
                        card.moveTo(Location.RemovedFromGame);
                        const moveEvents: Event[] = [];
                        context.game.actions
                            .attach({ target: context.target, attachment: token })
                            .addEventsToArray(moveEvents, context);
                        context.game.openThenEventWindow(moveEvents);
                        return true;
                    }
                })
            },
            effect: 'attach the top card of their conflict deck to {0} as a +1/+1 attachment'
        });
    }
}
