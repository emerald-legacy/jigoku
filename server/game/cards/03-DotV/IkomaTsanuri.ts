import { modifyBothSkills } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

class IkomaTsanuri extends DrawCard {
    static id = 'ikoma-tsanuri';

    setupCardAbilities() {
        this.action('Give your characters +1/+1')
            .condition((context) => context.source.isParticipating() &&
                                  context.player.cardsInPlay.filter((card) => card.isParticipating() && card.hasTrait('bushi')).length > 2)
            .gameAction(cardLastingEffect((context) => ({
                target: context.player.cardsInPlay.filter((card) => card.isParticipating()),
                effect: modifyBothSkills(1)
            })))
            .effect('grant their participating characters +1{1}/+1{2}', () => ['military', 'political']);
    }
}


export default IkomaTsanuri;
