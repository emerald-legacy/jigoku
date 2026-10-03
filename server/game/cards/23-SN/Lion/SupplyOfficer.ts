import { CardType, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';

export default class SupplyOfficer extends DrawCard {
    static id = 'supply-officer';

    setupCardAbilities() {
        this.conflictAction('Switch 2 characters you control', { evenFromHome: true })
            .target('characterInConflict', {
                activePromptTitle: 'Choose a participating character to send home',
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: card => card.isParticipating()
            })
            .target('characterAtHome', {
                dependsOn: 'characterInConflict',
                activePromptTitle: 'Choose a character to move to the conflict',
                cardType: CardType.Character,
                controller: Players.Self
            }, AbilityDsl.actions.multiple([
                AbilityDsl.actions.joint([
                    AbilityDsl.actions.sendHome(context => ({ target: context.targets.characterInConflict })),
                    AbilityDsl.actions.moveToConflict()
                ])
            ]))
            .effect('switch {1} and {2}', context => [context.targets.characterInConflict, context.targets.characterAtHome])
            .then((context) => {
                const characterInConflict = context.targets.characterInConflict;
                return {
                    message: '{3} is readied',
                    messageArgs: () => [characterInConflict],
                    thenCondition: () => !characterInConflict.isParticipating(),
                    gameAction: AbilityDsl.actions.ready({
                        target: characterInConflict
                    })
                };
            });
    }
}
