import { CardTypes, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class CorneringManeuver extends DrawCard {
    static id = 'cornering-maneuver';

    setupCardAbilities() {
        this.action({
            title: 'Give a character +2 mil',
            condition: context => context.game.isDuringConflict('military'),
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card, context) => card.isParticipatingFor(context.player),
                gameAction: AbilityDsl.actions.cardLastingEffect(_context => ({
                    effect: AbilityDsl.effects.modifyMilitarySkill(2)
                }))
            },
            effect: 'give {0} +2{1}',
            effectArgs: () => ['military'],
            then: context => ({
                gameAction: AbilityDsl.actions.selectCard({
                    activePromptTitle: 'Choose a character to move',
                    targets: true,
                    optional: true,
                    controller: Players.Self,
                    cardType: CardTypes.Character,
                    message: '{0} moves {1} {2}',
                    messageArgs: card => Array.isArray(card)
                        ? [context?.player, '', '']
                        : [context?.player, card, card.isParticipating() ? 'home' : 'to the conflict'],
                    gameAction: AbilityDsl.actions.multiple([
                        AbilityDsl.actions.sendHome(),
                        AbilityDsl.actions.moveToConflict()
                    ])
                })
            })
        });
    }
}
