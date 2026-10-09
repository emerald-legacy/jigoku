import { CardType, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { joint, moveToConflict, multiple, sendHome } from '../../../GameActions/GameActions.js';
import { msg } from '../../../GameChat.js';

export default class SupplyOfficer extends DrawCard {
    static id = 'supply-officer';

    setupCardAbilities() {
        this.conflictAction('Switch 2 characters you control', { evenFromHome: true })
            .target({
                name: 'characterInConflict',
                activePromptTitle: 'Choose a participating character to send home',
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.isParticipating()
            })
            .target({
                name: 'characterAtHome',
                dependsOn: 'characterInConflict',
                activePromptTitle: 'Choose a character to move to the conflict',
                cardType: CardType.Character,
                controller: Players.Self
            }, multiple([
                joint([
                    sendHome((context) => ({ target: context.targets.characterInConflict })),
                    moveToConflict()
                ])
            ]))
            .chatText((context) => msg`switch ${context.targets.characterInConflict} and ${context.targets.characterAtHome}`)
            .afterwardsIf((context) => !context.targets.characterInConflict.isParticipating())
            .ready((context) => ({ target: context.targets.characterInConflict }))
            .message((context) => msg`${context.targets.characterInConflict} is readied`);
    }
}
