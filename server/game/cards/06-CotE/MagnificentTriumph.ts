import { CardType, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { DuelsThisConflict } from '../DuelsThisConflict.js';

export default class MagnificentTriumph extends DrawCard {
    static id = 'magnificent-triumph';

    public setupCardAbilities() {
        const duelWinners = DuelsThisConflict.winners(this.game);
        this.conflictAction('Give a character +2/+2')
            .target({
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: (card) => duelWinners.has(card)
            }, AbilityDsl.actions.cardLastingEffect((context) => ({
                effect: [
                    AbilityDsl.effects.modifyBothSkills(2),
                    AbilityDsl.effects.cardCannot({
                        cannot: 'target',
                        restricts: 'opponentsEvents',
                        applyingPlayer: context.player
                    })
                ]
            })))
            .effect('give {0} +2{1}, +2{2}, and prevent them from being targeted by opponent\'s events', () => ['military', 'political']);
    }
}
