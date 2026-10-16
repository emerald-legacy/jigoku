import DrawCard from '../../DrawCard.js';
import { Duration, Trait } from '../../Constants.js';
import { addTrait, modifyMilitarySkill } from '../../effects.js';
import { msg } from '../../GameChat.js';

class PeerlessDiscipline extends DrawCard {
    static id = 'peerless-discipline';

    override setupCardAbilities() {
        this.action('Give each character +1 military and Bushi')
            .cardLastingEffect((context) => ({
                target: context.player.cardsInPlay.filter(() => true),
                effect: [
                    modifyMilitarySkill(1),
                    addTrait(Trait.Bushi)
                ],
                duration: Duration.UntilEndOfPhase
            }))
            .chatText(() => msg`give all characters they control +1${'military'} and the Bushi trait`);
    }
}


export default PeerlessDiscipline;
