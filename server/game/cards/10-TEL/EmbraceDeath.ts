import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardTypes, Players } from '../../Constants.js';

class EmbraceDeath extends DrawCard {
    static id = 'embrace-death';

    setupCardAbilities() {
        this.reaction({
            title: 'Sacrifice a bushi, remove a fate/discard',
            when: {
                afterConflict: (event, context) =>
                    event.conflict.loser === context.player &&
                    context.player.isAttackingPlayer() &&
                    event.conflict.getAttackers().some((card) => card.hasTrait('bushi'))
            },
            cost: AbilityDsl.costs.sacrifice({
                cardType: CardTypes.Character,
                cardCondition: (card) => card.hasTrait('bushi') && card.isAttacking()
            }),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Opponent
            },
            gameAction: AbilityDsl.actions.conditional({
                condition: (context) => context.target.getFate() > 0,
                trueGameAction: AbilityDsl.actions.removeFate((context) => ({
                    target: context.target
                })),
                falseGameAction: AbilityDsl.actions.discardFromPlay((context) => ({
                    target: context.target
                }))
            })
        });
    }
}


export default EmbraceDeath;
