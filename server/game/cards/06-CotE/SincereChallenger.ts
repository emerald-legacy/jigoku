import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { DuelTypes } from '../../Constants.js';

class SincereChallenger extends DrawCard {
    static id = 'sincere-challenger';

    setupCardAbilities() {
        this.composure({
            effect: AbilityDsl.effects.modifyPoliticalSkill(2)
        });
        this.action({
            title: 'Initiate a Political duel',
            initiateDuel: {
                type: DuelTypes.Political,
                message: '{0} is immune to events until the end of the conflict',
                messageArgs: duel => duel.winner,
                gameAction: duel => AbilityDsl.actions.cardLastingEffect({
                    target: duel.winner,
                    effect: AbilityDsl.effects.immunity({ restricts: 'events' })
                })
            }
        });
    }
}


export default SincereChallenger;
