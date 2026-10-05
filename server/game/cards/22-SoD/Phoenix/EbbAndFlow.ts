import { CardType, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
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
            }, AbilityDsl.actions.noAction())
            .target({
                name: 'opponents',
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: card => card.isParticipating() && !card.hasDash()
            }, AbilityDsl.actions.cardLastingEffect({
                effect: AbilityDsl.effects.switchBaseSkills()
            }))
            .effect('switch {1}\'s military and political skill', context => [context.targets.opponents])
            .then((context) => {
                return {
                    thenCondition: () => context.player.fate > 0 && context.game.actions.loseFate().canAffect(context.player, context),
                    gameAction: AbilityDsl.actions.onAffinity({
                        trait: 'water',
                        promptTitleForConfirmingAffinity: 'Pay 1 fate to swap abilities?',
                        effect: 'swap the abilities of {0} and {1}',
                        effectArgs: () => [context.targets.mine, context.targets.opponents],
                        gameAction: AbilityDsl.actions.joint([
                            AbilityDsl.actions.loseFate({
                                target: context.player
                            }),
                            AbilityDsl.actions.cardLastingEffect({
                                target: context.targets.mine,
                                effect: [
                                    AbilityDsl.effects.blank(),
                                    AbilityDsl.effects.gainAllAbilities(context.targets.opponents, true)
                                ]
                            }),
                            AbilityDsl.actions.cardLastingEffect({
                                target: context.targets.opponents,
                                effect: [
                                    AbilityDsl.effects.blank(),
                                    AbilityDsl.effects.gainAllAbilities(context.targets.mine, true)
                                ]
                            })
                        ])
                    })
                };
            });
    }
}
