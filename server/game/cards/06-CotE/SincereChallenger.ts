import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { immunity, modifyPoliticalSkill } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import { DuelType } from '../../Constants.js';

class SincereChallenger extends DrawCard {
    static id = 'sincere-challenger';

    setupCardAbilities() {
        this.composure({
            effect: modifyPoliticalSkill(2)
        });
        this.action('Initiate a Political duel')
            .initiateDuel(() => ({
                type: DuelType.Political,
                chatText: (_context, duel) => msg`${duel.winner?.[0]} is immune to events until the end of the conflict`,
                gameAction: (duel) => cardLastingEffect({
                    target: duel.winner,
                    effect: immunity({ restricts: 'events' })
                })
            }));
    }
}


export default SincereChallenger;
