import { modifyBothSkills } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

class Misinformation extends DrawCard {
    static id = 'misinformation';

    setupCardAbilities() {
        this.action('Give opponent\'s participating cards -1/-1')
            .condition(context => this.game.isDuringConflict() &&
                                  !!context.player.opponent && context.player.showBid > context.player.opponent.showBid + 1)
            .gameAction(cardLastingEffect((context) => ({
                target: this.game.currentConflict?.getCharacters(context.player.opponent) ?? [],
                effect: modifyBothSkills(-1)
            })))
            .effect('give all opposing characters -1{1}/-1{2}', () => ['military', 'political']);
    }
}


export default Misinformation;
