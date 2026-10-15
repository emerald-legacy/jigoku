import { msg } from '../../../GameChat.js';
import { CardType, Players } from '../../../Constants.js';
import { perConflict } from '../../../AbilityLimit.js';
import { modifyBothSkills } from '../../../effects.js';
import { cardLastingEffect, claimImperialFavor } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class AncestralRivalry extends DrawCard {
    static id = 'ancestral-rivalry';

    setupCardAbilities() {
        this.action('Give a character +3/+3 or claim favor')
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
                'Give the character +3/+3': {
                    action: cardLastingEffect((context) => ({
                        target: context.targets.character,
                        effect: modifyBothSkills(3)
                    })),
                    chatText: (context) => msg`give ${context.targets.character}${' +3'}${'military'}${'/+3'}${'political'}`
                },
                'Let opponent claim favor': {
                    action: claimImperialFavor((context) => ({
                        target: context.player
                    })),
                    chatText: () => msg`claim the Imperial Favor`
                }
            })
            .max(perConflict(1));
    }
}
