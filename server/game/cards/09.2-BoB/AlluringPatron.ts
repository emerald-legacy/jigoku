import DrawCard from '../../DrawCard.js';
import { CardType, Players, TargetMode } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class AlluringPatron extends DrawCard {
    static id = 'alluring-patron';

    setupCardAbilities() {
        this.action({
            title: 'Move or dishonor a character',
            condition: context => context.source.isParticipating(),
            targets: {
                character: {
                    cardType: CardType.Character,
                    controller: Players.Opponent,
                    cardCondition: card => !card.isParticipating()
                },
                select: {
                    mode: TargetMode.Select,
                    dependsOn: 'character',
                    player: Players.Opponent,
                    choices: {
                        'Move this character to the conflict': AbilityDsl.actions.moveToConflict(context => ({
                            target: context.targets.character
                        })),
                        'Dishonor this character': AbilityDsl.actions.dishonor(context => ({
                            target: context.targets.character
                        }))
                    }
                }
            }
        });
    }
}


export default AlluringPatron;
