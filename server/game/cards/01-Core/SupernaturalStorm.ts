import { modifyBothSkills } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import { controlsShugenja } from '../controlsShugenja.js';

class SupernaturalStorm extends DrawCard {
    static id = 'supernatural-storm';

    setupCardAbilities() {
        this.action('Increase the skill of one character')
            .condition(() => controlsShugenja(this.controller))
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }, cardLastingEffect((context) => ({
                effect: modifyBothSkills(context.player.cardsInPlay.reduce((total: number, card) => total + (card.hasTrait('shugenja') ? 1 : 0), 0))
            })))
            .chatText('imbue {0} with the supernatural power of the storm');
    }
}


export default SupernaturalStorm;
