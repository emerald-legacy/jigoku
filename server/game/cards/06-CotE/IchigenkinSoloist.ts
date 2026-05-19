import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class IchigenkinSoloist extends DrawCard {
    static id = 'ichigenkin-soloist';

    setupCardAbilities() {
        this.composure({
            effect: AbilityDsl.effects.cardCannot({
                cannot: 'target',
                restricts: 'opponentsTriggeredAbilities'
            })
        });
    }
}


export default IchigenkinSoloist;
