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
                'Give the character +3/+3': cardLastingEffect((context) => ({
                    target: context.targets.character,
                    effect: modifyBothSkills(3)
                })),
                'Let opponent claim favor': claimImperialFavor((context) => ({
                    target: context.player
                }))
            })
            .chatText('{1}{2}{3}{4}{5}{6}', (context) => context.selects.select.choice === 'Let opponent claim favor' ? [
                'claim the Imperial Favor',
                '',
                '',
                '',
                '',
                ''
            ] : [
                'give ',
                context.targets.character,
                ' +3',
                'military',
                '/+3',
                'political'
            ])
            .max(perConflict(1));
    }
}
