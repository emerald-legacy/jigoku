import DrawCard from '../../DrawCard.js';
import { Location, CardType } from '../../Constants.js';
import { cannotTriggerAbilities } from '../../effects.js';
import { cardLastingEffect, selectCard } from '../../GameActions/GameActions.js';

class ShinjoAmbusher extends DrawCard {
    static id = 'shinjo-ambusher';

    setupCardAbilities() {
        this.reaction('Disable a province')
            .when({
                onCardPlayed: (event, context) => event.card === context.source && context.source.isParticipating()
            })
            .gameAction(selectCard(context => ({
                activePromptTitle: 'Choose an attacked province',
                hidePromptIfSingleCard: true,
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: card => card.isConflictProvince(),
                message: '{0} prevents {1} from triggering its abilities',
                messageArgs: cards => [context.player, cards],
                gameAction: cardLastingEffect(() => ({
                    targetLocation: Location.Provinces,
                    effect: cannotTriggerAbilities()
                }))
            })))
            .effect('prevent an attacked province from triggering its abilities this conflict');
    }
}


export default ShinjoAmbusher;
