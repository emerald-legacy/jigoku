import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { Players, CardTypes, DuelTypes } from '../../Constants.js';

class InsolentRival extends DrawCard {
    static id = 'insolent-rival';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context: AbilityContext) => !!(context.player.opponent && context.player.showBid > context.player.opponent.showBid),
            effect: AbilityDsl.effects.modifyBothSkills(2)
        });

        this.action({
            title: 'Challenge a participating character to a Military duel: dishonor the loser of the duel',
            condition: () => this.isParticipating(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                cardCondition: (card: any) => card.isParticipating(),
                gameAction: AbilityDsl.actions.duel((context: AbilityContext) => ({
                    type: DuelTypes.Military,
                    challenger: context.source,
                    gameAction: (duel: any) => AbilityDsl.actions.dishonor({ target: duel.loser })
                }))
            }
        });
    }
}


export default InsolentRival;
