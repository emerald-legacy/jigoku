import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, Players, TargetMode } from '../../Constants.js';

class AcolyteOfKoyane extends DrawCard {
    static id = 'acolyte-of-koyane';

    setupCardAbilities() {
        this.action({
            title: 'Gain or lose pride',
            condition: context => context.game.isDuringConflict('political'),
            targets: {
                character: {
                    controller: Players.Any,
                    cardType: CardType.Character,
                    cardCondition: card => card.isParticipating()
                },
                select: {
                    mode: TargetMode.Select,
                    dependsOn: 'character',
                    choices: {
                        'Gain Pride': AbilityDsl.actions.cardLastingEffect(context => ({
                            effect: AbilityDsl.effects.addKeyword('pride'),
                            target: context.targets.character
                        })),
                        'Lose Pride': AbilityDsl.actions.cardLastingEffect(context => ({
                            effect: AbilityDsl.effects.loseKeyword('pride'),
                            target: context.targets.character
                        }))
                    }
                }
            },
            effect: '{1} until the end of the conflict',
            effectArgs: context => [[context.selects.select.choice === 'Gain Pride' ? 'give {0} Pride' : 'make {0} lose Pride', context.targets.character]]
        });
    }
}


export default AcolyteOfKoyane;

