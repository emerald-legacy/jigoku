import AbilityDsl from '../../../abilitydsl.js';
import { CardType, Players, CharacterStatus } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class ForcedRetirement extends DrawCard {
    static id = 'forced-retirement';

    public setupCardAbilities() {
        this.action('Remove negative status tokens from a character, and discard it from play')
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => (card.isDishonored || card.isTainted) && !card.isParticipating()
            })
            .gameAction(AbilityDsl.actions.sequentialContext((context) => ({
                gameActions: [
                    AbilityDsl.actions.multiple([
                        AbilityDsl.actions.discardStatusToken({
                            target: context.target.statusTokens.filter(
                                (t) =>
                                    t.grantedStatus === CharacterStatus.Dishonored ||
                                    t.grantedStatus === CharacterStatus.Tainted
                            )
                        }),
                        AbilityDsl.actions.removeFate({
                            target: context.target,
                            amount: context.target.getFate(),
                            recipient: context.target.owner
                        })
                    ]),
                    AbilityDsl.actions.multiple([
                        AbilityDsl.actions.discardFromPlay({
                            target: context.target
                        }),
                        AbilityDsl.actions.gainHonor({
                            target: context.player,
                            amount: 1
                        })
                    ])
                ]
            })))
            .effect('expiate {0}\'s misdeeds by retiring them to the nearest monatery{1} Let them contemplate their sins.', (context) => {
                const target = context.target;
                return [
                    target.fate > 0 ? ', recovering their ' + target.fate + ' fate.' : '.'
                ];
            });
    }
}
