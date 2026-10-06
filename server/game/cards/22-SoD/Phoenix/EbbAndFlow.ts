import { CardType, Players } from '../../../Constants.js';
import { blank, gainAllAbilities, switchBaseSkills } from '../../../effects.js';
import { cardLastingEffect, joint, loseFate, noAction, onAffinity } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class EbbAndFlow extends DrawCard {
    static id = 'ebb-and-flow';

    public setupCardAbilities() {
        this.action('Switch a character\'s skills')
            .target({
                name: 'mine',
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: card => card.isParticipating() && card.hasTrait('shugenja')
            }, noAction())
            .target({
                name: 'opponents',
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: card => card.isParticipating() && !card.hasDash()
            }, cardLastingEffect({
                effect: switchBaseSkills()
            }))
            .effect('switch {1}\'s military and political skill', context => [context.targets.opponents])
            .then((context) => {
                return {
                    thenCondition: () => context.player.fate > 0 && context.game.actions.loseFate().canAffect(context.player, context),
                    gameAction: onAffinity({
                        trait: 'water',
                        promptTitleForConfirmingAffinity: 'Pay 1 fate to swap abilities?',
                        effect: 'swap the abilities of {0} and {1}',
                        effectArgs: () => [context.targets.mine, context.targets.opponents],
                        gameAction: joint([
                            loseFate({
                                target: context.player
                            }),
                            cardLastingEffect({
                                target: context.targets.mine,
                                effect: [
                                    blank(),
                                    gainAllAbilities(context.targets.opponents, true)
                                ]
                            }),
                            cardLastingEffect({
                                target: context.targets.opponents,
                                effect: [
                                    blank(),
                                    gainAllAbilities(context.targets.mine, true)
                                ]
                            })
                        ])
                    })
                };
            });
    }
}
