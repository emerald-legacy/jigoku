import { CardType, Players, ConflictType } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class CorneringManeuver extends DrawCard {
    static id = 'cornering-maneuver';

    setupCardAbilities() {
        this.conflictAction('Give a character +2 mil', { conflictType: ConflictType.Military })
            .target({
                cardType: CardType.Character,
                cardCondition: (card, context) => card.isParticipatingFor(context.player)
            }, AbilityDsl.actions.cardLastingEffect({
                effect: AbilityDsl.effects.modifyMilitarySkill(2)
            }))
            .effect('give {0} +2{1}', () => ['military'])
            .then(context => ({
                gameAction: AbilityDsl.actions.selectCard({
                    activePromptTitle: 'Choose a character to move',
                    targets: true,
                    optional: true,
                    controller: Players.Self,
                    cardType: CardType.Character,
                    message: '{0} moves {1} {2}',
                    messageArgs: (card) => [context.player, card, card.isParticipating() ? 'home' : 'to the conflict'],
                    gameAction: AbilityDsl.actions.multiple([
                        AbilityDsl.actions.sendHome(),
                        AbilityDsl.actions.moveToConflict()
                    ])
                })
            }));
    }
}
