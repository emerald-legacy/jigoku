import DrawCard from '../../DrawCard.js';
import { Duration } from '../../Constants.js';
import { addTrait, modifyMilitarySkill } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import { msg } from '../../GameChat.js';

class PeerlessDiscipline extends DrawCard {
    static id = 'peerless-discipline';

    setupCardAbilities() {
        this.action('Give each character +1 military and Bushi')
            .gameAction(cardLastingEffect(context => ({
                target: context.player.cardsInPlay.filter(() => true),
                effect: [
                    modifyMilitarySkill(1),
                    addTrait('bushi')
                ],
                duration: Duration.UntilEndOfPhase
            })))
            .effect(() => msg`give all characters they control +1${'military'} and the Bushi trait`);
    }
}


export default PeerlessDiscipline;
