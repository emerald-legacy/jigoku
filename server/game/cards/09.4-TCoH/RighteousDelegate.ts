import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { modifyBothSkills } from '../../effects.js';
import { cardLastingEffect, multiple } from '../../GameActions/GameActions.js';

class RighteousDelegate extends DrawCard {
    static id = 'righteous-delegate';

    setupCardAbilities() {
        this.action('Weaken bushi, empower non-bushi')
            .condition((context) => context.source.isParticipating())
            .gameAction(multiple([
                cardLastingEffect((context) => {
                    const conflict = this.game.currentConflict;
                    if(!conflict) {
                        return { target: [], effect: modifyBothSkills(1) };
                    }
                    return {
                        target: conflict
                            .getCharacters(context.player)
                            .filter((card) => !card.hasTrait('bushi'))
                            .concat(
                                conflict
                                    .getCharacters(context.player.opponent)
                                    .filter((card) => !card.hasTrait('bushi'))
                            ),
                        effect: modifyBothSkills(1)
                    };
                }),
                cardLastingEffect((context) => {
                    const conflict = this.game.currentConflict;
                    if(!conflict) {
                        return { target: [], effect: modifyBothSkills(-1) };
                    }
                    return {
                        target: conflict
                            .getCharacters(context.player)
                            .filter((card) => card.hasTrait('bushi'))
                            .concat(
                                conflict
                                    .getCharacters(context.player.opponent)
                                    .filter((card) => card.hasTrait('bushi'))
                            ),
                        effect: modifyBothSkills(-1)
                    };
                })
            ]))
            .chatText(() => msg`give all participating bushi characters -1${'military'} / -1${'political'} and give all participating non-bushi characters +1${'military'} / +1${'political'}`);
    }
}


export default RighteousDelegate;
