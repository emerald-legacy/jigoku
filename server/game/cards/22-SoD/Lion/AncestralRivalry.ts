import { CardType, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class AncestralRivalry extends DrawCard {
    static id = 'ancestral-rivalry';

    setupCardAbilities() {
        this.action('Give a character +3/+3 or claim favor')
            .target('character', {
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: card => card.isParticipating()
            })
            .select('select', {
                dependsOn: 'character',
                player: Players.Opponent
            }, {
                'Give the character +3/+3': AbilityDsl.actions.cardLastingEffect(context => ({
                    target: context.targets.character,
                    effect: AbilityDsl.effects.modifyBothSkills(3)
                })),
                'Let opponent claim favor': AbilityDsl.actions.claimImperialFavor(context => ({
                    target: context.player
                }))
            })
            .effect('{1}{2}{3}{4}{5}{6}', (context) => context.selects.select.choice === 'Let opponent claim favor' ? [
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
            .max(AbilityDsl.limit.perConflict(1));
    }
}
