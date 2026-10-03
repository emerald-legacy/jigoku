import { CardType, Players } from '../../../Constants.js';
import { StrongholdCard } from '../../../StrongholdCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import Soldier from '../../Soldier.js';
import { attachTopConflictCardAsSoldier } from '../../attachTopConflictCardAsSoldier.js';

export default class Pride extends StrongholdCard {
    static id = 'pride';

    setupCardAbilities() {
        const DummyAttachment = Soldier.createDummy(this.controller);

        this.action('Give a character a +1/+1 attachment')
            .cost(AbilityDsl.costs.bowSelf())
            .condition((context) => context.player.conflictDeck.length > 0)
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card, context) =>
                    card.attachments.filter((a) => a.hasTrait('follower')).length === 0 &&
                    context.game.actions.attach({ attachment: DummyAttachment }).canAffect(card, context)
            }, AbilityDsl.actions.handler({
                handler: (context) => attachTopConflictCardAsSoldier(context, context.target)
            }))
            .effect('attach the top card of their conflict deck to {0} as a +1/+1 attachment');
    }
}
