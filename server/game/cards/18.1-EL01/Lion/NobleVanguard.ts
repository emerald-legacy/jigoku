import DrawCard from '../../../DrawCard.js';
import { CardType, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import Soldier from '../../Soldier.js';
import { attachTopConflictCardAsSoldier } from '../../attachTopConflictCardAsSoldier.js';

class NobleVanguard extends DrawCard {
    static id = 'noble-vanguard';

    setupCardAbilities() {
        const DummyAttachment = new Soldier(this);

        this.reaction('Attach a follower to a character')
            .when({
                onCharacterEntersPlay: (event, context) => {
                    return event.card === context.source && context.player.conflictDeck.length > 0;
                }
            })
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card, context) => context.game.actions.attach({ attachment: DummyAttachment }).canAffect(card, context)
            }, AbilityDsl.actions.handler({
                handler: (context) => attachTopConflictCardAsSoldier(context, context.target)
            }))
            .effect('attach the top card of their conflict deck to {0} as a +1/+1 attachment');
    }
}


export default NobleVanguard;
