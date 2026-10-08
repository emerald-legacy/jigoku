import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { Location, CardType } from '../../Constants.js';
import { cannotTriggerAbilities } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

class ShinjoAmbusher extends DrawCard {
    static id = 'shinjo-ambusher';

    setupCardAbilities() {
        this.reaction('Disable a province')
            .when({
                onCardPlayed: (event, context) => event.card === context.source && context.source.isParticipating()
            })
            .selectCard({
                activePromptTitle: 'Choose an attacked province',
                hidePromptIfSingleCard: true,
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: (card) => card.isConflictProvince(),
                message: (context, cards) => msg`${context.player} prevents ${cards} from triggering its abilities`,
                gameAction: cardLastingEffect(() => ({
                    targetLocation: Location.Provinces,
                    effect: cannotTriggerAbilities()
                }))
            })
            .chatText('prevent an attacked province from triggering its abilities this conflict');
    }
}


export default ShinjoAmbusher;
