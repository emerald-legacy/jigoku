import type AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import { Players, TargetMode, CardType } from '../../Constants.js';

class ForShame extends DrawCard {
    static id = 'for-shame';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Dishonor or bow a character',
            condition: context => context.player.anyCardsInPlay(card => card.isParticipating() && card.hasTrait('courtier')),
            targets: {
                character: {
                    cardType: CardType.Character,
                    controller: Players.Opponent,
                    cardCondition: card => card.isParticipating()
                },
                select: {
                    mode: TargetMode.Select,
                    dependsOn: 'character',
                    player: Players.Opponent,
                    choices: {
                        'Dishonor this character': ability.actions.dishonor((context: AbilityContext) => ({ target: context.targets.character })),
                        'Bow this character': ability.actions.bow((context: AbilityContext) => ({ target: context.targets.character }))
                    }
                }
            }
        });
    }
}


export default ForShame;
