import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { cannotTriggerAbilities } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

class ShinjoAmbusher extends DrawCard {
    static id = 'shinjo-ambusher';

    override setupCardAbilities() {
        this.reaction('Disable a province')
            .when({
                onCardPlayed: (event, context) => event.card === context.source && context.source.isParticipating()
            })
            .selectAttackedProvince({
                message: (context, cards) => msg`${context.player} prevents ${cards} from triggering its abilities`,
                gameAction: cardLastingEffect(() => ({
                    effect: cannotTriggerAbilities()
                }))
            })
            .chatText('prevent an attacked province from triggering its abilities this conflict');
    }
}


export default ShinjoAmbusher;
