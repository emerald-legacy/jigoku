import { modifyBothSkills } from '../../effects.js';
import DrawCard from '../../DrawCard.js';
import { msg } from '../../GameChat.js';

class Misinformation extends DrawCard {
    static id = 'misinformation';

    setupCardAbilities() {
        this.action('Give opponent\'s participating cards -1/-1')
            .condition(context => this.game.isDuringConflict() &&
                                  !!context.player.opponent && context.player.showBid > context.player.opponent.showBid + 1)
            .cardLastingEffect((context) => ({
                target: this.game.currentConflict?.getCharacters(context.player.opponent) ?? [],
                effect: modifyBothSkills(-1)
            }))
            .chatText(() => msg`give all opposing characters -1${'military'}/-1${'political'}`);
    }
}


export default Misinformation;
