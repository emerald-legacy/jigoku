import { msg } from '../../GameChat.js';
import { modifyBothSkills } from '../../effects.js';
import { cardLastingEffect, takeHonor } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';

class DeceptiveOffer extends DrawCard {
    static id = 'deceptive-offer';

    override setupCardAbilities() {
        this.action('Increase a character\'s military and political skill or take an honor from your opponent')
            .target({
                name: 'character',
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.isParticipating()
            })
            .select({
                name: 'select',
                dependsOn: 'character',
                player: Players.Opponent
            }, {
                'Allow your opponent\'s character to gain military and political skill': {
                    action: cardLastingEffect((context) => ({
                        target: context.targets.character,
                        effect: modifyBothSkills(2)
                    })),
                    chatText: (context) => msg`give +2/+2 to ${context.targets.character}`
                },
                'Give your opponent 1 honor': {
                    action: takeHonor(),
                    chatText: (context) => msg`${'take 1 honor from '}${context.player.opponent}`
                }
            });
    }
}


export default DeceptiveOffer;
