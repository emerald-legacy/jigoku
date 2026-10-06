import AbilityDsl from '../../../abilitydsl.js';
import { DuelType, ConflictType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class ShochuBrawl extends DrawCard {
    static id = 'shochu-brawl';

    setupCardAbilities() {
        this.conflictAction('Initiate a Military Duel, bowing the loser and dishonoring the winner', { conflictType: ConflictType.Political })
            .initiateDuel(() => ({
                type: DuelType.Military,
                gameAction: (duel) =>
                    AbilityDsl.actions.multiple([
                        AbilityDsl.actions.bow({ target: duel.loser }),
                        AbilityDsl.actions.dishonor({ target: duel.winner })
                    ])
            }));
    }
}
