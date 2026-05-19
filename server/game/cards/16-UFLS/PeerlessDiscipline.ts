import DrawCard from '../../drawcard.js';
import { Durations } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class PeerlessDiscipline extends DrawCard {
    static id = 'peerless-discipline';

    setupCardAbilities() {
        this.action({
            title: 'Give each character +1 military and Bushi',
            gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                target: context.player.cardsInPlay.filter(() => true),
                effect: [
                    AbilityDsl.effects.modifyMilitarySkill(1),
                    AbilityDsl.effects.addTrait('bushi')
                ],
                duration: Durations.UntilEndOfPhase
            })),
            effect: 'give all characters they control +1{1} and the Bushi trait',
            effectArgs: ['military']
        });
    }
}


export default PeerlessDiscipline;
