import { CardTypes, Players, Phases } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class CorneringManeuver extends DrawCard {
    static id = 'cornering-maneuver';

    setupCardAbilities() {
        this.action({
            title: 'Give a character +2 mil',
            condition: context => context.game.isDuringConflict('military'),
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card, context) => card.hasTrait('bushi') && card.isParticipatingFor(context.player),
                gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                    effect: AbilityDsl.effects.modifyMilitarySkill(2)
                }))
            },
            effect: 'give {0} +2{1}',
            effectArgs: () => ['military'],
            then: context => ({
                thenCondition: () => context.game.currentConflict.getNumberOfParticipantsFor(context.player) <= context.game.currentConflict.getNumberOfParticipantsFor(context.player.opponent),
                gameAction: AbilityDsl.actions.selectCard({
                    activePromptTitle: 'Choose a character to move',
                    targets: true,
                    optional: false,
                    controller: Players.Self,
                    cardType: CardTypes.Character,
                    message: '{0} moves {1} {2}',
                    messageArgs: card => [context.player, card, card.isParticipating() ? 'home' : 'to the conflict'],
                    gameAction: AbilityDsl.actions.multiple([
                        AbilityDsl.actions.sendHome(),
                        AbilityDsl.actions.moveToConflict()
                    ])
                })
            })
        });
    }
}
