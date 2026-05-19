import DrawCard from '../../drawcard.js';
import { CardTypes, Players, TargetModes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class AlluringPatron extends DrawCard {
    static id = 'alluring-patron';

    setupCardAbilities() {
        this.action({
            title: 'Move or dishonor a character',
            condition: context => context.source.isParticipating(),
            targets: {
                character: {
                    cardType: CardTypes.Character,
                    controller: Players.Opponent,
                    cardCondition: card => !card.isParticipating()
                },
                select: {
                    mode: TargetModes.Select,
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
