import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';

class DeceptiveOffer extends DrawCard {
    static id = 'deceptive-offer';

    setupCardAbilities() {
        this.action('Increase a character\'s military and political skill or take an honor from your opponent')
            .target('character', {
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: card => card.isParticipating()
            })
            .select('select', {
                dependsOn: 'character',
                player: Players.Opponent
            }, {
                'Allow your opponent\'s character to gain military and political skill': AbilityDsl.actions.cardLastingEffect(context => ({
                    target: context.targets.character,
                    effect: AbilityDsl.effects.modifyBothSkills(2)
                })),
                'Give your opponent 1 honor': AbilityDsl.actions.takeHonor()
            })
            .effect('{1}{2}', context => {
                if(context.selects.select.choice === 'Give your opponent 1 honor') {
                    return ['take 1 honor from ', context.player.opponent];
                }
                return ['give +2/+2 to ', context.targets.character];
            });
    }
}


export default DeceptiveOffer;
