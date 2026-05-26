import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../drawcard.js';
import type Player from '../../player.js';
import { Players, TargetModes, CardTypes } from '../../Constants.js';

class DeceptiveOffer extends DrawCard {
    static id = 'deceptive-offer';

    setupCardAbilities() {
        this.action({
            title: 'Increase a character\'s military and political skill or take an honor from your opponent',
            targets: {
                character: {
                    cardType: CardTypes.Character,
                    controller: Players.Self,
                    cardCondition: card => card.isParticipating()
                },
                select: {
                    mode: TargetModes.Select,
                    dependsOn: 'character',
                    player: Players.Opponent,
                    choices: {
                        'Allow your opponent\'s character to gain military and political skill': AbilityDsl.actions.cardLastingEffect(context => ({
                            target: context.targets.character,
                            effect: AbilityDsl.effects.modifyBothSkills(2)
                        })),
                        'Give your opponent 1 honor': AbilityDsl.actions.takeHonor()
                    }
                }
            },
            effect: '{1}{2}',
            effectArgs: context => {
                if(context.selects.select.choice === 'Give your opponent 1 honor') {
                    return ['take 1 honor from ', context.player.opponent as Player];
                }
                return ['give +2/+2 to ', context.targets.character as DrawCard];
            }
        });
    }
}


export default DeceptiveOffer;
