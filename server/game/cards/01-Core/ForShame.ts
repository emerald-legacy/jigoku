import DrawCard from '../../drawcard';
import { Players, TargetModes, CardTypes } from '../../Constants';

class ForShame extends DrawCard {
    static id = 'for-shame';

    setupCardAbilities(ability) {
        this.action({
            title: 'Dishonor or bow a character',
            condition: context => context.player.anyCardsInPlay(card => card.isParticipating() && card.hasTrait('courtier')),
            targets: {
                character: {
                    cardType: CardTypes.Character,
                    controller: Players.Opponent,
                    cardCondition: card => card.isParticipating()
                },
                select: {
                    mode: TargetModes.Select,
                    dependsOn: 'character',
                    player: Players.Opponent,
                    choices: {
                        'Dishonor this character': ability.actions.dishonor(context => ({ target: context.targets.character })),
                        'Bow this character': ability.actions.bow(context => ({ target: context.targets.character }))
                    }
                }
            }
        });
    }
}


export default ForShame;
