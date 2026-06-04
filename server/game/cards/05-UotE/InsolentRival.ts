import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { Players, CardType, DuelType } from '../../Constants.js';

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
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card: any) => card.isParticipating(),
                gameAction: AbilityDsl.actions.duel((context: AbilityContext) => ({
                    type: DuelType.Military,
                    challenger: context.source as DrawCard,
                    gameAction: (duel: any) => AbilityDsl.actions.dishonor({ target: duel.loser })
                }))
            }
        });
    }
}


export default InsolentRival;
