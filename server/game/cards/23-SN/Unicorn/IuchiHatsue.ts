import { modifyBothSkills } from '../../../effects.js';
import { joint, moveToConflict, sendHome } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { Players, CardType } from '../../../Constants.js';
import { msg } from '../../../GameChat.js';

export default class IuchiHatsue extends DrawCard {
    static id = 'iuchi-hatsue';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => {
                if(!context.game.currentConflict) {
                    return false;
                }
                return context.game.currentConflict.getNumberOfParticipantsFor(context.player, (card) => card.type === CardType.Character && card.hasTrait('creature')) > 0;
            },
            effect: modifyBothSkills(2)
        });

        this.conflictAction('Switch 2 characters you control', { evenFromHome: true })
            .target({
                name: 'characterInConflict',
                activePromptTitle: 'Choose a participating character to send home',
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: (card) => card.isParticipating()
            })
            .target({
                name: 'characterAtHome',
                dependsOn: 'characterInConflict',
                activePromptTitle: 'Choose a character to move to the conflict',
                cardType: CardType.Character,
                controller: (context) => context.targets.characterInConflict.controller === context.player ? Players.Self : Players.Opponent,
                player: (context) => context.targets.characterInConflict.controller === context.player ? Players.Self : Players.Opponent
            }, joint([
                sendHome((context) => ({ target: context.targets.characterInConflict })),
                moveToConflict()
            ]))
            .chatText((context) => msg`switch ${context.targets.characterInConflict} and ${context.targets.characterAtHome}`);
    }
}
